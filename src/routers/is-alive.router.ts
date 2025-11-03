import { Hono } from "hono";
import { isAliveController } from "../controllers/is-alive.controller";

export const isAliveRouter = new Hono();

/**
 * Health check endpoint
 * Returns a simple alive status
 */
isAliveRouter.get("/is-alive", isAliveController);
