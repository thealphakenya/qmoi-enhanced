"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Fingerprint,
  Eye,
  Mic,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BiometricData {
  fingerprint?: boolean;
  facial?: boolean;
  voice?: boolean;
  behavioral?: boolean;
  deviceFingerprint?: boolean;
}

interface BiometricAuthProps {
  onAuthenticated: (userId: string, confidence: number) => void;
  onFailed: (reason: string) => void;
  requiredConfidence?: number;
  enabledBiometrics?: BiometricData;
}

export const BiometricAuth: React.FC<BiometricAuthProps> = ({
  onAuthenticated,
  onFailed,
  requiredConfidence = 0.85,
  enabledBiometrics = {
    fingerprint: true,
    facial: true,
    voice: true,
    behavioral: true,
    deviceFingerprint: true,
  },
}) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [currentBiometric, setCurrentBiometric] = useState<string>("");
  const [confidence, setConfidence] = useState(0);
  const [biometricStatus, setBiometricStatus] = useState<BiometricData>({
    fingerprint: false,
    facial: false,
    voice: false,
    behavioral: false,
    deviceFingerprint: false,
  });
  const { toast } = useToast();

  // Check biometric availability
  const checkBiometricSupport = useCallback(async () => {
    const status: BiometricData = { ...biometricStatus };

    // Check Web Authentication API (fingerprint, facial)
    if (window.PublicKeyCredential) {
      try {
        const available =
          await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        status.fingerprint = available;
        status.facial = available;
      } catch (e) {
        console.warn("WebAuthn not supported:", e);
      }
    }

    // Check microphone access (voice)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      status.voice = true;
    } catch (e) {
      console.warn("Microphone access denied:", e);
    }

    // Check device fingerprinting capabilities
    status.deviceFingerprint = !!navigator.userAgent && !!window.screen;

    // Behavioral biometrics (keystroke patterns, mouse movements)
    status.behavioral = true;

    setBiometricStatus(status);
  }, []);

  useEffect(() => {
    checkBiometricSupport();
  }, [checkBiometricSupport]);

  // Fingerprint/Facial authentication using WebAuthn
  const authenticateWebAuthn = async (): Promise<{
    success: boolean;
    confidence: number;
  }> => {
    try {
      setCurrentBiometric("fingerprint/facial");

      // Create a challenge
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "QMOI Enhanced System", id: window.location.hostname },
          user: {
            id: new Uint8Array(16),
            name: "qmoi-user",
            displayName: "QMOI User",
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" }, // ES256
            { alg: -257, type: "public-key" }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
          },
          timeout: 60000,
        },
      });

      return { success: !!credential, confidence: 0.95 };
    } catch (error) {
      (globalThis.console as any)?.error?.("WebAuthn authentication failed:", error);
      return { success: false, confidence: 0 };
    }
  };

  // Voice authentication
  const authenticateVoice = async (): Promise<{
    success: boolean;
    confidence: number;
  }> => {
    try {
      setCurrentBiometric("voice");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Record a short sample
      const recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      return new Promise((resolve) => {
        recorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });

          // Analyze voice patterns (simplified)
          const confidence = Math.random() * 0.3 + 0.7; // Mock analysis

          stream.getTracks().forEach((track) => track.stop());
          resolve({ success: confidence > requiredConfidence, confidence });
        };

        // Record for 2 seconds
        recorder.start();
        setTimeout(() => recorder.stop(), 2000);
      });
    } catch (error) {
      (globalThis.console as any)?.error?.("Voice authentication failed:", error);
      return { success: false, confidence: 0 };
    }
  };

  // Device fingerprinting
  const authenticateDeviceFingerprint = async (): Promise<{
    success: boolean;
    confidence: number;
  }> => {
    try {
      setCurrentBiometric("device fingerprint");

      const fingerprint = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
      };

      // Hash the fingerprint
      const fingerprintString = JSON.stringify(fingerprint);
      const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(fingerprintString)
      );
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Check against stored device fingerprints (simplified)
      const confidence = Math.random() * 0.2 + 0.8; // Mock check

      return { success: confidence > requiredConfidence, confidence };
    } catch (error) {
      (globalThis.console as any)?.error?.("Device fingerprint authentication failed:", error);
      return { success: false, confidence: 0 };
    }
  };

  // Behavioral biometrics (keystroke patterns, mouse movements)
  const authenticateBehavioral = async (): Promise<{
    success: boolean;
    confidence: number;
  }> => {
    try {
      setCurrentBiometric("behavioral patterns");

      // Monitor user behavior for a short period
      const behaviorData = {
        keystrokePatterns: [],
        mouseMovements: [],
        timingPatterns: [],
      };

      // Simplified behavioral analysis
      const confidence = Math.random() * 0.4 + 0.6; // Mock analysis

      return { success: confidence > requiredConfidence, confidence };
    } catch (error) {
      (globalThis.console as any)?.error?.("Behavioral authentication failed:", error);
      return { success: false, confidence: 0 };
    }
  };

  // Main authentication function
  const authenticate = async () => {
    setIsAuthenticating(true);
    setConfidence(0);

    const results: any[] = [];
    let totalConfidence = 0;
    let methodCount = 0;

    // Run enabled biometric methods in parallel
    const authPromises: Promise<any>[] = [];

    if (enabledBiometrics.fingerprint || enabledBiometrics.facial) {
      authPromises.push(authenticateWebAuthn());
    }

    if (enabledBiometrics.voice) {
      authPromises.push(authenticateVoice());
    }

    if (enabledBiometrics.deviceFingerprint) {
      authPromises.push(authenticateDeviceFingerprint());
    }

    if (enabledBiometrics.behavioral) {
      authPromises.push(authenticateBehavioral());
    }

    try {
      const authResults = await Promise.allSettled(authPromises);

      for (const result of authResults) {
        if (result.status === "fulfilled") {
          results.push(result.value);
          if (result.value.success) {
            totalConfidence += result.value.confidence;
            methodCount++;
          }
        }
      }

      // Calculate overall confidence
      const overallConfidence =
        methodCount > 0 ? totalConfidence / methodCount : 0;
      setConfidence(overallConfidence);

      if (overallConfidence >= requiredConfidence) {
        const userId = "qmoi-user-" + Date.now(); // Generate user ID
        onAuthenticated(userId, overallConfidence);

        toast({
          title: "Authentication Successful",
          description: `Confidence: ${(overallConfidence * 100).toFixed(1)}%`,
        });
      } else {
        const reason = `Insufficient confidence: ${(
          overallConfidence * 100
        ).toFixed(1)}% (required: ${(requiredConfidence * 100).toFixed(1)}%)`;
        onFailed(reason);

        toast({
          title: "Authentication Failed",
          description: reason,
          variant: "destructive",
        });
      }
    } catch (error) {
      (globalThis.console as any)?.error?.("Authentication error:", error);
      onFailed("Authentication system error");

      toast({
        title: "Authentication Error",
        description: "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setIsAuthenticating(false);
      setCurrentBiometric("");
    }
  };

  const getBiometricIcon = (type: keyof BiometricData) => {
    switch (type) {
      case "fingerprint":
      case "facial":
        return <Fingerprint className="w-4 h-4" />;
      case "voice":
        return <Mic className="w-4 h-4" />;
      case "deviceFingerprint":
        return <Shield className="w-4 h-4" />;
      case "behavioral":
        return <Eye className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getBiometricLabel = (type: keyof BiometricData) => {
    switch (type) {
      case "fingerprint":
        return "Fingerprint";
      case "facial":
        return "Facial Recognition";
      case "voice":
        return "Voice Recognition";
      case "deviceFingerprint":
        return "Device Fingerprint";
      case "behavioral":
        return "Behavioral Patterns";
      default:
        return type;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Biometric Authentication
        </CardTitle>
        <CardDescription>
          Authenticate using multiple biometric methods for enhanced security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Biometric Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Available Methods:</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(enabledBiometrics).map(([type, enabled]) => (
              <div key={type} className="flex items-center gap-2">
                {getBiometricIcon(type as keyof BiometricData)}
                <span className="text-sm">
                  {getBiometricLabel(type as keyof BiometricData)}
                </span>
                <Badge
                  variant={
                    biometricStatus[type as keyof BiometricData]
                      ? "default"
                      : "secondary"
                  }
                  className="ml-auto"
                >
                  {biometricStatus[type as keyof BiometricData] ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Authentication Progress */}
        {isAuthenticating && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
              <span className="text-sm">
                Authenticating with {currentBiometric}...
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 text-center">
              Confidence: {(confidence * 100).toFixed(1)}%
            </div>
          </div>
        )}

        {/* Authenticate Button */}
        <Button
          onClick={authenticate}
          disabled={isAuthenticating}
          className="w-full"
          size="lg"
        >
          {isAuthenticating ? "Authenticating..." : "Authenticate"}
        </Button>

        {/* Confidence Threshold */}
        <div className="text-xs text-gray-500 text-center">
          Required confidence: {(requiredConfidence * 100).toFixed(1)}%
        </div>
      </CardContent>
    </Card>
  );
};

export default BiometricAuth;
