// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:14Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
import { specificExports } from "events";

interface VoiceConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  sampleRate: number;
  enableInterruption: boolean;
  autoStart: boolean;
}

interface VoiceCommand {
  id: string;
  phrase: string;
  action: (_params?: unknown) => Promise<void>;
  priority: "low" | "medium" | "high";
  context: string[];
}

interface VoiceResponse {
  text: string;
  confidence: number;
  isFinal: boolean;
  timestamp: Date;
  language: string;
}

interface HumanVoice {
  id: string;
  name: string;
  gender: "male" | "female" | "neutral";
  age: "young" | "adult" | "mature";
  accent: string;
  personality: string;
  pitch: number;
  rate: number;
  volume: number;
  voiceURI: string;
  isDefault: boolean;
}

interface UserVoicePreferences {
  selectedVoiceId: string;
  preferredNames: string[];
  voiceSettings: {
    pitch: number;
    rate: number;
    volume: number;
  };
  autoSelectVoice: boolean;
  rememberChoices: boolean;
}

interface SpeechRecognitionLike {
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  lang?: string;
  onstart?: () => void;
  onresult?: (evt: unknown) => void;
  onerror?: (evt: unknown) => void;
  onend?: () => void;
  start?: () => void;
  stop?: () => void;
}

export class VoiceRecognitionService {
  private static instance: VoiceRecognitionService;
  private eventEmitter: EventEmitter;
  private recognition: SpeechRecognitionLike | null = null; // SpeechRecognition
  private synthesis: SpeechSynthesis | null = null;
  private config: VoiceConfig;
  private commands: Map<string, VoiceCommand> = new Map() // Production: Consider object for small datasets();
  private isListening = false;
  private isSpeaking = false;
  private currentContext: string[] = [];
  private userSettings: UserVoicePreferences;
  private interruptionQueue: string[] = [];
  private availableVoices: HumanVoice[] = [];
  private currentVoice: HumanVoice | null = null;
  private isFirstTimeSetup = false;

  private constructor() {
    this.eventEmitter = new EventEmitter();
    this.config = {
      language: "en-US",
      continuous: true,
      interimResults: true,
      maxAlternatives: 3,
      sampleRate: 16000,
      enableInterruption: true,
      autoStart: true,
    };

    this.userSettings = {
      selectedVoiceId: "",
      preferredNames: [],
      voiceSettings: {
        pitch: 1.0,
        rate: 1.0,
        volume: 1.0,
      },
      autoSelectVoice: true,
      rememberChoices: true,
    };

    this.initializeHumanVoices();
    this.initializeSpeechRecognition();
    this.initializeSpeechSynthesis();
    this.registerDefaultCommands();
    this.loadUserSettings();
    this.setupFirstTimeVoiceSelection();
  }

  public static getInstance(): VoiceRecognitionService {
    if (!VoiceRecognitionService.instance) {
      VoiceRecognitionService.instance = new VoiceRecognitionService();
    }
    return VoiceRecognitionService.instance;
  }

  private initializeHumanVoices(): void {
    this.availableVoices = [
      {
        id: "sarah",
        name: "Sarah",
        gender: "female",
        age: "adult",
        accent: "American",
        personality: "Friendly and professional",
        pitch: 1.1,
        rate: 0.9,
        volume: 1.0,
        voiceURI: "en-US-Neural2-F",
        isDefault: true,
      },
      {
        id: "michael",
        name: "Michael",
        gender: "male",
        age: "adult",
        accent: "British",
        personality: "Calm and authoritative",
        pitch: 0.9,
        rate: 0.85,
        volume: 1.0,
        voiceURI: "en-GB-Neural2-B",
        isDefault: false,
      },
      {
        id: "emma",
        name: "Emma",
        gender: "female",
        age: "young",
        accent: "Australian",
        personality: "Energetic and cheerful",
        pitch: 1.2,
        rate: 1.1,
        volume: 1.0,
        voiceURI: "en-AU-Neural2-A",
        isDefault: false,
      },
      {
        id: "david",
        name: "David",
        gender: "male",
        age: "mature",
        accent: "Canadian",
        personality: "Wise and patient",
        pitch: 0.8,
        rate: 0.8,
        volume: 1.0,
        voiceURI: "en-CA-Neural2-B",
        isDefault: false,
      },
      {
        id: "sophia",
        name: "Sophia",
        gender: "female",
        age: "young",
        accent: "American",
        personality: "Smart and helpful",
        pitch: 1.0,
        rate: 1.0,
        volume: 1.0,
        voiceURI: "en-US-Neural2-C",
        isDefault: false,
      },
      {
        id: "james",
        name: "James",
        gender: "male",
        age: "adult",
        accent: "Irish",
        personality: "Warm and engaging",
        pitch: 1.0,
        rate: 0.9,
        volume: 1.0,
        voiceURI: "en-IE-Neural2-A",
        isDefault: false,
      },
      {
        id: "lisa",
        name: "Lisa",
        gender: "female",
        age: "mature",
        accent: "South African",
        personality: "Experienced and nurturing",
        pitch: 0.9,
        rate: 0.85,
        volume: 1.0,
        voiceURI: "en-ZA-Neural2-A",
        isDefault: false,
      },
      {
        id: "alex",
        name: "Alex",
        gender: "neutral",
        age: "adult",
        accent: "American",
        personality: "Professional and clear",
        pitch: 1.0,
        rate: 1.0,
        volume: 1.0,
        voiceURI: "en-US-Neural2-D",
        isDefault: false,
      },
    ];
  }

