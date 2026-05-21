# Clean Code

Language-agnostic conventions for this repo. React/UI rules live in [`react.md`](react.md); scaffolding in [`new-feature.md`](new-feature.md).

---

## Principles

- **One responsibility per function.** Split names like `fetchAndProcessAndSave`.
- **Explicit over implicit.** Pass data in, return data out; isolate side effects at the edges.
- **Fail loudly.** Throw specific, meaningful errors early — never swallow silently.
- **Small diffs.** Improve what you touch; don't expand scope beyond the task.

---

## Naming

| Thing | Style | Example |
| --- | --- | --- |
| Variables & functions | `camelCase` | `fetchUserData` |
| Classes | `PascalCase` | `WorkflowController` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRIES` |
| Files | `kebab-case` | `map-db-execution.ts` |

Names describe **what**, not **how** — `getUserById` not `queryDatabaseForUserRecord`.

---

## Functions

- Target **~30 lines**; keep pure when possible.
- Side effects (DB, email, logging) belong at boundaries, not mixed into formatting/mapping logic.

```typescript
// ✅ Single job
function formatDisplayName(first: string, last: string): string {
  return `${first} ${last}`.trim();
}

// ❌ Multiple jobs — hard to test
function handleUser(user: User) {
  db.save(user);
  sendWelcomeEmail(user.email);
  logger.log(`User ${user.id} created`);
}
```

---

## Errors

Handle at the right layer with messages callers can act on.

```typescript
// ✅
async function fetchUser(id: string): Promise<User> {
  const user = await db.find(id);
  if (!user) throw new NotFoundError(`User ${id} not found`);
  return user;
}

// ❌ Hides failure
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

Explain **why**, not **what**. Brief JSDoc on public APIs; skip obvious private helpers.

---

## External APIs

- Validate inputs before calling; set timeouts; never block indefinitely.
- Treat responses as untrusted — validate shape before use.
- Log at debug level only; never log secrets or full payloads.

```typescript
async function getWeather(city: string): Promise<WeatherData> {
  if (!city.trim()) throw new Error("City name is required");
  const response = await weatherApi.fetch(city, { timeout: 5000 });
  if (response.temperature == null) {
    throw new Error(`Unexpected weather API response: ${JSON.stringify(response)}`);
  }
  return response;
}
```

---

## Agent scope

- Modify only files relevant to the task. For unrelated fixes, leave a `// TODO:`.
- Treat each task as stateless; write outputs to clear locations; don't overwrite inputs.
- Before destructive or irreversible changes, describe the impact unless the task already grants approval.
- Prefer structured results: `{ status, filesModified, summary }`.

---

## Do not

- Install dependencies without a comment explaining why
- Commit secrets, API keys, or credentials
- Ship large unrelated refactors in one change
- Skip error handling because a path "probably won't fail"

---

## Review checklist

- [ ] Each function has one clear responsibility
- [ ] Errors are explicit and useful
- [ ] No dead code, unused imports, or debug `console.log`
- [ ] External calls have timeouts and input validation
- [ ] No secrets in code or comments
