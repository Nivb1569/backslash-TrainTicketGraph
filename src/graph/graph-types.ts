export type NodeKind = "service" | "rds" | "sqs" | "sql";
export type VulnerabilitySeverity = "low" | "medium" | "high";

export interface Node {
  name: string;
  kind: NodeKind;

  language?: string;
  path?: string;
  publicExposed?: boolean;
  metadata?: Record<string, unknown>;
  vulnerabilities?: Vulnerability[];
}

export interface Vulnerability {
  file: string;
  severity: VulnerabilitySeverity;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface OriginalEdge {
  from: string;
  to: string | string[];
}

export interface Edge {
  from: string;
  to: string[];
}

export interface OriginalGraph {
  nodes: Node[];
  edges: OriginalEdge[];
}

export interface Graph {
  nodesByName: Map<string, Node>;
  adjacency: Map<string, string[]>;
}

export interface ClientNode extends Node {
  to: string[];
}

export interface ClientGraph {
  nodes: ClientNode[];
}