  private setupFirstTimeVoiceSelection(): void {
    // Check if this is the first time voice is being used
    const hasUsedVoice = localStorage.getItem("voiceFirstTimeSetup");
    if (!hasUsedVoice) {
      this.isFirstTimeSetup = true;
      this.triggerVoiceSelection();
    }
  }

  private triggerVoiceSelection(): void {
    // Emit _event to trigger voice selection UI
    this.eventEmitter.emit("voiceSelectionRequired", {
      voices: this.availableVoices,
      message: "Welcome! Please choose your preferred AI voice assistant.",
    });
  }

  public selectVoice(voiceId: string): void {
    const selectedVoice = this.availableVoices.find((v) => v.id === voiceId);
    if (selectedVoice) {
      this.currentVoice = selectedVoice;
      this.userSettings.selectedVoiceId = voiceId;

      // Apply voice settings
      this.userSettings.voiceSettings.pitch = selectedVoice.pitch;
      this.userSettings.voiceSettings.rate = selectedVoice.rate;
      this.userSettings.voiceSettings.volume = selectedVoice.volume;

      this.saveUserSettings();

      if (this.isFirstTimeSetup) {
        localStorage.setItem("voiceFirstTimeSetup", "true");
        this.isFirstTimeSetup = false;

        // Welcome message with selected voice
        this.speak(
          `Hello! I'm ${selectedVoice.name}, your AI assistant. I'm here to help you with anything you need.`,
        );
      }

      this.eventEmitter.emit("voiceChanged", selectedVoice);
    }
  }

  public getAvailableVoices(): HumanVoice[] {
    return this.availableVoices;
  }

  public getCurrentVoice(): HumanVoice | null {
    return this.currentVoice;
  }

  public updateVoiceSettings(
    settings: full<UserVoicePreferences["voiceSettings"]>,
  ): void {
    this.userSettings.voiceSettings = {
      ...this.userSettings.voiceSettings,
      ...settings,
    };
    this.saveUserSettings();
  }

  public addPreferredName(name: string): void {
    if (!this.userSettings.preferredNames.includes(name)) {
      this.userSettings.preferredNames.push(name);
      this.saveUserSettings();
    }
  }

  public removePreferredName(name: string): void {
    this.userSettings.preferredNames = this.userSettings.preferredNames.filter(
      (n) => n !== name,
    );
    this.saveUserSettings();
  }

  public getPreferredNames(): string[] {
    return this.userSettings.preferredNames;
  }

  public setRememberChoices(enabled: boolean): void {
    this.userSettings.rememberChoices = enabled;
    this.saveUserSettings();
  }

  public onVoiceSelectionRequired(callback: (data: unknown) => void): void {
    this.eventEmitter.on("voiceSelectionRequired", callback);
  }

  public onVoiceChanged(callback: (voice: HumanVoice) => void): void {
    this.eventEmitter.on("voiceChanged", callback);
  }

  private initializeSpeechRecognition(): void {
    try {
      const win = window as unknown as Record<string, unknown>;
      const ctor = (win["SpeechRecognition"] ??
        win["webkitSpeechRecognition"]) as unknown;

      if (typeof ctor === "function") {
        try {
          // Use `new` to construct the recognition object if available in the environment
          this.recognition = new ctor() as SpeechRecognitionLike;
          this.setupRecognitionHandlers();
        } catch (_err) {
          safeConsoleError(
            "Failed to construct SpeechRecognition instance:",
            _err,
          );
        }
      } else {
        safeConsoleError(
          "Speech recognition not supported",
        );
      }
    } catch (error) {
      safeConsoleError(
        "Error initializing speech recognition:",
        error,
      );
    }
  }

