import { prisma } from "../config/prisma";

export type HealthStatus = {
  status: "ok";
  timestamp: string;
  uptime: number;
  database: "connected" | "disconnected";
};

export const getHealthStatus = async (): Promise<HealthStatus> => {
  let database: HealthStatus["database"] = "disconnected";

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = "connected";
  } catch {
    database = "disconnected";
  }

  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: Number(process.uptime().toFixed(2)),
    database,
  };
};
