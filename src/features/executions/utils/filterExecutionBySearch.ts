import { matchesSearchQuery } from "@/src/shared/utils/matchesSearchQuery";
import type { Execution } from "../types/Execution.types";

export const filterExecutionBySearch = (
  execution: Execution,
  query: string,
): boolean =>
  matchesSearchQuery(
    query,
    execution.workflowName,
    execution.trigger,
    execution.status,
    execution.duration,
    execution.id,
    execution.workflowId,
  );
