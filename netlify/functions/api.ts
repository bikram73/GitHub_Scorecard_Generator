import express from "express";
import serverless from "serverless-http";
import { createApiRouter } from "../../server-api";

const app = express();
app.use(express.json());

// Mount the API router on both root and /api path for Netlify redirect compatibility
app.use("/.netlify/functions/api", createApiRouter());
app.use("/api", createApiRouter());
app.use("/", createApiRouter());

export const handler = serverless(app);
