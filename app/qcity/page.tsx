"use client";

import QCityShell from "@/qcity/QCityShell";
import UniversalRouteGuard from "@/app/components/auth/UniversalRouteGuard";
import React from 'react';
import StylePreviewCard from '@/app/components/styles/StylePreviewCard';
import { listPresets } from '@/app/components/styles';
import LanguageSelector from '@/app/components/language/LanguageSelector';

export default function Page() {
  return (
    <UniversalRouteGuard>
      <QCityShell />
    </UniversalRouteGuard>
  );
}
