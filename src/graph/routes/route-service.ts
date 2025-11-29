import { Graph, Node} from "../graph-types";
import { Route } from "./route-types";
import { isPublicNode, isSinkNode, nodeHasVulnerabilities } from "../graph-utils";

export interface RouteFilter {
  publicOnly?: boolean;
  sinkOnly?: boolean;
  vulnerableOnly?: boolean;
}

let cachedRoutes: Route[] | null = null;

function computeAllRoutes(graph: Graph): Route[] {
  const routes: Route[] = [];

  function dfs(currentName: string, path: Node[], visited: Set<string>) {
    const currentNode = graph.nodesByName.get(currentName);
    if (!currentNode) {
      return;
    }

    path.push(currentNode);
    visited.add(currentName);

    const neighbors = graph.adjacency.get(currentName) ?? [];
    const isSink = isSinkNode(currentNode);
    const isLeaf = neighbors.length === 0;

    if (isSink || isLeaf) {
      const startNode = path[0];
      const startsAtPublic = isPublicNode(startNode);
      const hasVulnerabilities = path.some((n) => nodeHasVulnerabilities(n));

      routes.push({
        nodes: [...path],
        startsAtPublic,
        endsAtSink: isSink,
        hasVulnerabilities,
      });
    }

    if (!isSink) {
      for (const nextName of neighbors) {
        if (!visited.has(nextName)) {
          dfs(nextName, path, visited);
        }
      }
    }

    path.pop();
    visited.delete(currentName);
  }

  for (const startName of graph.nodesByName.keys()) {
    dfs(startName, [], new Set<string>());
  }

  return routes;
}

export function getRoutesWithFilter(filter: RouteFilter, graph: Graph): Route[] {
  if (cachedRoutes === null) {
    cachedRoutes = computeAllRoutes(graph);
  }

  return cachedRoutes.filter((r) => {
    if (filter.publicOnly && !r.startsAtPublic) return false;
    if (filter.sinkOnly && !r.endsAtSink) return false;
    if (filter.vulnerableOnly && !r.hasVulnerabilities) return false;
    return true;
  });
}
