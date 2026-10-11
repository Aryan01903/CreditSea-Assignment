import app from "./app";
import { connectDb } from "./config/db";
import { env } from "./config/env";

const start = async (): Promise<void> => {
  try {
    await connectDb();
    app.listen(env.port, () => {
      console.log(`API listening on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

start();
