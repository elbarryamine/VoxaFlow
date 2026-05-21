/** Plan limits aligned with /pricing (PRICING_PLANS). */
export const PLAN_IDS = ["canvas", "studio", "operations"] as const;

export type PlanId = (typeof PLAN_IDS)[number];

export interface PlanDefinition {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  maxActiveWorkflows: number | null;
  maxRunsPerMonth: number;
  maxSeats: number;
}

export const PLANS: Record<PlanId, PlanDefinition> = {
  canvas: {
    id: "canvas",
    name: "Canvas",
    price: "$0",
    period: "forever",
    maxActiveWorkflows: 3,
    maxRunsPerMonth: 500,
    maxSeats: 1,
  },
  studio: {
    id: "studio",
    name: "Studio",
    price: "$29",
    period: "per month",
    maxActiveWorkflows: null,
    maxRunsPerMonth: 10_000,
    maxSeats: 1,
  },
  operations: {
    id: "operations",
    name: "Operations",
    price: "$79",
    period: "per month",
    maxActiveWorkflows: null,
    maxRunsPerMonth: 50_000,
    maxSeats: 5,
  },
};

export const DEFAULT_PLAN_ID: PlanId = "canvas";

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && PLAN_IDS.includes(value as PlanId);
}

export function getPlan(planId: PlanId): PlanDefinition {
  return PLANS[planId];
}
