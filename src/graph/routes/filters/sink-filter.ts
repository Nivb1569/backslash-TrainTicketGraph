import { Route } from "../route-types";
import { RouteFilterId, RouteFilterStrategy } from "../route-types";

export class SinkFilter implements RouteFilterStrategy {
  readonly id = RouteFilterId.Sink;

  apply(routes: Route[]): Route[] {
    return routes.filter((r) => r.endsAtSink);
  }
}
