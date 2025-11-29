import { BaseRouteFilter } from "./base-route-filter";
import { Route } from "../route-types";

export class SinkOnlyFilter extends BaseRouteFilter {
  protected matches(route: Route): boolean {
    return route.endsAtSink;
  }
}