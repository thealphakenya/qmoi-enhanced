/// <reference types="node" />
import { EventEmitter } from "events";
import * as faceapi from "face-api.js";
import { ensureFaceApiModels } from "../scripts/download-face-api-models";

interface FaceConfig {
  enableRealTime: boolean;
  detectionInterval: number;
  confidenceThreshold: number;
  maxFaces: number;
  enableEmotionDetection: boolean;
  enableAgeEstimation: boolean;
  enableGenderDetection: boolean;
  enableExpressionTracking: boolean;
}

interface Point {
  x: number;
  y: number;
}

interface EmotionData {
  happy: number;
  sad: number;
  angry: number;
  surprised: number;
  fearful: number;
  disgusted: number;
  neutral: number;
  dominant: string;
}

interface FaceData {
  id: string;
  name: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  landmarks: Point[];
  emotions: EmotionData;
  age: number;
  gender: string;
  timestamp: Date;
}

interface UserProfile {
  id: string;
  name: string;
  faceData: FaceData[];
  preferences: Record<string, unknown>;
  lastSeen: Date;
  isActive: boolean;
}

type Timeout = ReturnType<typeof setTimeout>;

export class FaceRecognitionService {
  private static instance: FaceRecognitionService;
  private eventEmitter = new EventEmitter();
  private config: FaceConfig = {
    enableRealTime: true,
    detectionInterval: 100,
    confidenceThreshold: 0.7,
    maxFaces: 10,
    enableEmotionDetection: true,
    enableAgeEstimation: true,
    enableGenderDetection: true,
    enableExpressionTracking: true,
  };

  private videoElement: HTMLVideoElement | null = null;
  private canvasElement: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private isRunning = false;
  private detectionInterval: Timeout | null = null;
  private knownFaces = new Map<string, UserProfile>();
  private currentFaces: FaceData[] = [];

  private constructor() {}

  public static getInstance(): FaceRecognitionService {
    if (!FaceRecognitionService.instance) {
      FaceRecognitionService.instance = new FaceRecognitionService();
    }
    return FaceRecognitionService.instance;
  }

  private async loadModels(): Promise<void> {
    const MODEL_URL = "/models";
    await ensureFaceApiModels();
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      ]);
      console.log("✅ Face API models loaded");
    } catch (err) {
      console.error("❌ Error loading models:", err);
    }
  }

  public async startRecognition(video: HTMLVideoElement): Promise<void> {
    if (this.isRunning) return;

    this.videoElement = video;
    this.canvasElement = document.createElement("canvas");
    this.context = this.canvasElement.getContext("2d");

    if (!this.context) throw new Error("Could not get canvas context");

    await this.loadModels();
    this.isRunning = true;
    this.startDetectionLoop();
    this.eventEmitter.emit("recognitionStarted");
  }

  public stopRecognition(): void {
    this.isRunning = false;
    if (this.detectionInterval) clearInterval(this.detectionInterval);
    this.eventEmitter.emit("recognitionStopped");
  }

  private startDetectionLoop(): void {
    this.detectionInterval = setInterval(async () => {
      if (!this.videoElement || !this.context) return;

      this.canvasElement!.width = this.videoElement.videoWidth;
      this.canvasElement!.height = this.videoElement.videoHeight;
      this.context.drawImage(this.videoElement, 0, 0);

      const detections = await faceapi
        .detectAllFaces(this.canvasElement!, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

      const processed: FaceData[] = detections
        .filter((d) => d.detection.score >= this.config.confidenceThreshold)
        .slice(0, this.config.maxFaces)
        .map((detection) => ({
          id: `face-${Date.now()}-${Math.random()}`,
          name: "Unknown",
          confidence: detection.detection.score,
          boundingBox: {
            x: detection.detection.box.x,
            y: detection.detection.box.y,
            width: detection.detection.box.width,
            height: detection.detection.box.height,
          },
          landmarks: detection.landmarks.positions.map((pt) => ({ x: pt.x, y: pt.y })),
          emotions: this.mapEmotions(detection.expressions),
          age: detection.age,
          gender: detection.gender,
          timestamp: new Date(),
        }));

      this.currentFaces = processed;
      this.eventEmitter.emit("facesDetected", processed);
    }, this.config.detectionInterval);
  }

  private mapEmotions(expressions: faceapi.FaceExpressions): EmotionData {
    const emotionScores = expressions as unknown as Record<string, number>;
    const dominant = Object.entries(emotionScores).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    return {
      happy: emotionScores.happy ?? 0,
      sad: emotionScores.sad ?? 0,
      angry: emotionScores.angry ?? 0,
      surprised: emotionScores.surprised ?? 0,
      fearful: emotionScores.fearful ?? 0,
      disgusted: emotionScores.disgusted ?? 0,
      neutral: emotionScores.neutral ?? 0,
      dominant,
    };
  }

  public getCurrentFaces(): FaceData[] {
    return this.currentFaces;
  }

  public onFacesDetected(cb: (faces: FaceData[]) => void): void {
    this.eventEmitter.on("facesDetected", cb);
  }

  public onRecognitionStarted(cb: () => void): void {
    this.eventEmitter.on("recognitionStarted", cb);
  }

  public onRecognitionStopped(cb: () => void): void {
    this.eventEmitter.on("recognitionStopped", cb);
  }
}

export default FaceRecognitionService;
