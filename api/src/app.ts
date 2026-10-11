import compression from "compression";
import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/auth.routes";
import borrowerRoutes from "./routes/borrower.routes";
import operationsRoutes from "./routes/operations.routes";

const app = express();

app.use(cors({ origin: env.clientUrl }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/borrower", borrowerRoutes);
app.use("/api/operations", operationsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
