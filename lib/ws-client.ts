import WebSocket from "ws";

export class WSClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectDelay = 30000; // 30s
  private readonly url: string;
  private readonly onMessage: (msg: any) => void;

  constructor(url: string, onMessage: (msg: any) => void) {
    this.url = url;
    this.onMessage = onMessage;
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url);

    this.ws.on("open", () => {
      console.log(`✅ Connected to ${this.url}`);
      this.reconnectAttempts = 0;
    });

    this.ws.on("message", (data) => {
      try {
        this.onMessage(JSON.parse(data.toString()));
      } catch {
        console.warn("⚠️ Non-JSON message:", data.toString());
      }
    });

    this.ws.on("close", () => {
      console.warn("⚠️ WebSocket closed. Reconnecting...");
      this.reconnect();
    });

    this.ws.on("error", (err) => {
      console.error("❌ WebSocket error:", err);
      this.reconnect();
    });
  }

  private reconnect() {
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, this.maxReconnectDelay);
    setTimeout(() => this.connect(), delay);
    this.reconnectAttempts++;
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn("⚠️ Cannot send message — WebSocket not open");
    }
  }
}
