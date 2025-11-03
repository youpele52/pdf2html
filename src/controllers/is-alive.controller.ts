import type { Context } from "hono";

/**
 * Health check controller
 * Returns a simple JSON response indicating the service is alive
 */
export async function isAliveController(c: Context) {
  return c.json({
    status: "alive and kicking",
    timestamp: new Date().toISOString(),
  });
}
