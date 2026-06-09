"use client";
import React from "react";
interface QMOIStateProviderProps {
  children: React.ReactNode;
}
export default function QMOIStateProvider({ children }: QMOIStateProviderProps) {
  return <>{children}</>;
}
