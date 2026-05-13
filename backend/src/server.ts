import app from "./app";
import { disconnectPrisma } from "./config/prisma";
import { env } from "./config/env";

const server = app.listen(env.PORT, () => {
  console.log(`[server] API running on http://localhost:${env.PORT}`);
});

const gracefulShutdown = (signal: string): void => {
  console.log(`[server] ${signal} received. Closing server...`);

  server.close(async () => {
    try {
      await disconnectPrisma();
      console.log("[server] Prisma disconnected.");
    } catch (error) {
      console.error("[server] Error while disconnecting Prisma:", error);
    } finally {
      console.log("[server] Server stopped.");
      process.exit(0);
    }
  });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
