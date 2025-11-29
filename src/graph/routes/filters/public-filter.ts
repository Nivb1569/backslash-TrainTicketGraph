import { BaseRouteFilter } from "./base-route-filter";
import { Route } from "../route-types";

export class PublicFilter extends BaseRouteFilter {
  protected matches(route: Route): boolean {
    return route.startsAtPublic;
  }
}