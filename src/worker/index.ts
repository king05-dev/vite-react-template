import { Hono } from "hono";
import { cors } from "hono/cors";
import { userRoutes } from "./routes/users";

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for all routes
app.use('*', cors({
  origin: ['http://localhost:5173', 'https://marinehub-manager.pages.dev'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Health check endpoint
app.get("/api/", (c) => c.json({ 
  name: "MarineHub Manager API", 
  version: "1.0.0",
  status: "healthy" 
}));

// User management routes
app.route("/api/users", userRoutes);

// 404 handler
app.notFound((c) => c.json({ error: "Not Found" }, 404));

// Error handler
app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
