import { runExecuteNode } from '../_shared/engine/runExecuteNode.ts';

Deno.serve(async (req: Request) => {
  let reqBody;
  try {
    reqBody = await req.json();
  } catch {
    return new Response('invalid json', { status: 400 });
  }

  const { executionId, nodeId } = reqBody;
  if (!executionId || !nodeId) {
    return new Response('missing executionId or nodeId', { status: 400 });
  }

  const result = await runExecuteNode(executionId, nodeId);
  return new Response(result, { status: 200 });
});
