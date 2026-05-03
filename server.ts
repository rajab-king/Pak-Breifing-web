import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cron from "node-cron";
import axios from "axios";
// import admin from "firebase-admin";

// Initialize Firebase Admin (uses Application Default Credentials or env var)
// try {
//   admin.initializeApp();
// } catch (error) {
//   console.warn("Firebase Admin failed to initialize. Cron jobs may not be able to write to Firestore.", error);
// }

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Example News API route to fetch safely on backend
  app.get("/api/news", async (req, res) => {
    try {
      const q = req.query.q || "Pakistan";
      const apiKey = process.env.NEWS_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "NEWS_API_KEY not configured." });
      }
      
      const response = await axios.get(`https://gnews.io/api/v4/search?q=${encodeURIComponent(q as string)}&lang=en&token=${apiKey}`);
      res.json(response.data);
    } catch (error: any) {
      console.error("News API Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  // Cron Job for auto fetch (every 1 hour)
  cron.schedule("0 * * * *", async () => {
    console.log("Running hourly news fetch cron job...");
    // Logic to fetch and cache to Firestore goes here
    // In full implementation, we'll use firebase-admin
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // For React Router SPAs
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
