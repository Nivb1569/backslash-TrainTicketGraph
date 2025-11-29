import express from "express";
import cors from "cors";
import { createGraphRouter } from "./graph/graph-controller";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(createGraphRouter());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});