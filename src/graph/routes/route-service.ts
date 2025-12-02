import { Graph } from "../graph-types";
import { Route } from "./route-types";
import { PublicFilter } from "./filters/public-filter";
import { SinkFilter } from "./filters/sink-filter";
import { VulnerableFilter } from "./filters/vulnerability-filter";
import { routesCache } from "./route-cache";
import { logger } from "../../logger";

export interface RouteFilter {
  publicOnly?: boolean;
  sinkOnly?: boolean;
  vulnerableOnly?: boolean;
}

const publicFilter = new PublicFilter();
const sinkFilter = new SinkFilter();
const vulnerableFilter = new VulnerableFilter();

function intersect(a: Route[], b: Route[]): Route[] {
  const setB = new Set(b);
  return a.filter((r) => setB.has(r));
}

export function getRoutesWithFilter(
  filter: RouteFilter,
  graph: Graph
): Route[] {
  const allRoutes = routesCache.getAllRoutes(graph);

  const activeArrays: Route[][] = [];

  if (filter.publicOnly) {
    activeArrays.push(publicFilter.getFilteredRoutes(allRoutes));
  }
  if (filter.sinkOnly) {
    activeArrays.push(sinkFilter.getFilteredRoutes(allRoutes));
  }
  if (filter.vulnerableOnly) {
    activeArrays.push(vulnerableFilter.getFilteredRoutes(allRoutes));
  }

  if (activeArrays.length === 0) {
    logger.info(
      { filter },
      "[getRoutesWithFilter] no filters, returning all routes"
    );
    return allRoutes;
  }

  let result: Route[] = allRoutes;
  for (const arr of activeArrays) {
    result = intersect(result, arr);
  }

  logger.info(
    { filter, resultCount: result.length },
    "[getRoutesWithFilter] returning filtered routes"
  );

  return result;
}
