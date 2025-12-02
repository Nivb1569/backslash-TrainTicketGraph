import { Route } from "../route-types";
import { logger } from "../../../logger";

export abstract class BaseRouteFilter {
  private cachedRoutes: Route[] | null = null;

  abstract readonly id: string;

  protected abstract matches(route: Route): boolean;

  getFilteredRoutes(allRoutes: Route[]): Route[] {
    if (this.cachedRoutes === null) {
      logger.debug(
        { filterId: this.id, totalRoutes: allRoutes.length },
        `[${this.id}] computing filtered routes`
      );

      this.cachedRoutes = allRoutes.filter((r) => this.matches(r));

      logger.debug(
        { filterId: this.id, cachedRoutes: this.cachedRoutes.length },
        `[${this.id}] done filtering`
      );
    } else {
      logger.debug(
        { filterId: this.id, cachedRoutes: this.cachedRoutes.length },
        `[${this.id}] using cached routes`
      );
    }

    return this.cachedRoutes;
  }
}
