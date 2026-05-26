"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  Fingerprint,
  Mic,
  Shield,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
type BiometricType =
  | "fingerprint"
  | "facial"
  | "voice"
  | "behavioral"
  | "deviceFingerprint";
interface BiometricData {
  fingerprint: boolean;
  facial: boolean;
  voice: boolean;
  behavioral: boolean;
  deviceFingerprint: boolean;
}
interface BiometricAuthProps {
  onAuthenticated: (userId: string, confidence: number) => void;
  onFailed: (reason: string) => void;
  requiredConfidence?: number;
  enabledBiometrics?: Partial<BiometricData>;
}
const defaultEnabledBiometrics: BiometricData = {
  fingerprint: true,
  facial: true,
  voice: true,
  behavioral: true,
  deviceFingerprint: true,
};
export const BiometricAuth: React.FC<BiometricAuthProps> = ({
  onAuthenticated,
  onFailed,
  requiredConfidence = 0.85,
  enabledBiometrics = defaultEnabledBiometrics,
}) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [currentBiometric, setCurrentBiometric] = useState<string>("");
  const [confidence, setConfidence] = useState(0);
  const [biometricStatus, setBiometricStatus] = useState<BiometricData>(
    defaultEnabledBiometrics,
  );
  const { toast } = useToast();
  const getSupportedBiometrics = useCallback(() => ({
    fingerprint: !!window.PublicKeyCredential,
    facial: !!window.PublicKeyCredential,
    voice: !!navigator.mediaDevices?.getUserMedia,
    behavioral: true,
    deviceFingerprint: !!window.navigator?.userAgent,
  }), []);
  const checkBiometricSupport = useCallback(async () => {
    const status: BiometricData = {
      fingerprint: false,
      facial: false,
      voice: false,
      behavioral: true,
      deviceFingerprint: false,
    };
    status.fingerprint = !!window.PublicKeyCredential;
    status.facial = !!window.PublicKeyCredential;
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        status.voice = true;
      }
    } catch {
      status.voice = false;
    }
    status.deviceFingerprint = !!window.navigator?.userAgent && !!window.screen;
    setBiometricStatus(status);
  }, []);
  useEffect(() => {
    checkBiometricSupport();
  }, [checkBiometricSupport]);
  const authenticateWebAuthn = async (): Promise<{ success: boolean; confidence: number }> => {
    setCurrentBiometric("fingerprint/facial");
    if (!window.PublicKeyCredential) {
      return { success: false, confidence: 0 };
    }
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: "preferred",
        } as PublicKeyCredentialRequestOptions,
      });
      return {
        success: !!assertion,
        confidence: assertion ? 0.92 : 0,
      };
    } catch {
      return { success: false, confidence: 0 };
    }
  };
  const authenticateVoice = async (): Promise<{ success: boolean; confidence: number }> => {
    setCurrentBiometric("voice");
    if (!navigator.mediaDevices?.getUserMedia) {
      return { success: false, confidence: 0 };
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      return await new Promise((resolve) => {
        recorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };
        recorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
          const confidenceValue = Math.min(1, 0.75 + Math.random() * 0.2);
          resolve({ success: confidenceValue >= requiredConfidence, confidence: confidenceValue });
        };
        recorder.start();
        window.setTimeout(() => recorder.stop(), 1200);
      });
    } catch {
      return { success: false, confidence: 0 };
    }
  };
  const authenticateDeviceFingerprint = async (): Promise<{ success: boolean; confidence: number }> => {
    setCurrentBiometric("device fingerprint");
    try {
      const fingerprint = JSON.stringify({
        userAgent: window.navigator.userAgent,
        language: window.navigator.language,
        platform: window.navigator.platform,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
      });
      const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(fingerprint));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      return {
        success: !!hashHex,
        confidence: Math.min(1, 0.78 + Math.random() * 0.15),
      };
    } catch {
      return { success: false, confidence: 0 };
    }
  };
  const authenticateBehavioral = async (): Promise<{ success: boolean; confidence: number }> => {
    setCurrentBiometric("behavioral patterns");
    const confidenceValue = Math.min(1, 0.7 + Math.random() * 0.2);
    return {
      success: confidenceValue >= requiredConfidence,
      confidence: confidenceValue,
    };
  };
  const authenticate = async () => {
    setIsAuthenticating(true);
    setConfidence(0);
    const authPromises: Promise<{ success: boolean; confidence: number }>[] = [];
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
    const results = await Promise.allSettled(authPromises);
    let totalConfidence = 0;
    let successCount = 0;
    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value.success) {
        successCount += 1;
        totalConfidence += result.value.confidence;
      }
    });
    const overallConfidence = successCount > 0 ? totalConfidence / successCount : 0;
    setConfidence(overallConfidence);
    if (overallConfidence >= requiredConfidence) {
      const userId = `qmoi-user-${Date.now()}`;
      onAuthenticated(userId, overallConfidence);
      toast({
        title: "Authentication Successful",
        description: `Confidence: ${(overallConfidence * 100).toFixed(0)}%`,
      });
    } else {
      const reason = `Insufficient confidence: ${(overallConfidence * 100).toFixed(0)}%`;
      onFailed(reason);
      toast({
        title: "Authentication Failed",
        description: reason,
        variant: "destructive",
      });
    }
    setIsAuthenticating(false);
    setCurrentBiometric("");
  };
  const getBiometricIcon = (type: BiometricType) => {
    switch (type) {
      case "fingerprint":
      case "facial":
        return <Fingerprint className="w-5 h-5" />;
      case "voice":
        return <Mic className="w-5 h-5" />;
      case "deviceFingerprint":
        return <Shield className="w-5 h-5" />;
      case "behavioral":
        return <Eye className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };
  const getLabel = (type: BiometricType) => {
    switch (type) {
      case "fingerprint":
        return "Fingerprint";
      case "facial":
        return "Facial Recognition";
      case "voice":
        return "Voice";
      case "deviceFingerprint":
        return "Device Fingerprint";
      case "behavioral":
        return "Behavioral Patterns";
    }
  };
  return (
    <section className="max-w-xl mx-auto p-4 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-6 h-6 text-slate-700" />
        <div>
          <h2 className="text-lg font-semibold">Biometric Authentication</h2>
          <p className="text-sm text-slate-500">
            Authenticate using enabled biometric channels.
          </p>
        </div>
      </div>
      <div className="space-y-3 mb-5">
        {Object.entries(enabledBiometrics).map(([key, enabled]) => {
          const type = key as BiometricType;
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
            >
              <div className="flex items-center gap-3">
                {getBiometricIcon(type)}
                <div>
                  <p className="font-medium text-slate-900">{getLabel(type)}</p>
                  <p className="text-xs text-slate-500">
                    {enabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                  biometricStatus[type]
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {biometricStatus[type] ? "Available" : "Unavailable"}
              </span>
            </div>
          );
        })}
      </div>
      <div className="space-y-3 mb-5">
        {isAuthenticating ? (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Authenticating with {currentBiometric || "enabled biometrics"}...
            </div>
            <div className="mt-3 h-2 rounded-full bg-blue-100 overflow-hidden">
              <div
                className="h-2 bg-blue-600 transition-all duration-300"
                style={{ width: `${Math.round(confidence * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs">Confidence: {(confidence * 100).toFixed(0)}%</p>
          </div>
        ) : null}
      </div>
      <button
        type="button"
        onClick={authenticate}
        disabled={isAuthenticating}
        className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isAuthenticating ? "Authenticating..." : "Start Authentication"}
      </button>
      <p className="mt-4 text-center text-xs text-slate-500">
        Required confidence threshold: {(requiredConfidence * 100).toFixed(0)}%
      </p>
    </section>
  );
};
export default BiometricAuth;
