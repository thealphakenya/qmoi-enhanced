import { EventEmitter } from "events";

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
  action: (params: any) => Promise<void>;
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

export class VoiceRecognitionService {
  private static instance: VoiceRecognitionService;
  private eventEmitter: EventEmitter;
  private recognition: any; // SpeechRecognition
  private synthesis: any; // SpeechSynthesis
  private config: VoiceConfig;
  private commands: Map<string, VoiceCommand> = new Map();
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private currentContext: string[] = [];
  private userSettings: UserVoicePreferences;
  private interruptionQueue: string[] = [];
  private availableVoices: HumanVoice[] = [];
  private currentVoice: HumanVoice | null = null;
  private isFirstTimeSetup: boolean = false;

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
    // Emit event to trigger voice selection UI
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
    settings: Partial<UserVoicePreferences["voiceSettings"]>,
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

  public onVoiceSelectionRequired(callback: (data: any) => void): void {
    this.eventEmitter.on("voiceSelectionRequired", callback);
  }

  public onVoiceChanged(callback: (voice: HumanVoice) => void): void {
    this.eventEmitter.on("voiceChanged", callback);
  }

  private initializeSpeechRecognition(): void {
    try {
      // @ts-expect-error
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.setupRecognitionHandlers();
      } else {
        console.error("Speech recognition not supported");
      }
    } catch (error) {
      console.error("Error initializing speech recognition:", error);
    }
  }

  private initializeSpeechSynthesis(): void {
    try {
      this.synthesis = window.speechSynthesis;
      if (this.synthesis) {
        this.setupSynthesisHandlers();
      } else {
        console.error("Speech synthesis not supported");
      }
    } catch (error) {
      console.error("Error initializing speech synthesis:", error);
    }
  }

  private setupRecognitionHandlers(): void {
    if (!this.recognition) return;

    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.maxAlternatives = this.config.maxAlternatives;
    this.recognition.lang = this.config.language;

    this.recognition.onstart = () => {
      console.log("🎤 Voice recognition started");
      this.isListening = true;
      this.eventEmitter.emit("recognitionStart");
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = event.results;
      const isFinal = results[results.length - 1].isFinal;

      for (let i = event.resultIndex; i < results.length; i++) {
        const transcript = results[i][0].transcript;
        const confidence = results[i][0].confidence;

        const response: VoiceResponse = {
          text: transcript,
          confidence,
          isFinal,
          timestamp: new Date(),
          language: this.config.language,
        };

        this.eventEmitter.emit("recognitionResult", response);

        if (isFinal) {
          this.processVoiceCommand(transcript, confidence);
        }
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Voice recognition error:", event.error);
      this.eventEmitter.emit("recognitionError", event.error);

      // Auto-restart on certain errors
      if (["no-speech", "audio-capture", "network"].includes(event.error)) {
        setTimeout(() => this.startListening(), 1000);
      }
    };

    this.recognition.onend = () => {
      console.log("🎤 Voice recognition ended");
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

    this.synthesis.onstart = () => {
      console.log("🔊 Speech synthesis started");
      this.isSpeaking = true;
      this.eventEmitter.emit("synthesisStart");
    };

    this.synthesis.onend = () => {
      console.log("🔊 Speech synthesis ended");
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

    this.synthesis.onerror = (event: SpeechSynthesisErrorEvent) => {
      console.error("Speech synthesis error:", event.error);
      this.eventEmitter.emit("synthesisError", event.error);
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
      action: async (params: { recipient: string; message: string }) => {
        const { recipient, message } = params;
        await this.sendWhatsAppMessage(recipient, message);
        this.speak(`Message sent to ${recipient}`);
      },
      priority: "medium",
      context: ["communication", "whatsapp"],
    });

    this.registerCommand({
      id: "create-group",
      phrase: "create whatsapp group",
      action: async (params: any) => {
        const { name, members } = params;
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
      action: async (params: any) => {
        const { language } = params;
        this.setLanguage(language);
        this.speak(`Language changed to ${language}`);
      },
      priority: "medium",
      context: ["settings"],
    });

    this.registerCommand({
      id: "adjust-volume",
      phrase: "adjust volume",
      action: async (params: any) => {
        const { level } = params;
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
        console.log(
          `🎯 Executing command: ${bestMatch.id} (confidence: ${confidence})`,
        );
        await bestMatch.action({ transcript, confidence });
        this.eventEmitter.emit("commandExecuted", {
          command: bestMatch,
          transcript,
          confidence,
        });
      } catch (error) {
        console.error("Error executing voice command:", error);
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
    // Simple natural language processing
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
    // Simple similarity calculation using Levenshtein distance
    const longer = text1.length > text2.length ? text1 : text2;
    const shorter = text1.length > text2.length ? text2 : text1;

    if (longer.length === 0) return 1.0;

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];

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
        this.recognition.start();
      } catch (error) {
        console.error("Error starting voice recognition:", error);
      }
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error("Error stopping voice recognition:", error);
      }
    }
  }

  public speak(text: string, options: any = {}): void {
    if (!this.synthesis) {
      console.error("Speech synthesis not available");
      return;
    }

    // Stop any current speech
    this.stopSpeaking();

    // Create utterance with selected voice settings
    const utterance = new SpeechSynthesisUtterance(text);

    // Apply current voice settings
    if (this.currentVoice) {
      utterance.voice =
        this.synthesis
          .getVoices()
          .find((v: any) => v.name === this.currentVoice!.voiceURI) || null;
      utterance.pitch = this.userSettings.voiceSettings.pitch;
      utterance.rate = this.userSettings.voiceSettings.rate;
      utterance.volume = this.userSettings.voiceSettings.volume;
    } else {
      // Default settings if no voice selected
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
      utterance.volume = 1.0;
    }

    // Apply any additional options
    if (options.pitch) utterance.pitch = options.pitch;
    if (options.rate) utterance.rate = options.rate;
    if (options.volume) utterance.volume = options.volume;
    if (options.voice) utterance.voice = options.voice;

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
    this.synthesis.speak(utterance);
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
      this.recognition.lang = language;
    }
  }

  public setVolume(level: number): void {
    // Adjust system volume or synthesis volume
    const volume = Math.max(0, Math.min(1, level / 100));
    // Implementation depends on platform
  }

  public updateConfig(newConfig: Partial<VoiceConfig>): void {
    this.config = { ...this.config, ...newConfig };

    if (this.recognition) {
      this.recognition.continuous = this.config.continuous;
      this.recognition.interimResults = this.config.interimResults;
      this.recognition.maxAlternatives = this.config.maxAlternatives;
      this.recognition.lang = this.config.language;
    }
  }

  private async getBitgetBalance(): Promise<number> {
    // Mock implementation - would integrate with actual Bitget API
    return 1250.75;
  }

  private async getTodayEarnings(): Promise<number> {
    // Mock implementation - would integrate with QAllpurposeService
    return 847.5;
  }

  private async sendWhatsAppMessage(
    recipient: string,
    message: string,
  ): Promise<void> {
    // Mock implementation - would integrate with WhatsAppService
    console.log(`Sending WhatsApp message to ${recipient}: ${message}`);
  }

  private async createWhatsAppGroup(
    name: string,
    members: string[],
  ): Promise<void> {
    // Mock implementation - would integrate with WhatsAppService
    console.log(
      `Creating WhatsApp group ${name} with members: ${members.join(", ")}`,
    );
  }

  private loadUserSettings(): void {
    try {
      const saved = localStorage.getItem("voiceUserSettings");
      if (saved) {
        const parsed = JSON.parse(saved);
        this.userSettings = { ...this.userSettings, ...parsed };

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
      console.error("Error loading voice user settings:", error);
    }
  }

  public saveUserSettings(): void {
    try {
      localStorage.setItem(
        "voiceUserSettings",
        JSON.stringify(this.userSettings),
      );
    } catch (error) {
      console.error("Error saving voice user settings:", error);
    }
  }

  public onRecognitionStart(callback: () => void): void {
    this.eventEmitter.on("recognitionStart", callback);
  }

  public onRecognitionResult(
    callback: (response: VoiceResponse) => void,
  ): void {
    this.eventEmitter.on("recognitionResult", callback);
  }

  public onRecognitionEnd(callback: () => void): void {
    this.eventEmitter.on("recognitionEnd", callback);
  }

  public onRecognitionError(callback: (error: string) => void): void {
    this.eventEmitter.on("recognitionError", callback);
  }

  public onSynthesisStart(callback: () => void): void {
    this.eventEmitter.on("synthesisStart", callback);
  }

  public onSynthesisEnd(callback: () => void): void {
    this.eventEmitter.on("synthesisEnd", callback);
  }

  public onCommandExecuted(callback: (data: any) => void): void {
    this.eventEmitter.on("commandExecuted", callback);
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
