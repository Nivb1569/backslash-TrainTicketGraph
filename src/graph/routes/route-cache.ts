import { Graph } from "../graph-types";
import { Route } from "./route-types";
import { computeAllRoutes } from "./compute-all-routes";

export class RoutesCache {
  private cachedAllRoutes: Route[] | null = null;

  getAllRoutes(graph: Graph): Route[] {
    if (this.cachedAllRoutes === null) {
      this.cachedAllRoutes = computeAllRoutes(graph);
    }
    return this.cachedAllRoutes;
  }

  clear(): void {
    this.cachedAllRoutes = null;
  }
}

export const routesCache = new RoutesCache();
