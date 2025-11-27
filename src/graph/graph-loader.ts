import fs from "fs";
import path from "path";
import {
  Graph,
  OriginalGraph,
  Node,
  OriginalEdge,
  Edge,
} from "./graph-types";

function normalizeToArray(to: string | string[]): string[] {
  return Array.isArray(to) ? to : [to];
}

function normalizeEdge(edge: OriginalEdge): Edge {
  return {
    from: edge.from,
    to: normalizeToArray(edge.to),
  };
}

export function loadGraphFromFile(relativePath: string): Graph {
  // Get a full path.
  const fullPath = path.resolve(process.cwd(), relativePath);

  const fileContents = fs.readFileSync(fullPath, "utf8");

  const parsedGraphData: OriginalGraph = JSON.parse(fileContents);

  // Building the map according the name.
  const nodesByName = new Map<string, Node>();
  for (const node of parsedGraphData.nodes) {
    nodesByName.set(node.name, node);
  }

  const adjacency = new Map<string, string[]>();

  for (const edge of parsedGraphData.edges) {
    const normalized = normalizeEdge(edge);
    adjacency.set(normalized.from, normalized.to);
  }

  return {
    nodesByName,
    adjacency,
  };
}
