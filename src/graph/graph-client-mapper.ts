import { ClientGraph, ClientNode, Graph } from "./graph-types";

export function toClientGraph(graph: Graph): ClientGraph {
  const nodes: ClientNode[] = [];

  for (const [name, node] of graph.nodesByName.entries()) {
    const neighbors = graph.adjacency.get(name) ?? [];

    nodes.push({
      ...node,
      to: neighbors,
    });
  }

  return { nodes };
}
