import { Router, Request, Response } from "express";
import { graphService } from "./index";
import { logger } from "../logger";

export function createGraphRouter(): Router {
  const router = Router();

  router.get("/graph", (req: Request, res: Response) => {
    logger.info({ query: req.query }, "[GET] /graph - start");

    const result = graphService.getGraphWithRoutesFromQuery(req.query);

    logger.info({ routeCount: result.routes.length }, "[GET] /graph - success");

    res.json(result);
  });

  return router;
}
