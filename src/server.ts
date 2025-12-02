import { createApp } from "./app";
import { logger } from "./logger";

const app = createApp();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info({ port }, `[server] listening on http://localhost:${port}`);
});
