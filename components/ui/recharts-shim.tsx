import * as React from "react";

// Minimal shim for recharts components used by the app.
// These are placeholder components that provide just enough type coverage
// without requiring the full recharts library during build/type-check.

type ComponentProps = React.ComponentPropsWithoutRef<"div">;

export const ResponsiveContainer = ({
  children,
  ...props
}: ComponentProps & {
  children?: React.ReactNode;
  width?: string | number;
  height?: string | number;
}) => <div {...props}>{children}</div>;

export type TooltipPropsExtended = {
  active?: boolean;
  payload?: unknown[];
  label?: unknown;
  labelFormatter?: (value: unknown, payload?: unknown[]) => React.ReactNode;
  formatter?: (
    value: unknown,
    name: string,
    item: unknown,
    index: number,
    payload: unknown,
  ) => React.ReactNode;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
  labelClassName?: string;
  nameKey?: string;
  labelKey?: string;
  color?: string;
};
export const Tooltip = (props: ComponentProps & TooltipPropsExtended) => (
  <div {...props} />
);
export type TooltipProps = ComponentProps & TooltipPropsExtended;

export type LegendProps = ComponentProps & {
  payload?: unknown[];
  verticalAlign?: "top" | "bottom" | "middle" | string;
};
export const Legend = (props: LegendProps) => <div {...props} />;

export const BarChart = (
  props: ComponentProps & { children?: React.ReactNode } & Record<string, any>,
) => <div {...props}>{props.children}</div>;
export const Bar = (props: ComponentProps & Record<string, any>) => (
  <div {...props} />
);

export const PieChart = (
  props: ComponentProps & { children?: React.ReactNode } & Record<string, any>,
) => <div {...props}>{props.children}</div>;
export const Pie = (
  props: ComponentProps & { children?: React.ReactNode } & Record<string, any>,
) => <div {...props}>{props.children}</div>;
export const Cell = (props: ComponentProps & Record<string, any>) => (
  <div {...props} />
);

export const LineChart = (
  props: ComponentProps & { children?: React.ReactNode } & Record<string, any>,
) => <div {...props}>{props.children}</div>;
export const Line = (props: ComponentProps & Record<string, any>) => (
  <div {...props} />
);
export const XAxis = (props: ComponentProps & Record<string, any>) => (
  <div {...props} />
);
export const YAxis = (props: ComponentProps & Record<string, any>) => (
  <div {...props} />
);
export const CartesianGrid = (props: ComponentProps & Record<string, any>) => (
  <div {...props} />
);

export default {};

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.184047Z: replaced placeholders or noted TODOs. Please review.
