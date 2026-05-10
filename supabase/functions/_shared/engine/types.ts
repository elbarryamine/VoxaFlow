// ─── Graph Primitives ────────────────────────────────────────────────────────

export type NodeId = string;

export interface WorkflowEdge {
  id: string;
  source: NodeId;
  target: NodeId;
  sourceHandle?: string;  // e.g. 'true' | 'false' for condition nodes
  targetHandle?: string;
}

export interface WorkflowNode {
  id: NodeId;
  type: string;                    // matches a key in ExecutorRegistry
  data: Record<string, unknown>;   // config set in the UI, may contain {{variables}}
}

export interface WorkflowDefinition {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

// ─── Execution Runtime ───────────────────────────────────────────────────────

export interface ExecutionContext {
  executionId: string;
  workflowId: string;
  userId: string;
  triggerPayload: Record<string, unknown>;

  // Keyed by node_id. Populated from node_executions rows before each step.
  // e.g. state['node_abc'] = { email: 'user@example.com', id: 42 }
  state: Record<NodeId, unknown>;

  // Recursively replaces {{...}} templates in any string or nested object/array
  interpolate<T>(template: T): T;

  // Resolves and decrypts a credential by ID
  resolveCredential(credentialId: string): Promise<Record<string, string>>;
}

export interface ExecutionResult {
  status: 'success' | 'failed';
  output?: Record<string, unknown>;   // stored in node_executions.output_data
  error?: string;
  // Returned by condition nodes to control which branch fires next
  // Must match a sourceHandle value on the node's outgoing edges
  branchTarget?: string;
}

// ─── Executor Contract ───────────────────────────────────────────────────────

export interface NodeExecutor {
  execute(node: WorkflowNode, context: ExecutionContext): Promise<ExecutionResult>;
}
