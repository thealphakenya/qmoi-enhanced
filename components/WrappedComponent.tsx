import ErrorBoundary from '@/components/ErrorBoundary';
import React, { ComponentType, lazy, Suspense } from "react";
import { useTheme } from "next-themes";
import { logger } from "@/lib/logger";

interface WrapperProps {
  component: ComponentType<any>;
  componentProps?: Record<string, any>;
  lazy?: boolean;
}
// Generic wrapper that adds theme awareness and optional lazy loading
export default function WrappedComponent({
  component,
  componentProps = {},
  lazy: enableLazy = false,
}: WrapperProps): JSX.Element {
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
export function lazyWrap<T extends ComponentType<any>>(comp: T) {
  return (props: React.ComponentProps<T>) => (
    <WrappedComponent component={comp} componentProps={props} lazy />
  );
}









