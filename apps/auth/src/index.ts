import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth";

const app = new Hono();

const isDevelopment = process.env.NODE_ENV === "development";

const trustedOrigins = [
  "ascora://",
  "ascora://*",

  ...(isDevelopment
    ? ["exp://", "exp://**", "exp://172.20.10.2:8081", "http://localhost:8081"]
    : []),
];

app.use(
  "/api/auth/*",
  cors({
    origin: ["http://localhost:8081", "exp://", "ascora://"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

serve({
  fetch: app.fetch,
  port: 3005,
});

console.log("Better Auth running on http://localhost:3005");
console.log("Better Auth startup configuration:", {
  cwd: process.cwd(),
  nodeEnv: process.env.NODE_ENV,
  isDevelopment,
  baseURL: process.env.BETTER_AUTH_URL,
  apiAudience: process.env.ASCORA_API_AUDIENCE,
  trustedOrigins,
});
