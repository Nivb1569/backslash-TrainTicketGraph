import express from "express";
import { createGraphRouter } from "./graph/graph-controller";

export function createApp() {
  const app = express();
  app.use(createGraphRouter());
  return app;
}
