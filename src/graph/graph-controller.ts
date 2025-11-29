import { Router, Request, Response } from "express";
import { graphService } from "./index";

export function createGraphRouter(): Router {
  const router = Router();

  router.get("/graph", (_req: Request, res: Response) => {
    console.log("[GET] /graph - start");
    const clientGraph = graphService.getClientGraph();
    console.log("[GET] /graph - success");
    res.json(clientGraph);
  });

    return router;
}
