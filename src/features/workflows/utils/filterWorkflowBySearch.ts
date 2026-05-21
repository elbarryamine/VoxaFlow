import { matchesSearchQuery } from "@/src/shared/utils/matchesSearchQuery";
import type { Workflow } from "../types/Workflow.types";

export const filterWorkflowBySearch = (
  workflow: Workflow,
  query: string,
): boolean =>
  matchesSearchQuery(
    query,
    workflow.name,
    workflow.profileName,
    workflow.id,
    workflow.is_active ? "active" : "inactive",
  );
