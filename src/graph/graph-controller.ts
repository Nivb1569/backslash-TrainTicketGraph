import { Router, Request, Response } from "express";
import { graphService } from "./index";
import { RouteFilter } from "./routes/route-service";
import { ClientRoute } from "./routes/route-types";
import { buildRouteFilterFromQuery } from "./routes/filters/route-filter-utils";
import { toClientRoutes } from "./routes/route-mapper";

export function createGraphRouter(): Router {
  const router = Router();

  router.get("/graph", (req: Request, res: Response) => {
    console.log("[GET] /graph - start");

    const filter: RouteFilter = buildRouteFilterFromQuery(req.query);

    const graph = graphService.getClientGraph();
    const routes = graphService.getRoutes(filter);
    const clientRoutes: ClientRoute[] = toClientRoutes(routes);

    console.log("[GET] /graph - success");

    res.json({
      graph,
      routes: clientRoutes,
    });
  });

  return router;
}
