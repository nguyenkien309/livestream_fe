import { PrismaClient } from "@prisma/client";

// Ensure single instance when hot reload happens
// Prevents unnecessary multiple Prisma clients that mean too many connections
declare global {
  var prisma: PrismaClient | undefined;
}

export const db: PrismaClient = globalThis.prisma || new PrismaClient();

// Production doesn't use hot reload
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
