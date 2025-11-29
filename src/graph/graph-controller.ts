import { Router, Request, Response } from "express";
import { graphService } from "./index";
import {RouteFilter} from "./routes/route-service";

export function createGraphRouter(): Router {
  const router = Router();

  router.get("/graph", (_req: Request, res: Response) => {
    console.log("[GET] /graph - start");
    const filter: RouteFilter = {
        publicOnly: _req.query.publicOnly === "true",
        sinkOnly: _req.query.sinkOnly === "true",
        vulnerableOnly: _req.query.vulnerableOnly === "true",
    };
    const clientGraph = graphService.getClientGraph();

    console.log("[GET] /graph - success");
    res.json(clientGraph);
  });

    return router;
}
