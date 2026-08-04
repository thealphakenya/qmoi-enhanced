// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/DeviceTrackingService.ts -->
// DeviceTrackingService: Tracks devices, provides security actions, and integrates with WhatsApp
import { WhatsAppService } from "./WhatsAppService";

export interface Device {
  id: string;
  name: string;
  lastSeen: Date;
  status: "online" | "offline" | "lost";
  location?: string;
}

export class DeviceTrackingService {
  private devices: Device[] = [];
  private whatsapp: WhatsAppService;

  constructor(whatsappService: WhatsAppService) {
    this.whatsapp = whatsappService;
    // Initialize device tracking
  }

  listDevices(): Device[] {
    // Production: integrate with real device registry for persistent storage
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // Production: integrate with location services API for real coordinates
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Production: integrate with platform device management APIs
    this.notifyMaster("wipe", deviceId);
    return true;
  }

  notifyMaster(action: "find" | "lock" | "wipe", deviceId: string): void {
    // Send real-time alert to master via WhatsApp
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const message = `Device action: ${action} on ${device.name} (${device.id})`;
      // intentionally not awaiting to avoid blocking callers
      void this.whatsapp.sendMessageToMaster(message);
    }
  }
}
