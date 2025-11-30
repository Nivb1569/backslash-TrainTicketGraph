import { Graph, Node } from "../graph-types";
import { Route } from "./route-types";
import { isPublicNode, isSinkNode, nodeHasVulnerabilities } from "../graph-utils";

export function computeAllRoutes(graph: Graph): Route[] {
  console.log("[computeAllRoutes] computing all routes from graph...");
  const routes: Route[] = [];

  function dfs(currentName: string, path: Node[], visited: Set<string>) {
    if (visited.has(currentName)) {
      return;
    }

    const currentNode = graph.nodesByName.get(currentName);
    if (!currentNode) {
      return;
    }

    path.push(currentNode);
    visited.add(currentName);

    const neighbors = graph.adjacency.get(currentName) ?? [];
    const isSink = isSinkNode(currentNode);
    const isLeaf = neighbors.length === 0;

    if (isLeaf) {
      const startNode = path[0];
      const startsAtPublic = startNode ? isPublicNode(startNode) : false;
      const hasVulnerabilities = path.some((n) => nodeHasVulnerabilities(n));

      routes.push({
        nodes: [...path],
        startsAtPublic,
        endsAtSink: isSink,
        hasVulnerabilities,
      });
    } else {
      for (const nextName of neighbors) {
        dfs(nextName, path, visited);
      }
    }

    path.pop();
    visited.delete(currentName);
  }

  for (const startName of graph.nodesByName.keys()) {
    dfs(startName, [], new Set<string>());
  }

  console.log(`[computeAllRoutes] done. total routes: ${routes.length}`);
  return routes;
}
