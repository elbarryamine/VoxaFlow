import { NodeExecutor, WorkflowNode, ExecutionContext, ExecutionResult } from '../../types.ts';


interface ConditionRule {
  field: string;
  operator: string;
  value: any;
}

export class ConditionExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: ExecutionContext): Promise<ExecutionResult> {
    const rules = (node.data.rules as ConditionRule[]) || [];
    const logic = (node.data.logic as string) ?? 'AND';

    const results = rules.map(rule => evaluateRule(rule, context.state, context.triggerPayload));
    
    let passed = true;
    if (rules.length > 0) {
       passed = logic === 'AND' ? results.every(Boolean) : results.some(Boolean);
    }

    return {
      status: 'success',
      output: { passed, results },
      branchTarget: passed ? 'true' : 'false',
    };
  }
}

function evaluateRule(rule: ConditionRule, state: Record<string, unknown>, triggerPayload: Record<string, unknown>): boolean {
  const left = get({ trigger: triggerPayload, ...state }, rule.field);
  const right = rule.value;

  switch (rule.operator) {
    case 'equals':           return String(left) === String(right);
    case 'not_equals':       return String(left) !== String(right);
    case 'contains':         return String(left).includes(String(right));
    case 'greater_than':     return Number(left) > Number(right);
    case 'less_than':        return Number(left) < Number(right);
    case 'exists':           return left !== undefined && left !== null;
    case 'not_exists':       return left === undefined || left === null;
    default:                 return false;
  }
}

function get(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => {
    if (acc === null || acc === undefined) return undefined;
    const bracketIndex = part.indexOf('[');
    if (bracketIndex !== -1) {
      const key = part.slice(0, bracketIndex);
      const arrayPart = part.slice(bracketIndex);
      let currentVal = key ? acc[key] : acc;
      const matches = arrayPart.match(/\[(\d+)\]/g);
      if (matches) {
        for (const match of matches) {
          if (currentVal === null || currentVal === undefined) return undefined;
          const idx = parseInt(match.replace(/[\[\]]/g, ''), 10);
          currentVal = currentVal[idx];
        }
      }
      return currentVal;
    }
    return acc[part];
  }, obj);
}
