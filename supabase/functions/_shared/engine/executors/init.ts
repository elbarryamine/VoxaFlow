import { ExecutorRegistry } from './Registry.ts';
import { ApiRequestExecutor }  from './actions/ApiRequestExecutor.ts';
import { SendEmailExecutor }   from './actions/SendEmailExecutor.ts';
import { SlackExecutor }       from './actions/SlackExecutor.ts';
import { OpenAIExecutor }      from './actions/OpenAIExecutor.ts';
import { ConditionExecutor }   from './logic/ConditionExecutor.ts';
import { DelayExecutor }       from './logic/DelayExecutor.ts';
import { TriggerExecutor }     from './logic/TriggerExecutor.ts';

export function initExecutors() {
  // Actions
  ExecutorRegistry.register('api-request',   new ApiRequestExecutor());
  ExecutorRegistry.register('send-email',         new SendEmailExecutor());
  ExecutorRegistry.register('integration-email', new SendEmailExecutor());
  ExecutorRegistry.register('slack',         new SlackExecutor());
  ExecutorRegistry.register('openai',        new OpenAIExecutor());

  // Logic
  ExecutorRegistry.register('condition',     new ConditionExecutor());
  ExecutorRegistry.register('delay',         new DelayExecutor());

  // Triggers
  const triggerExecutor = new TriggerExecutor();
  ExecutorRegistry.register('webhook-shopify',      triggerExecutor);
  ExecutorRegistry.register('webhook-lightfunnels', triggerExecutor);
  ExecutorRegistry.register('webhook-youcan',       triggerExecutor);
  ExecutorRegistry.register('webhook-custom',       triggerExecutor);
}
