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
    // Initialize device tracking with a safe local seed (production should replace with real registry)
    this.seedDevices();
  }

  listDevices(): Device[] {
    // Return current known devices. In production this should query a secure device registry.
    return this.devices;
  }

  findDevice(deviceId: string): Device | null {
    // TODO: Integrate with location services
    const device = this.devices.find((d) => d.id === deviceId) || null;
    if (device) {
      void this.notifyMaster("find", deviceId);
    }
    return device;
  }

  lockDevice(deviceId: string): boolean {
    // TODO: Integrate with device management APIs
    void this.notifyMaster("lock", deviceId);
    return true;
  }

  wipeDevice(deviceId: string): boolean {
    // Best-effort: mark device as lost and notify master. Real wipe requires platform APIs.
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      device.status = "lost";
      void this.notifyMaster("wipe", deviceId);
      return true;
    }
    return false;
  }

  private seedDevices() {
    if (this.devices.length) return;
    // Add deterministic sample devices to make UI and tests functional without backend
    this.devices.push(
      { id: "device-1", name: "Victor's Phone", lastSeen: new Date(), status: "online", location: "Nairobi" },
      { id: "device-2", name: "Leah's Tablet", lastSeen: new Date(Date.now() - 1000 * 60 * 60), status: "offline", location: "Nairobi" },
    );
  }

  async notifyMaster(action: string, deviceId: string) {
    // Send real-time alert to master via WhatsApp (safe, non-blocking)
    const device = this.devices.find((d) => d.id === deviceId);
    if (!device) return;
    try {
      await this.whatsapp.sendMessageToMaster(
        `Device action: ${action} on ${device.name} (${device.id})`,
      );
    } catch (err) {
      // Log locally if WhatsApp is not available
      console.warn("notifyMaster: failed to send WhatsApp message:", err);
    }
  }
}
