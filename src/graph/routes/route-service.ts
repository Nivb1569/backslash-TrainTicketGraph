import { Graph } from "../graph-types";
import { Route } from "./route-types";
import { routesCache } from "./route-cache";
import { logger } from "../../logger";
import { FILTERS_CONFIG } from "./route-filters-registry";

export interface RouteFilter {
  publicOnly?: boolean;
  sinkOnly?: boolean;
  vulnerableOnly?: boolean;
}

function intersect(a: Route[], b: Route[]): Route[] {
  const setB = new Set(b);
  return a.filter((r) => setB.has(r));
}

export function getRoutesWithFilter(
  filter: RouteFilter,
  graph: Graph
): Route[] {
  const allRoutes = routesCache.getAllRoutes(graph);

  const enabledFilters = FILTERS_CONFIG.filter((cfg) => filter[cfg.flag]);

  if (enabledFilters.length === 0) {
    logger.info(
      { filter },
      "[getRoutesWithFilter] no filters, returning all routes"
    );
    return allRoutes;
  }

  let result: Route[] = allRoutes;

  for (const cfg of enabledFilters) {
    const filtered = cfg.filter.getFilteredRoutes(allRoutes);
    result = intersect(result, filtered);
  }

  logger.info(
    {
      filter,
      enabledFlags: enabledFilters.map((f) => f.flag),
      resultCount: result.length,
    },
    "[getRoutesWithFilter] returning filtered routes"
  );

  return result;
}
