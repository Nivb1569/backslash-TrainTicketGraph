import { Route } from "./route-types";
import { ClientRoute } from "./route-types";

export function toClientRoute(route: Route): ClientRoute {
  return {
    nodes: route.nodes,
  };
}

export function toClientRoutes(routes: Route[]): ClientRoute[] {
  return routes.map(toClientRoute);
}
