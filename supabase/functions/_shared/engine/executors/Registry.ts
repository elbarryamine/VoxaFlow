import { NodeExecutor } from '../types.ts';

const registry = new Map<string, NodeExecutor>();

export const ExecutorRegistry = {
  register(type: string, executor: NodeExecutor) {
    registry.set(type, executor);
  },
  get(type: string): NodeExecutor | undefined {
    return registry.get(type);
  },
};
