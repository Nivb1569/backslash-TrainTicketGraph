import { ParsedQs } from "qs";
import { RouteFilter } from "../route-types";

export function buildRouteFilterFromQuery(query: ParsedQs): RouteFilter {
  return {
    publicOnly: query.publicOnly === "true",
    sinkOnly: query.sinkOnly === "true",
    vulnerableOnly: query.vulnerableOnly === "true",
  };
}