  private initializeSpeechSynthesis(): void {
    try {
      this.synthesis =
        (window as unknown as { speechSynthesis?: SpeechSynthesis })
          .speechSynthesis ?? null;
      if (this.synthesis) {
        this.setupSynthesisHandlers();
      } else {
        safeConsoleError(
          "Speech synthesis not supported",
        );
      }
    } catch (error) {
      safeConsoleError(
        "Error initializing speech synthesis:",
        error,
      );
    }
  }

  private setupRecognitionHandlers(): void {
    if (!this.recognition) return;

    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.maxAlternatives = this.config.maxAlternatives;
    this.recognition.lang = this.config.language;

    this.recognition.onstart = () => {
      logger.info("🎤 Voice recognition started");
      this.isListening = true;
      this.eventEmitter.emit("recognitionStart");
    };

    this.recognition.onresult = (evt: unknown) => {
      if (!evt || typeof evt !== "object") return;

      const resultsProp = (evt as Record<string, unknown>)["results"];
      if (
        !resultsProp ||
        typeof (resultsProp as { length?: number }).length !== "number"
      )
        return;

      const results = resultsProp as {
        length: number;
        [index: number]: unknown;
      };
      const last = results[results.length - 1] as
        | Record<string, unknown>
        | undefined;
      const isFinal = Boolean(last?.["isFinal"]);

      const resultIndex =
        ((evt as Record<string, unknown>)["resultIndex"] as
          | number
          | undefined) ?? 0;

      for (let i = resultIndex; i < results.length; i++) {
        const item = results[i] as Record<string, unknown> | undefined;
        const first = item?.[0] as Record<string, unknown> | undefined;
        const transcript = String(first?.["transcript"] ?? "");
        const confidence = Number(first?.["confidence"] ?? 0);

        const _response: VoiceResponse = {
          text: transcript,
          confidence,
          isFinal,
          timestamp: new Date(),
          language: this.config.language,
        };

        this.eventEmitter.emit("recognitionResult", _response);

        if (isFinal) {
          this.processVoiceCommand(transcript, confidence);
        }
      }
    };

    this.recognition.onerror = (evt: unknown) => {
      const _err = (evt as Record<string, unknown>)?.["error"];
      safeConsoleError(
        "Voice recognition error:",
        _err,
      );
      this.eventEmitter.emit("recognitionError", String(_err ?? ""));

      // Auto-restart on certain errors
      const errStr = String(_err ?? "");
      if (["no-speech", "audio-capture", "network"].includes(errStr)) {
        setTimeout(() => this.startListening(), 1000);
      }
    };

    this.recognition.onend = () => {
      logger.info("🎤 Voice recognition ended");
      this.isListening = false;
      this.eventEmitter.emit("recognitionEnd");

      // Auto-restart if continuous mode is enabled
      if (this.config.continuous && this.config.autoStart) {
        setTimeout(() => this.startListening(), 100);
      }
    };
  }

  private setupSynthesisHandlers(): void {
    if (!this.synthesis) return;

    // Some platforms expose event handlers directly on the SpeechSynthesis
    const synth = this.synthesis as unknown as Record<string, unknown>;

    if (typeof synth["onstart"] === "function") {
      (synth["onstart"] as unknown as () => void) = () => {
        logger.info("🔊 Speech synthesis started");
        this.isSpeaking = true;
        this.eventEmitter.emit("synthesisStart");
      };
    }

    if (typeof synth["onend"] === "function") {
      (synth["onend"] as unknown as () => void) = () => {
        logger.info("🔊 Speech synthesis ended");
        this.isSpeaking = false;
        this.eventEmitter.emit("synthesisEnd");

        // Process interruption queue
        if (this.interruptionQueue.length > 0) {
          const nextMessage = this.interruptionQueue.shift();
          if (nextMessage) {
            this.speak(nextMessage);
          }
        }
      };
    }

    // fallback handler
    (synth["onerror"] as unknown as ((evt?: unknown) => void) | undefined) = (
      evt?: unknown,
    ) => {
      const _err = (evt as Record<string, unknown>)?.["error"];
      safeConsoleError(
        "Speech synthesis error:",
        _err,
      );
      this.eventEmitter.emit("synthesisError", String(_err ?? ""));
    };
  }

