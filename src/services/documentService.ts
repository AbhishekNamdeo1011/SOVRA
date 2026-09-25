import type { FileAttachment } from '../types';

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || 'txt' : 'txt';
}

/**
 * Process a real browser File object uploaded by the user via file picker or drag & drop.
 */
export async function processUploadedFile(file: File): Promise<FileAttachment> {
  const ext = getFileExtension(file.name);
  const sizeStr = formatFileSize(file.size);

  let previewUrl: string | undefined = undefined;
  let contentSnippet: string | undefined = undefined;

  // If it's an image, create a data URL for thumbnail preview
  if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) {
    previewUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  } else if (['txt', 'py', 'js', 'cpp', 'csv', 'json'].includes(ext)) {
    contentSnippet = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = (reader.result as string) || '';
        resolve(text.slice(0, 300));
      };
      reader.onerror = () => resolve('');
      reader.readAsText(file);
    });
  }

  return {
    id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: file.name,
    type: ext,
    size: sizeStr,
    sizeBytes: file.size,
    pages: ext === 'pdf' ? Math.floor(Math.random() * 8) + 2 : undefined,
    status: 'ready',
    location: 'local',
    classification: 'uploaded',
    previewUrl,
    contentSnippet,
    fileRef: file,
  };
}

/**
 * Triggers an actual browser download of a generated file (Blob).
 */
export function downloadFile(filename: string, content: string | Blob, mimeType = 'application/octet-stream') {
  let blob: Blob;
  if (content instanceof Blob) {
    blob = content;
  } else {
    blob = new Blob([content], { type: mimeType });
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const SAMPLE_DELIVERABLES: Record<string, string> = {
  'approval_note.docx': `CONFIDENTIAL — FOR INTERNAL USE ONLY
SOVRA Sovereign On-Premise Agentic AI Workbench
Air-Gapped Industrial Audit & Verification Report

DOCUMENT IDENTIFIER: SOVRA-SOP204-APP-2026-09
SUBJECT: Clearance & Final Approval Note for Pressure Vessel Inspection
TARGET FILE: inspection_report.pdf (14 pages processed locally)
INFRASTRUCTURE: Local Node 192.168.1.10 (Zero Cloud APIs)

1. EXECUTIVE FINDINGS:
All 14 scanned pages were processed via on-premise OCR and cross-referenced with internal standard operating procedures:
- SOP-204 (Pressure Vessel Clearance Procedures)
- SOP-117 (Deficiency Classification Matrix)

2. DISCREPANCY ANALYSIS:
- Finding #1 (Vessel V-102): Ultrasonic wall thickness measured at 18.2mm vs 17.5mm threshold. Compliance verified under SOP-117 Section 4.2.
- Finding #2 (Flange G-12): Gasket scheduled for preventative swap at next routine cycle.
- Finding #3 (Relief Valve RV-04): Hydrostatic calibration certificate current through 2027.

3. FINAL CLEARANCE RECOMMENDATION:
Operational clearance is APPROVED. Ready for refinery superintendent sign-off.

PROOF OF SOVEREIGNTY:
External Requests: 0
Cloud AI Calls: 0
Audit Record Hash: 4e9f7a8b92c103e689d028f237ac4a90
Generated locally by SOVRA Workbench.`,

  'verified_code.zip': `SOVRA AIR-GAPPED DOCKER SANDBOX VERIFICATION
Target File: fix_function.py
Isolation: --network=none --memory=512m --read-only

TEST RESULTS:
test_pressure_calc (TestRefinerySafety) ... PASS
test_zero_flow_cutoff (TestRefinerySafety) ... PASS
test_temp_compensation (TestRefinerySafety) ... PASS
test_emergency_trip (TestRefinerySafety) ... PASS

Ran 4 tests in 0.084s
RESULT: ALL TESTS PASSED (100% verification rate)

Patched code fix_function.py:
def calculate_pressure_differential(inlet_p, outlet_p, flow_rate, temp_c):
    if inlet_p <= 0 or outlet_p < 0:
        raise ValueError("Invalid line pressure reading")
    temp_k = temp_c + 273.15
    density_factor = 1.0 - (0.00045 * (temp_k - 293.15))
    delta_p = (inlet_p - outlet_p) * density_factor
    return max(0.0, delta_p * (1.0 + (flow_rate * 0.0012)))

Archived to verified_code.zip for on-premise deployment.`,

  'pid_findings.docx': `SOVRA MULTIMODAL VISION INSPECTION REPORT
Input Diagram: pid_scan.png (High-Resolution Blueprint Raster)
Model Engine: Vision Multimodal (Local Q5_K_M)
Cross-Reference: MAN-PID-01 & Equipment Tag Archive

FINDINGS & DISCREPANCIES DETECTED:
1. [CRITICAL] Junction V-14 Configuration Mismatch:
   Schematic blueprint depicts valve V-14 as Normally Closed (NC), but the scanned tag identifier denotes Normally Open (NO). Reference MAN-PID-01 Section 3.1.
2. [WARNING] Instrument Tag FIC-203:
   Flow indicator controller label is partially degraded on the physical scan. Potential illegibility risk during field maintenance.
3. [OBSERVATION] Bypass Line #4:
   Missing directional flow indicator arrow between pump discharge and recycle header.

RECOMMENDED ACTION:
Dispatch field engineering team for physical tag audit at Junction V-14 before system energization.`
};
