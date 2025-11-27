export type NodeKind = "service" | "rds" | "sqs";
export type VulnerabilitySeverity = "low" | "medium" | "high";

export interface Node {
  name: string;
  kind: NodeKind;

  language?: string;
  path?: string;
  publicExposed?: boolean;
  metadata?: Record<string, unknown>;
  vulnerabillity: Vulnerability[];
}

export interface Vulnerability {
  file: string;
  severity: VulnerabilitySeverity;
  message: string;
  metadata?: Record<string, unknown>;
}
