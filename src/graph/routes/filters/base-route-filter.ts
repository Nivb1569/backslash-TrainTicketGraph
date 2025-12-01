import { Route } from "../route-types";

export abstract class BaseRouteFilter {
  private cachedRoutes: Route[] | null = null;

  protected abstract matches(route: Route): boolean;

  getFilteredRoutes(allRoutes: Route[], name: string): Route[] {
    if (this.cachedRoutes === null) {
      this.cachedRoutes = allRoutes.filter((r) => this.matches(r));
    }

    return this.cachedRoutes;
  }
}