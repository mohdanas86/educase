import express from "express";
import dotenv from "dotenv";
import { testConnection } from "./config/database.js";
import schoolRoutes from "./routes/schoolRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use("/api/schools", schoolRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "School Management API",
    endpoints: {
      add: "POST /api/schools/add",
      list: "GET /api/schools/list?latitude=<lat>&longitude=<lon>",
    },
    status: "Server running on port " + port,
  });
});

app.use("*", (req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.use((error, req, res, next) => {
  res.status(500).json({ message: "Server error" });
});

const startServer = async () => {
  await testConnection();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
