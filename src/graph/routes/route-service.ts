import { Graph } from "../graph-types";
import { Route } from "./route-types";
import { computeAllRoutes } from "./compute-all-routes"
import { PublicFilter } from "./filters/public-filter";
import { SinkFilter } from "./filters/sink-filter";
import { VulnerableFilter } from "./filters/vulnerability-filter";

export interface RouteFilter {
  publicOnly?: boolean;
  sinkOnly?: boolean;
  vulnerableOnly?: boolean;
}

let cachedAllRoutes: Route[] | null = null;

const publicFilter = new PublicFilter();
const sinkFilter = new SinkFilter();
const vulnerableFilter = new VulnerableFilter();

function getAllRoutes(graph: Graph): Route[] {
  if (cachedAllRoutes === null) {
    cachedAllRoutes = computeAllRoutes(graph);
  }
  return cachedAllRoutes;
}

function intersect(a: Route[], b: Route[]): Route[] {
  const setB = new Set(b);
  return a.filter(r => setB.has(r));
}

export function getRoutesWithFilter(filter: RouteFilter, graph: Graph): Route[] {
  const allRoutes = getAllRoutes(graph);

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
    return allRoutes;
  }

  let result: Route[] = allRoutes;
  for (const arr of activeArrays) {
    result = intersect(result, arr);
  }

  return result;
}