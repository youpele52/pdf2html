import { Hono } from "hono";
import { isAliveRouter } from "./routers/is-alive.router";
import { PORT } from "./constants";

const app = new Hono();

// Mount routers
app.route("/", isAliveRouter);

// Start server

export default {
	port: PORT,
	fetch: app.fetch,
};

console.info(`Server running on http://localhost:${PORT}`);
