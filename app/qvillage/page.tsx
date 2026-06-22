"use client";

import QVillageShell from "@/components/qvillage/QVillageShell";
import UniversalRouteGuard from "@/app/components/auth/UniversalRouteGuard";
import React from 'react';
import StylePreviewCard from '@/app/components/styles/StylePreviewCard';
import { listPresets } from '@/app/components/styles';
import LanguageSelector from '@/app/components/language/LanguageSelector';

export default function Page() {
  return (
    <UniversalRouteGuard>
      <QVillageShell />
    </UniversalRouteGuard>
  );
}
