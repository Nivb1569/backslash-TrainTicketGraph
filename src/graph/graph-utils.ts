import { Node, NodeKind } from "./graph-types";

const SINK_KINDS: ReadonlyArray<NodeKind> = ["rds", "sql"];

export function isPublicNode(node: Node): boolean {
  return node.publicExposed === true;
}

export function isSinkNode(node: Node): boolean {
  return SINK_KINDS.includes(node.kind);
}

export function nodeHasVulnerabilities(node: Node): boolean {
  if (node.vulnerabilities) return node.vulnerabilities.length > 0;
  return false;
}