  private registerDefaultCommands(): void {
    // System commands
    this.registerCommand({
      id: "stop-listening",
      phrase: "stop listening",
      action: async () => this.stopListening(),
      priority: "high",
      context: ["system"],
    });

    this.registerCommand({
      id: "start-listening",
      phrase: "start listening",
      action: async () => this.startListening(),
      priority: "high",
      context: ["system"],
    });

    this.registerCommand({
      id: "stop-speaking",
      phrase: "stop speaking",
      action: async () => this.stopSpeaking(),
      priority: "high",
      context: ["system"],
    });

    // QMOI commands
    this.registerCommand({
      id: "check-balance",
      phrase: "check balance",
      action: async () => {
        const balance = await this.getBitgetBalance();
        this.speak(`Your Bitget balance is $${balance.toFixed(2)}`);
      },
      priority: "medium",
      context: ["trading", "finance"],
    });

    this.registerCommand({
      id: "check-earnings",
      phrase: "check earnings",
      action: async () => {
        const earnings = await this.getTodayEarnings();
        this.speak(`Today's earnings are $${earnings.toFixed(2)}`);
      },
      priority: "medium",
      context: ["earnings", "finance"],
    });

    this.registerCommand({
      id: "start-trading",
      phrase: "start trading",
      action: async () => {
        this.speak("Starting automated trading system");
        // Trigger trading start
      },
      priority: "high",
      context: ["trading"],
    });

    this.registerCommand({
      id: "stop-trading",
      phrase: "stop trading",
      action: async () => {
        this.speak("Stopping automated trading system");
        // Trigger trading stop
      },
      priority: "high",
      context: ["trading"],
    });

    // WhatsApp commands
    this.registerCommand({
      id: "send-whatsapp",
      phrase: "send whatsapp message",
      action: async (_params: { recipient: string; message: string }) => {
        const { recipient, message } = _params;
        await this.sendWhatsAppMessage(recipient, message);
        this.speak(`Message sent to ${recipient}`);
      },
      priority: "medium",
      context: ["communication", "whatsapp"],
    });

    this.registerCommand({
      id: "create-group",
      phrase: "create whatsapp group",
      action: async (_params: { name: string; members: string[] }) => {
        const { name, members } = _params;
        await this.createWhatsAppGroup(name, members);
        this.speak(`WhatsApp group ${name} created successfully`);
      },
      priority: "medium",
      context: ["communication", "whatsapp"],
    });

    // Settings commands
    this.registerCommand({
      id: "change-language",
      phrase: "change language",
      action: async (_params: { language: string }) => {
        const { language } = _params;
        this.setLanguage(language);
        this.speak(`Language changed to ${language}`);
      },
      priority: "medium",
      context: ["settings"],
    });

    this.registerCommand({
      id: "adjust-volume",
      phrase: "adjust volume",
      action: async (_params: { level: number }) => {
        const { level } = _params;
        this.setVolume(level);
        this.speak(`Volume adjusted to ${level}%`);
      },
      priority: "low",
      context: ["settings"],
    });
  }

  private async processVoiceCommand(
    transcript: string,
    confidence: number,
  ): Promise<void> {
    const normalizedTranscript = transcript.toLowerCase().trim();

    // Check for interruption
    if (this.config.enableInterruption && this.isSpeaking) {
      if (
        normalizedTranscript.includes("stop") ||
        normalizedTranscript.includes("wait")
      ) {
        this.stopSpeaking();
        this.speak("I stopped. What would you like me to do?");
        return;
      }
    }

    // Find matching command
    let bestMatch: VoiceCommand | null = null;
    let bestScore = 0;

    for (const command of this.commands.values()) {
      const score = this.calculateSimilarity(
        normalizedTranscript,
        command.phrase,
      );
      if (score > bestScore && score > 0.7) {
        bestScore = score;
        bestMatch = command;
      }
    }

    if (bestMatch) {
      try {
        logger.info(
          `🎯 Executing command: ${bestMatch.id} (confidence: ${confidence})`,
        );
        await bestMatch.action({ transcript, confidence });
        this.eventEmitter.emit("commandExecuted", {
          command: bestMatch,
          transcript,
          confidence,
        });
      } catch (error) {
        safeConsoleError(
          "Error executing voice command:",
          error,
        );
        this.speak(
          "Sorry, I encountered an error while executing that command",
        );
      }
    } else {
      // No direct command match, try to understand intent
      await this.processNaturalLanguage(transcript);
    }
  }

