import { GraphDto, NodeDto, Graph } from "./graph-types";

export function toGraphDto(graph: Graph): GraphDto {
  const nodes: NodeDto[] = [];

  for (const [name, node] of graph.nodesByName.entries()) {
    const neighbors = graph.adjacency.get(name) ?? [];

    nodes.push({
      ...node,
      to: neighbors,
    });
  }

  return { nodes };
}
