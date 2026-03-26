// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:07Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import React, { Suspense, lazy, ComponentType } from "react";
import { useTheme } from "next-themes";

interface WrapperProps {
  component: ComponentType<any>;
  componentProps?: Record<string, any>;
  lazy?: boolean;
}

// Generic wrapper that adds theme awareness and optional lazy loading
export function WrappedComponent({
  component,
  componentProps = {},
  lazy: enableLazy = false,
}: WrapperProps) {
  const { theme } = useTheme();
  const ThemedComponent = component;

  if (enableLazy) {
    const LazyComp = lazy(() => Promise.resolve({ default: component }));
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComp {...componentProps} theme={theme} />
      </Suspense>
    );
  }

  return <ThemedComponent {...componentProps} theme={theme} />;
}

// Helper to ease creation of lazy variants
export function lazyWrap<T extends ComponentType<any>>(comp: T) {
  return (props: React.ComponentProps<T>) => (
    <WrappedComponent component={comp} componentProps={props} lazy />
  );
}
