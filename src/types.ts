export type Signal = {
  title: string;
  detail: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
};
export type Analysis = {
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "UNCLEAR";
  headline: string;
  summary: string;
  signals: Signal[];
  safeActions: string[];
  whatToVerify: string[];
  confidenceNote: string;
};