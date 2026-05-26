"use client";
import { useEffect, useState } from "react";

type ToastState = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  open: boolean;
};

const TOAST_REMOVE_DELAY = 5000;
const toastListeners = new Set<(toasts: ToastState[]) => void>();
let toastStore: ToastState[] = [];
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...toastStore]));
}

function dismissToast(id: string) {
  toastStore = toastStore.filter((toast) => toast.id !== id);
  const timeout = toastTimeouts.get(id);
  if (timeout) {
    clearTimeout(timeout);
    toastTimeouts.delete(id);
  }
  notifyListeners();
}

export function toast(options: Omit<ToastState, "id" | "open">) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const toastItem: ToastState = {
    ...options,
    id,
    open: true,
  };

  toastStore = [toastItem, ...toastStore].slice(0, 5);
  notifyListeners();

  const timeout = setTimeout(() => dismissToast(id), TOAST_REMOVE_DELAY);
  toastTimeouts.set(id, timeout);

  return {
    id,
    dismiss: () => dismissToast(id),
  };
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>(toastStore);

  useEffect(() => {
    const listener = (nextToasts: ToastState[]) => setToasts(nextToasts);
    toastListeners.add(listener);
    return () => {
      toastListeners.delete(listener);
    };
  }, []);

  return {
    toasts,
    toast,
    dismiss: dismissToast,
  };
}
