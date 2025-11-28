import { Node } from "./graph-types";

export function isPublicNode(node: Node): boolean
{
    return node.publicExposed === true;
}

export function isSinkNode(node: Node): boolean {
  return node.kind === "rds" || node.kind === "sqs";
}

export function nodeHasVulnerabilities(node:Node) : boolean
{
    if (node.vulnerabilities)
        return node.vulnerabilities.length > 0;
    return false;
}