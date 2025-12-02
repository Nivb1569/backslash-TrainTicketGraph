import { Route } from "../route-types";
import { RouteFilterId, RouteFilterStrategy } from "../route-types";

export class PublicFilter implements RouteFilterStrategy {
  readonly id = RouteFilterId.Public;

  apply(routes: Route[]): Route[] {
    return routes.filter((r) => r.startsAtPublic);
  }
}
