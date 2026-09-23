import express, { Request, Response, NextFunction } from "express";
import serverless from "serverless-http";
import { createApiRouter } from "../../server-api";

const app = express();

// Enable CORS and body parsing
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Mount the API router
const router = createApiRouter();
app.use("/.netlify/functions/api", router);
app.use("/api", router);
app.use("/", router);

// Error boundary
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Netlify Serverless Error:", err);
  res.status(500).json({ error: err?.message || "Internal server error" });
});

export const handler = serverless(app);

