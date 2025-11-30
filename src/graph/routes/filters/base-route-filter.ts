import { Route } from "../route-types";

export abstract class BaseRouteFilter {
  private cachedRoutes: Route[] | null = null;

  protected abstract matches(route: Route): boolean;

  getFilteredRoutes(allRoutes: Route[], name: string): Route[] {
    if (this.cachedRoutes === null) {
      console.log(`[${name}] computing filtered routes from allRoutes (${allRoutes.length})`);
      this.cachedRoutes = allRoutes.filter((r) => this.matches(r));
      console.log(`[${name}] done. cached ${this.cachedRoutes.length} routes`);
    } else {
      console.log(`[${name}] using cached routes (${this.cachedRoutes.length})`);
    }

    return this.cachedRoutes;
  }
}
