import {
  DEFAULT_PLAN_ID,
  isPlanId,
  type PlanId,
} from "@/src/shared/constants/plans";

interface UserWithPlanMetadata {
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}

export function getUserPlanId(user: UserWithPlanMetadata): PlanId {
  const fromUser = user.user_metadata?.plan_id;
  if (isPlanId(fromUser)) return fromUser;

  const fromApp = user.app_metadata?.plan_id;
  if (isPlanId(fromApp)) return fromApp;

  return DEFAULT_PLAN_ID;
}
