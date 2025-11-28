import express from "express";
import cors from "cors";
import { loadGraphFromFile } from "./graph/graph-loader";
import { Route } from "./graph/graph-types";

let cachedRoutes: Route[] | null = null;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const graph = loadGraphFromFile("data/train-ticket-be.json"); 

app.get("/ping", (_req, res) => {
  res.json({ ok: true });
});

app.get("/graph", (_req, res) => {
  const nodes = Array.from(graph.nodesByName.values());

  const edges = Array.from(graph.adjacency.entries()).map(
    ([from, to]) => ({
      from,
      to,
    })
  );

  res.json({
    nodes,
    edges,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
