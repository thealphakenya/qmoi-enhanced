/**
 * Database Services
 * User and data management utilities
 */

import { db } from "./prisma";
import { errorTracker } from "@/lib/monitoring/error-tracker";

export const getUserById = async (userId: string) => {
  try {
    return await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        role: true,
        accountStatus: true,
        trustScore: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    await errorTracker.track(error as Error, {
      userId,
      endpoint: "getUserById",
      metadata: { operation: "findUnique" },
    });
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    return await db.user.findUnique({
      where: { email },
    });
  } catch (error) {
    await errorTracker.track(error as Error, {
      endpoint: "getUserByEmail",
      metadata: { email },
    });
    return null;
  }
};

export const createUser = async (userData: {
  email: string;
  username: string;
  name?: string;
  avatar?: string;
  role?: string;
}) => {
  try {
    return await db.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        name: userData.name,
        avatar: userData.avatar,
        role: userData.role || "user",
      },
    });
  } catch (error) {
    await errorTracker.track(error as Error, {
      endpoint: "createUser",
      metadata: { email: userData.email },
    });
    return null;
  }
};

export const updateUser = async (
  userId: string,
  data: Partial<{
    name: string;
    avatar: string;
    role: string;
    accountStatus: string;
    trustScore: number;
  }>,
) => {
  try {
    return await db.user.update({
      where: { id: userId },
      data,
    });
  } catch (error) {
    await errorTracker.track(error as Error, {
      userId,
      endpoint: "updateUser",
    });
    return null;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    return await db.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    await errorTracker.track(error as Error, {
      userId,
      endpoint: "deleteUser",
    });
    return null;
  }
};

// User Service
export const userService = {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};

// Transaction Service
export const transactionService = {
  create: async (data: unknown) => {
    try {
      // TODO: Implement with Prisma transaction model
      return { id: `txn-${Date.now()}`, ...data };
    } catch (error) {
      await errorTracker.track(error as Error, {
        endpoint: "transactionService.create",
      });
      return null;
    }
  },
  findMany: async () => [],
};

// Wallet Service
export const walletService = {
  create: async (data: unknown) => {
    try {
      // TODO: Implement with Prisma wallet model
      return { id: `wallet-${Date.now()}`, ...data };
    } catch (error) {
      await errorTracker.track(error as Error, {
        endpoint: "walletService.create",
      });
      return null;
    }
  },
  findMany: async () => [],
  findById: async (walletId: string) => null,
};

export default {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  transactionService,
  walletService,
};
