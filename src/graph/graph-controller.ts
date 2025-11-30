import { Router, Request, Response } from "express";
import { graphService } from "./index";
import { RouteFilter } from "./routes/route-service";

export function createGraphRouter(): Router {
  const router = Router();

  router.get("/graph", (req: Request, res: Response) => {
    console.log("[GET] /graph - start");

    const filter: RouteFilter = {
      publicOnly: req.query.publicOnly === "true",
      sinkOnly: req.query.sinkOnly === "true",
      vulnerableOnly: req.query.vulnerableOnly === "true",
    };

    const graph = graphService.getClientGraph();
    const routes = graphService.getRoutes(filter);

    console.log("[GET] /graph - success");

    res.json({
      graph,
      routes,
    });
  });

  return router;
}
