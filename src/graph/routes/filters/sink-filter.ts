import { BaseRouteFilter } from "./base-route-filter";
import { Route } from "../route-types";

export class SinkFilter extends BaseRouteFilter {
  readonly id = "SinkFilter";

  protected matches(route: Route): boolean {
    return route.endsAtSink;
  }
}