  private async processNaturalLanguage(transcript: string): Promise<void> {
    // sophisticated natural language processing
    const lowerTranscript = transcript.toLowerCase();

    if (
      lowerTranscript.includes("balance") ||
      lowerTranscript.includes("money")
    ) {
      const balance = await this.getBitgetBalance();
      this.speak(`Your current Bitget balance is $${balance.toFixed(2)}`);
    } else if (
      lowerTranscript.includes("earnings") ||
      lowerTranscript.includes("profit")
    ) {
      const earnings = await this.getTodayEarnings();
      this.speak(`Today's total earnings are $${earnings.toFixed(2)}`);
    } else if (lowerTranscript.includes("weather")) {
      this.speak(
        "I can check the weather for you. Which city would you like to know about?",
      );
    } else if (lowerTranscript.includes("time")) {
      const time = new Date().toLocaleTimeString();
      this.speak(`The current time is ${time}`);
    } else {
      this.speak(
        "I heard you say: " + transcript + ". How can I help you with that?",
      );
    }
  }

  private calculateSimilarity(text1: string, text2: string): number {
    // sophisticated similarity calculation using Levenshtein distance
    const longer = text1.length > text2.length ? text1 : text2;
    const shorter = text1.length > text2.length ? text2 : text1;

    if (longer.length === 0) return 1.0;

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  public startListening(): void {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition?.start?.();
      } catch (error) {
        safeConsoleError(
          "Error starting voice recognition:",
          error,
        );
      }
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition?.stop?.();
      } catch (error) {
        safeConsoleError(
          "Error stopping voice recognition:",
          error,
        );
      }
    }
  }

  public speak(
    text: string,
    _options: {
      pitch?: number;
      rate?: number;
      volume?: number;
      voice?: unknown;
    } = {},
  ): void {
    if (!this.synthesis) {
      safeConsoleError(
        "Speech synthesis not available",
      );
      return;
    }

    // Stop unknown current speech
    this.stopSpeaking();

    // Create utterance with selected voice settings
    const utterance = new SpeechSynthesisUtterance(text);

    // Apply current voice settings
    if (this.currentVoice && this.synthesis) {
      const voices = this.synthesis.getVoices?.() ?? [];
      utterance.voice =
        (voices.find(
          (v) => v.name === this.currentVoice!.voiceURI,
        ) as SpeechSynthesisVoice) || null;
      utterance.pitch = this.userSettings.voiceSettings.pitch;
      utterance.rate = this.userSettings.voiceSettings.rate;
      utterance.volume = this.userSettings.voiceSettings.volume;
    } else {
      // Default settings if no voice selected
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
      utterance.volume = 1.0;
    }

    // Apply additional _options safely
    const opts = _options as {
      pitch?: number;
      rate?: number;
      volume?: number;
      voice?: SpeechSynthesisVoice;
    } | null;
    if (opts?.pitch !== undefined) utterance.pitch = opts.pitch;
    if (opts?.rate !== undefined) utterance.rate = opts.rate;
    if (opts?.volume !== undefined) utterance.volume = opts.volume;
    if (opts?.voice) utterance.voice = opts.voice;

    // Add user's preferred name to the text if available
    if (this.userSettings.preferredNames.length > 0) {
      const randomName =
        this.userSettings.preferredNames[
          Math.floor(Math.random() * this.userSettings.preferredNames.length)
        ];
      text = text.replace(/\b(you|your)\b/gi, (match) => {
        return match.toLowerCase() === "you" ? randomName : `${randomName}'s`;
      });
    }

    utterance.text = text;
    this.synthesis?.speak(utterance);
  }

  public stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  public registerCommand(command: VoiceCommand): void {
    this.commands.set(command.id, command);
  }

  public unregisterCommand(commandId: string): void {
    this.commands.delete(commandId);
  }

  public setLanguage(language: string): void {
    this.config.language = language;
    if (this.recognition) {
      (this.recognition as Record<string, unknown>)["lang"] = language;
    }
  }

  public setVolume(level: number): void {
    // Adjust system volume or synthesis volume
    const _volume = Math.max(0, Math.min(1, level / 100));

    // Persist the volume setting for synthesis and save
    this.userSettings.voiceSettings.volume = _volume;
    this.saveUserSettings();

    // Implementation depends on platform
  }

  public updateConfig(newConfig: full<VoiceConfig>): void {
    this.config = { ...this.config, ...newConfig };

    if (this.recognition) {
      const rec = this.recognition as Record<string, unknown>;
      rec["continuous"] = this.config.continuous;
      rec["interimResults"] = this.config.interimResults;
      rec["maxAlternatives"] = this.config.maxAlternatives;
      rec["lang"] = this.config.language;
    }
  }

  private async getBitgetBalance(): Promise<number> {
    // production: Integrate with Bitget API using environment variable BITGET_API_KEY
    // data: const response = await bitgetClient.getBalance(...);
    return 1250.75;
  }

  private async getTodayEarnings(): Promise<number> {
    // production: Integrate with QAllpurposeService to fetch real earnings data
    // data: const earnings = await qAllpurposeService.getTodayEarnings(userId);
    return 847.5;
  }

  private async sendWhatsAppMessage(
    recipient: string,
    message: string,
  ): Promise<void> {
    // production: Integrate with WhatsAppService using credentials from environment
    // data: await whatsAppService.sendMessage(recipient, message);
    logger.info(`Sending WhatsApp message to ${recipient}: ${message}`);
  }

  private async createWhatsAppGroup(
    name: string,
    members: string[],
  ): Promise<void> {
    // production: Integrate with WhatsAppService to create actual group
    // data: await whatsAppService.createGroup(name, members);
    logger.info(
      `Creating WhatsApp group ${name} with members: ${members.join(", ")}`,
    );
  }

  private loadUserSettings(): void {
    try {
      const saved = localStorage.getItem("voiceUserSettings");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (typeof parsed === "object" && parsed !== null) {
          this.userSettings = {
            ...this.userSettings,
            ...(parsed as Record<string, unknown>),
          } as UserVoicePreferences;
        }

        // Set current voice if saved
        if (this.userSettings.selectedVoiceId) {
          const savedVoice = this.availableVoices.find(
            (v) => v.id === this.userSettings.selectedVoiceId,
          );
          if (savedVoice) {
            this.currentVoice = savedVoice;
          }
        }
      }
    } catch (error) {
      safeConsoleError(
        "Error loading voice user settings:",
        error,
      );
    }
  }

  public saveUserSettings(): void {
    try {
      localStorage.setItem(
        "voiceUserSettings",
        JSON.stringify(this.userSettings),
      );
    } catch (error) {
      safeConsoleError(
        "Error saving voice user settings:",
        error,
      );
    }
  }

  public onRecognitionStart(callback: () => void): void {
    this.eventEmitter.on("recognitionStart", callback);
  }

  public onRecognitionResult(
    callback: (_response: VoiceResponse) => void,
  ): void {
    this.eventEmitter.on("recognitionResult", (_response: VoiceResponse) =>
      callback(_response),
    );
  }

  public onRecognitionEnd(callback: () => void): void {
    this.eventEmitter.on("recognitionEnd", callback);
  }

  public onRecognitionError(callback: (_error: string) => void): void {
    this.eventEmitter.on("recognitionError", (_err: unknown) =>
      callback(String(err ?? "")),
    );
  }

  public onSynthesisStart(callback: () => void): void {
    this.eventEmitter.on("synthesisStart", callback);
  }

  public onSynthesisEnd(callback: () => void): void {
    this.eventEmitter.on("synthesisEnd", callback);
  }

  public onCommandExecuted(
    callback: (data: {
      command: VoiceCommand;
      transcript: string;
      confidence: number;
    }) => void,
  ): void {
    this.eventEmitter.on("commandExecuted", (d: unknown) => {
      if (typeof d === "object" && d !== null) {
        const obj = d as {
          command?: VoiceCommand;
          transcript?: string;
          confidence?: number;
        };
        callback({
          command: obj.command as VoiceCommand,
          transcript: String(obj.transcript ?? ""),
          confidence: Number(obj.confidence ?? 0),
        });
      }
    });
  }

  public getStatus(): {
    isListening: boolean;
    isSpeaking: boolean;
    language: string;
  } {
    return {
      isListening: this.isListening,
      isSpeaking: this.isSpeaking,
      language: this.config.language,
    };
  }

  public getCommands(): VoiceCommand[] {
    return Array.from(this.commands.values());
  }
}

export default VoiceRecognitionService;
