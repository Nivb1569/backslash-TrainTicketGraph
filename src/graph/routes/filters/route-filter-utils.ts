import { ParsedQs } from "qs";
import { RoutesRequest } from "../route-service";
import { RouteFilterId } from "../route-types";

export function buildRoutesRequestFromQuery(query: ParsedQs): RoutesRequest {
  const filters: RouteFilterId[] = [];

  if (query.publicOnly === "true") {
    filters.push(RouteFilterId.Public);
  }
  if (query.sinkOnly === "true") {
    filters.push(RouteFilterId.Sink);
  }
  if (query.vulnerableOnly === "true") {
    filters.push(RouteFilterId.Vulnerable);
  }

  return { filters };
}
