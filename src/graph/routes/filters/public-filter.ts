import { BaseRouteFilter } from "./base-route-filter";
import { Route } from "../route-types";

export class PublicOnlyFilter extends BaseRouteFilter {
  protected matches(route: Route): boolean {
    return route.startsAtPublic;
  }
}