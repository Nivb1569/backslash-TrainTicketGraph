import { BaseRouteFilter } from "./base-route-filter";
import { Route } from "../route-types";

export class PublicFilter extends BaseRouteFilter {
  readonly id = "PublicFilter";

  protected matches(route: Route): boolean {
    return route.startsAtPublic;
  }
}
