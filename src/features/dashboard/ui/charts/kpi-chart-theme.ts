/** KPI charts — tokens from docs/design-light.md & globals.css */
export const KPI_MINI_CHART_HEIGHT = 64;
export const KPI_DONUT_MAX_WIDTH = 88;

export const KPI_DONUT_LAYOUT_GAP = "gap-2";

export const KPI_COLORS = {
  success: "var(--success)",
  error: "var(--error)",
  primary: "var(--primary)",
  warning: "var(--warning)",
  muted: "var(--surface-variant)",
  track: "var(--surface-variant)",
} as const;

export const KPI_AREA_GRADIENT = {
  topOpacity: 0.4,
  bottomOpacity: 0.06,
} as const;

export const KPI_STROKE_WIDTH = 2;

export const KPI_CHART_MARGIN = { top: 6, right: 0, left: 0, bottom: 0 } as const;

/** Area trend — axis labels at bottom, plot hugs baseline. */
export const KPI_AREA_CHART_MARGIN = {
  top: 4,
  right: 0,
  left: 0,
  bottom: 14,
} as const;

export const KPI_PIE = {
  innerRadius: "58%",
  outerRadius: "90%",
  paddingAngle: 3,
  strokeWidth: 0,
} as const;

/** label-sm + MetricCell patterns */
export const KPI_LEGEND_LABEL_CLASS =
  "font-manrope text-[10px] font-bold uppercase tracking-wide text-on-surface-variant/70";

export const KPI_LEGEND_VALUE_CLASS = "mt-0.5 font-manrope text-[13px] font-bold tabular-nums";

export const KPI_LEGEND_TONES = {
  success: "text-success",
  error: "text-error",
  primary: "text-on-surface",
  warning: "text-warning",
  muted: "text-on-surface-variant",
} as const;

export const KPI_LEGEND_DOTS = {
  success: "bg-success",
  error: "bg-error",
  primary: "bg-primary",
  warning: "bg-warning",
  muted: "bg-surface-variant",
} as const;

export type KpiLegendTone = keyof typeof KPI_LEGEND_TONES;

export const kpiTooltipStyle = {
  fontSize: 12,
  fontWeight: 600,
  borderRadius: 12,
  border: "1px solid color-mix(in srgb, var(--outline-variant) 50%, transparent)",
  background: "var(--card)",
  color: "var(--on-surface)",
  fontFamily: "var(--font-manrope)",
} as const;

export const kpiTooltipLabelStyle = {
  color: "var(--on-surface-variant)",
  marginBottom: 4,
  fontFamily: "var(--font-manrope)",
} as const;

export const kpiAxisTickStyle = {
  fontSize: 10,
  fontWeight: 600,
  fill: "var(--on-surface-variant)",
  fontFamily: "var(--font-manrope)",
} as const;

export const kpiTooltipCursor = {
  stroke: "var(--outline-variant)",
  strokeWidth: 1,
} as const;

export function kpiSemanticFill(percent: number): string {
  if (percent < 50) return KPI_COLORS.error;
  return KPI_COLORS.primary;
}

export const KPI_STATUS_SLICES = [
  {
    key: "success" as const,
    name: "Success",
    fill: KPI_COLORS.primary,
    tone: "primary" as const,
  },
  {
    key: "failed" as const,
    name: "Failed",
    fill: KPI_COLORS.error,
    tone: "error" as const,
  },
  {
    key: "running" as const,
    name: "Running",
    fill: KPI_COLORS.primary,
    tone: "primary" as const,
  },
  {
    key: "waiting" as const,
    name: "Waiting",
    fill: KPI_COLORS.muted,
    tone: "muted" as const,
  },
] as const;
