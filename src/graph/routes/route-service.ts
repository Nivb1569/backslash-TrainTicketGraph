import { Graph } from "../graph-types";
import { Route } from "./route-types";
import { routesCache } from "./route-cache";
import { PublicFilter } from "./filters/public-filter";
import { SinkFilter } from "./filters/sink-filter";
import { VulnerableFilter } from "./filters/vulnerability-filter";
import { RouteFilterId, RouteFilterStrategy } from "./route-types";
import { logger } from "../../logger";

export interface RoutesRequest {
  filters: RouteFilterId[];
}

const ALL_FILTERS: RouteFilterStrategy[] = [
  new PublicFilter(),
  new SinkFilter(),
  new VulnerableFilter(),
];

const FILTERS_BY_ID = new Map<RouteFilterId, RouteFilterStrategy>(
  ALL_FILTERS.map((f) => [f.id, f])
);

export function getRoutesWithFilter(
  request: RoutesRequest,
  graph: Graph
): Route[] {
  const allRoutes = routesCache.getAllRoutes(graph);

  if (!request.filters || request.filters.length === 0) {
    logger.info(
      { filters: [] },
      "[getRoutesWithFilter] no filters, returning all routes"
    );
    return allRoutes;
  }

  let result = allRoutes;

  for (const filterId of request.filters) {
    const filter = FILTERS_BY_ID.get(filterId);
    if (!filter) {
      logger.warn({ filterId }, "Unknown filter id, skipping");
      continue;
    }

    result = filter.apply(result);
  }

  logger.info(
    { filters: request.filters, resultCount: result.length },
    "[getRoutesWithFilter] returning filtered routes"
  );

  return result;
}
