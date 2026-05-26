export interface ProdiceIntegration {
  connect(): Promise<boolean>;
  sendCommand(command: string): Promise<{ result: string } | { error: string }>;
  autoDetect(): Promise<boolean>;
}

const createStubIntegration = (name: string): ProdiceIntegration => ({
  async connect() {
    console.log(`[${name}] connect()`);
    return true;
  },

  async sendCommand(command: string) {
    console.log(`[${name}] sendCommand():`, command);
    return { result: "success" };
  },

  async autoDetect() {
    console.log(`[${name}] autoDetect()`);
    return true;
  },
});

export const TVDecoderIntegration = createStubIntegration("TV Decoder");
export const CarRadioIntegration = createStubIntegration("Car Radio");
export const SmartHomeIntegration = createStubIntegration("Smart Home");
export const WhatsAppIntegration = createStubIntegration("WhatsApp");
export const ColabDagshubIntegration = createStubIntegration("Colab/Dagshub");
export const AWSIntegration = createStubIntegration("AWS");

let azureCreds: { tenantId: string; clientId: string; clientSecret: string; subscriptionId: string } | null = null;

export const AzureIntegration: ProdiceIntegration = {
  async connect(creds?: { tenantId: string; clientId: string; clientSecret: string; subscriptionId: string }) {
    console.log("[Azure] connect()");
    if (creds) {
      azureCreds = creds;
    }
    return !!azureCreds;
  },

  async sendCommand(command: string) {
    console.log("[Azure] sendCommand():", command);
    return { result: "success" };
  },

  async autoDetect() {
    console.log("[Azure] autoDetect()");
    return !!azureCreds;
  },
};

let gcpCreds: { projectId: string; keyFilename: string } | null = null;

export const GCPIntegration: ProdiceIntegration = {
  async connect(creds?: { projectId: string; keyFilename: string }) {
    console.log("[GCP] connect()");
    if (creds) {
      gcpCreds = creds;
    }
    return !!gcpCreds;
  },

  async sendCommand(command: string) {
    console.log("[GCP] sendCommand():", command);
    return { result: "success" };
  },

  async autoDetect() {
    console.log("[GCP] autoDetect()");
    return !!gcpCreds;
  },
};
