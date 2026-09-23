import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dns from "dns";
import { createApiRouter } from "./server-api";

// Set standard DNS resolution order so localhost works properly in dev
dns.setDefaultResultOrder("ipv4first");

const app = express();
app.use(express.json());

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Mount API routes
app.use("/api", createApiRouter());
app.use(createApiRouter());

// Vite Middleware/Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched successfully on port ${PORT}`);
  });
}

startServer();
