import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: Bun.env.DATABASE_URL });
export const prismaClient = new PrismaClient({ adapter });
