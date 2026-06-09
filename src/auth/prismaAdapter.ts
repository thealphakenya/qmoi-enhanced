import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export class PrismaAuthAdapter {
  async registerUser(username: string, email: string, password: string, role: string = 'user') {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not configured');
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    const prefs = { theme: 'system', notifications: true, tradingEnabled: false };
    const user = await prisma.user.create({ data: { username, email, role, passwordHash, salt, preferences: prefs } });
    return user;
  }

  async login(email: string, password: string, ip: string, userAgent: string) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not configured');
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');
    const passwordHash = crypto.pbkdf2Sync(password, (user as any).salt, 1000, 64, 'sha512').toString('hex');
    if (passwordHash !== (user as any).passwordHash) throw new Error('Invalid credentials');

    const session = await prisma.session.create({ data: {
      userId: user.id,
      sessionId: crypto.randomBytes(32).toString('hex'),
      expiresAt: new Date(Date.now() + 24*60*60*1000),
      ipAddress: ip,
      userAgent,
    }});

    await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
    return session;
  }

  async logout(sessionId: string) {
    await prisma.session.deleteMany({ where: { id: sessionId } });
  }

  async validateSession(sessionId: string) {
    const s = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!s) return false;
    if (s.expiresAt.getTime() < Date.now()) {
      await prisma.session.delete({ where: { id: sessionId } });
      return false;
    }
    return true;
  }

  async getUser(sessionId: string) {
    const s = await prisma.session.findUnique({ where: { id: sessionId }, include: { user: true } });
    return s?.user || null;
  }

  async hasAccess(sessionId: string, feature: string) {
    const user = await this.getUser(sessionId);
    if (!user) return false;
    if ((user as any).role === 'master') return true;
    const masterOnly = ['trading','invention_projects','system_configuration','user_management','download_qcity'];
    return !masterOnly.includes(feature);
  }

  async updateUserPreferences(sessionId: string, preferences: any) {
    const user = await this.getUser(sessionId);
    if (!user) throw new Error('Session not found');
    const merged = { ...(user as any).preferences, ...preferences };
    const updated = await prisma.user.update({ where: { id: (user as any).id }, data: { preferences: merged } });
    return updated;
  }

  async changePassword(sessionId: string, currentPassword: string, newPassword: string) {
    const user = await this.getUser(sessionId);
    if (!user) throw new Error('Session not found');
    const salt = (user as any).salt;
    const currentHash = crypto.pbkdf2Sync(currentPassword, salt, 1000, 64, 'sha512').toString('hex');
    if (currentHash !== (user as any).passwordHash) throw new Error('Invalid current password');
    const newSalt = crypto.randomBytes(16).toString('hex');
    const newHash = crypto.pbkdf2Sync(newPassword, newSalt, 1000, 64, 'sha512').toString('hex');
    await prisma.user.update({ where: { id: (user as any).id }, data: { passwordHash: newHash, salt: newSalt } });
  }

  async changeEmail(sessionId: string, newEmail: string) {
    const user = await this.getUser(sessionId);
    if (!user) throw new Error('Session not found');
    const exists = await prisma.user.findUnique({ where: { email: newEmail } });
    if (exists) throw new Error('Email already in use');
    const updated = await prisma.user.update({ where: { id: (user as any).id }, data: { email: newEmail } });
    return updated;
  }
}

export default new PrismaAuthAdapter();
