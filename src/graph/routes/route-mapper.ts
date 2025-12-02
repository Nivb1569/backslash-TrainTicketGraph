import { Route } from "./route-types";
import { RouteDto } from "./route-types";

export function toRouteDto(route: Route): RouteDto {
  return {
    nodes: route.nodes,
  };
}

export function toRouteDtos(routes: Route[]): RouteDto[] {
  return routes.map(toRouteDto);
}
