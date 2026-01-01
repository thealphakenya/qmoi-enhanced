/* eslint-env node */
/* eslint-disable no-console, no-undef */
import { prisma } from "../lib/prisma.js";

console.log("Prisma import successful:", !!prisma);
