# AGENTS.md

## Guidelines for AI agents working in this codebase.

## General Principles

- **One responsibility per function.** If you're naming it `fetchAndProcessAndSave`, split it.
- **Prefer explicit over implicit.** Pass data in, return data out. No hidden state or side effects.
- **Fail loudly.** Raise meaningful errors early. Never silently swallow exceptions.
- **Leave code cleaner than you found it.** Small improvements welcome; scope creep is not.

## Naming Conventions

| Thing                 | Style              | Example          |
| --------------------- | ------------------ | ---------------- |
| Variables & functions | `camelCase`        | `fetchUserData`  |
| Classes               | `PascalCase`       | `TaskRunner`     |
| Constants             | `UPPER_SNAKE_CASE` | `MAX_RETRIES`    |
| Files                 | `kebab-case`       | `task-runner.ts` |

Names should describe **what**, not **how**. `getUserById` is good. `queryDatabaseForUserRecord` is noise.

---

## Function Design

Keep functions **short** (under 30 lines) and **pure** where possible. When side effects are necessary, isolate them at the edges of your logic.

```typescript
// ✅ Good
function formatDisplayName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

// ❌ Bad — does too much, hard to test
function handleUser(user: User) {
  db.save(user);
  sendWelcomeEmail(user.email);
  logger.log(`User ${user.id} created`);
  cache.invalidate("users");
}
```

---

## Error Handling

Handle errors at the appropriate level with specific, useful messages.

```typescript
// ✅ Good
async function fetchUser(id: string): Promise<User> {
  const user = await db.find(id);
  if (!user) throw new NotFoundError(`User ${id} not found`);
  return user;
}

// ❌ Bad — caller gets no signal
async function fetchUser(id: string): Promise<User | null> {
  try {
    return await db.find(id);
  } catch {
    return null;
  }
}
```

---

## Comments

Explain **why**, not **what**. Document public interfaces with a brief JSDoc. Skip comments on obvious private helpers.

```typescript
// ✅ Good — explains intent
// Retry up to 3 times: the external API is flaky under high load
const MAX_RETRIES = 3;

// ❌ Bad — restates the obvious
// Set max retries to 3
const MAX_RETRIES = 3;
```

---

## External APIs & Tools

- Validate inputs before calling. Set timeouts. Never block indefinitely.
- Log calls and responses at debug level — no secrets, no full payloads.
- Treat responses as untrusted. Validate shape and values before use.

```typescript
// ✅ Good
async function getWeather(city: string): Promise<WeatherData> {
  if (!city.trim()) throw new Error("City name is required");
  const response = await weatherApi.fetch(city, { timeout: 5000 });
  if (!response.temperature)
    throw new Error(
      `Unexpected weather API response: ${JSON.stringify(response)}`,
    );
  return response;
}
```

---

## Agent-Specific Rules

**Scope:** Only modify files relevant to the current task. For out-of-scope changes, leave a `// TODO:` comment.

**State:** Treat each task as stateless. Write outputs to clearly named locations; don't overwrite inputs.

**Destructive actions:** Before deleting, overwriting, or making irreversible changes, describe what will happen and wait for explicit approval — unless already granted by the task description.

**Output format:** Return structured results whenever possible.

```typescript
// ✅ Good
return { status: "success", filesModified: ["src/utils.ts"], summary: "..." };
```

---

## Code Review Checklist

- [ ] Each function has one clear responsibility
- [ ] Errors are handled explicitly
- [ ] No dead code, unused imports, or debug logs
- [ ] Public functions have a one-line docstring
- [ ] External calls have timeouts and input validation
- [ ] No secrets or credentials in code or comments

---

## What Agents Should Not Do

- Install new dependencies without a comment explaining why
- Commit secrets, API keys, or credentials
- Make large sweeping changes — prefer small, reviewable increments
- Skip error handling because "it probably won't fail"
