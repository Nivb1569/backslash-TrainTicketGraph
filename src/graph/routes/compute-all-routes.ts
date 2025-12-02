import { Graph, Node } from "../graph-types";
import { Route } from "./route-types";
import {
  isPublicNode,
  isSinkNode,
  nodeHasVulnerabilities,
} from "../graph-utils";
import { logger } from "../../logger";

export function computeAllRoutes(graph: Graph): Route[] {
  logger.debug(
    { nodeCount: graph.nodesByName.size },
    "[computeAllRoutes] computing all routes from graph (with prefixes)..."
  );
  const routes: Route[] = [];

  function addRoute(path: Node[]) {
    if (path.length === 0) {
      return;
    }

    const startNode = path[0];
    const endNode = path[path.length - 1];

    const startsAtPublic = startNode ? isPublicNode(startNode) : false;
    const endsAtSink = endNode ? isSinkNode(endNode) : false;
    const hasVulnerabilities = path.some((n) => nodeHasVulnerabilities(n));

    routes.push({
      nodes: [...path],
      startsAtPublic,
      endsAtSink,
      hasVulnerabilities,
    });
  }

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

    addRoute(path);

    const neighbors = graph.adjacency.get(currentName) ?? [];

    for (const nextName of neighbors) {
      dfs(nextName, path, visited);
    }

    path.pop();
    visited.delete(currentName);
  }

  for (const startName of graph.nodesByName.keys()) {
    dfs(startName, [], new Set<string>());
  }

  logger.debug(
    { routeCount: routes.length },
    "[computeAllRoutes] done computing routes"
  );

  return routes;
}
