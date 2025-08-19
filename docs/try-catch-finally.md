# Try / Catch / Finally — The Core

### What they do

* `try` — run code that *might* fail.
* `catch (err)` — runs **only if** something in `try` throws.
* `finally` — runs **always** (after `try`, or after `catch`), even if you `return` or `throw`—great for cleanup.

```js
function readConfig(raw) {
  try {
    const cfg = JSON.parse(raw);           // might throw SyntaxError
    if (!cfg.url) throw new Error("url missing");
    return cfg;
  } catch (err) {
    // handle or rethrow with context
    throw new Error(`Invalid config: ${err.message}`);
  } finally {
    // cleanup: metrics, timers, locks, temp files
    console.log("parse attempt finished");
  }
}
```

### Key rules (that trip people up)

1. `finally` **always runs**, even if you `return` inside `try`/`catch`.
2. A `return` inside `finally` **overrides** earlier returns/throws — avoid doing that.
3. `try…catch` only catches **synchronous** errors. For async code, use `await` or `.catch`.
4. In async functions, `await something()` inside `try` will route rejections to `catch`.

```js
// ❌ catch does NOT catch the async error:
try {
  fetch('/api'); // returns a Promise, no await; rejection is unhandled here
} catch (e) {}   // never reached

// ✅ correct:
try {
  const res = await fetch('/api');
} catch (e) {
  // handles network errors / rejections
}
```

---

# Built‑in Error Types (JS)

* `Error` — the base class (generic failures).
* `TypeError` — wrong type (e.g., calling non‑function).
* `ReferenceError` — variable not defined.
* `SyntaxError` — invalid code or `JSON.parse()` failure.
* `RangeError` — value out of range (e.g., invalid array length).
* `URIError` — bad `decodeURI`/`encodeURI` input.
* `EvalError` — legacy (rare).
* `AggregateError` — multiple errors together (e.g., from `Promise.any`).

```js
try {
  JSON.parse("{ bad json }");
} catch (e) {
  if (e instanceof SyntaxError) {
    console.error("Bad JSON:", e.message);
  }
}
```

> In browsers you’ll also see `DOMException` for things like storage/quota/permission issues.
> In Node.js you may see `SystemError`-like errors with `code` (e.g., `ENOENT` for missing file).

---

# Adding Context with `cause` (modern JS)

Wrap lower-level errors with more context while keeping the original stack:

```js
try {
  login(user, pass);
} catch (e) {
  throw new Error("Failed to login user", { cause: e });
}

// Later:
function toClientError(err) {
  console.error(err.cause); // original error
  return { message: err.message };
}
```

---

# Extending Errors (Custom Error Classes)

Create domain‑specific errors to make handling cleaner.

```ts
class ValidationError extends Error {
  field: string;
  constructor(message: string, field: string, cause?: unknown) {
    super(message, { cause });
    this.name = "ValidationError";
    this.field = field;
  }
}

class ExternalApiError extends Error {
  status: number;
  constructor(message: string, status: number, cause?: unknown) {
    super(message, { cause });
    this.name = "ExternalApiError";
    this.status = status;
  }
}

// Usage
function assertEmail(email: string) {
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new ValidationError("Invalid email", "email");
  }
}
```

**Why this helps**: In one place you can switch on `instanceof` and respond appropriately (400 vs 500, retry vs fail fast, etc.).

---

# Real‑World Scenarios & Tiny Examples

### 1) Parsing user input (validation path)

```js
function parseAndValidate(formJson) {
  try {
    const data = JSON.parse(formJson); // may throw
    if (!data.email) throw new ValidationError("Email required", "email");
    return data;
  } catch (err) {
    // Map to user-friendly message
    if (err instanceof SyntaxError) return { error: "Bad JSON format" };
    if (err instanceof ValidationError) return { error: err.message, field: err.field };
    return { error: "Unexpected error" };
  }
}
```

### 2) HTTP request with retries (transient failures)

```js
async function getWithRetry(url, tries = 3) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new ExternalApiError("Bad status", res.status);
      return await res.json();
    } catch (e) {
      lastErr = e;
      // retry only for network / 5xx
      if (e instanceof ExternalApiError && e.status < 500) break;
      await new Promise(r => setTimeout(r, 300 * (i + 1)));
    }
  }
  throw new Error(`All retries failed`, { cause: lastErr });
}
```

### 3) File handling with guaranteed cleanup

```js
import fs from "node:fs/promises";

async function processTempFile(content) {
  const path = `/tmp/upload-${Date.now()}.txt`;
  try {
    await fs.writeFile(path, content);
    // … process file …
  } finally {
    // ensure temp file removed even if processing throws
    await fs.rm(path).catch(() => {});
  }
}
```

### 4) Express.js centralized error handler (Node)

```js
// route
app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await repo.findUser(req.params.id);
    if (!user) throw new ValidationError("User not found", "id");
    res.json(user);
  } catch (e) {
    next(e); // pass to error middleware
  }
});

// error middleware (last)
app.use((err, req, res, next) => {
  console.error(err); // include err.cause if present
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message, field: err.field });
  } else if (err instanceof ExternalApiError) {
    res.status(502).json({ error: "Upstream failure" });
  } else {
    res.status(500).json({ error: "Internal error" });
  }
});
```

### 5) React component boundary (UI safety net)

> UI note: React **Error Boundaries** catch render/lifecycle errors of *children*, not event handlers / async. Use try/catch inside event handlers.

```jsx
function SaveButton() {
  const onClick = async () => {
    try {
      await save();
      alert("Saved!");
    } catch (e) {
      alert("Save failed: " + (e.message ?? "Unknown"));
    }
  };
  return <button onClick={onClick}>Save</button>;
}
```

---

# Patterns & Best Practices

* **Fail fast on programmer errors**, handle gracefully on user/network errors.
* **Don’t swallow errors**: if you can’t recover, rethrow or bubble up.
* **Attach context** (`cause`, extra fields) so logs are actionable.
* **Use custom errors** for predictable branching (`instanceof`).
* **Use `finally`** for deterministic cleanup (files, locks, spinners, timers).
* **In async code, always `await`** inside the `try`.
* **Prefer narrow try blocks** (wrap only the lines that can throw).
* **For concurrency**, consider `Promise.allSettled` to collect failures.
* **Map internal errors to safe client messages**, keep details in logs.

---

# Subtle Behaviors (Know these)

```js
// finally overriding returns — avoid this!
function f() {
  try { return 1; }
  finally { return 2; } // overrides → returns 2
}

// thrown in finally replaces earlier error — dangerous
function g() {
  try { throw new Error("A"); }
  finally { throw new Error("B"); } // "B" only — "A" is lost
}
```

---

# 25 Interview Qs (with short, direct answers)

1. **What does `try…catch` do?**
   Runs code that may throw; `catch` handles the thrown error.

2. **When does `finally` run?**
   Always (after `try` or `catch`), even if there’s a `return` or `throw`.

3. **Does `try…catch` catch async errors?**
   No—only if you `await` the promise (or use `.catch`).

4. **Name 5 built‑in error types.**
   `Error`, `TypeError`, `ReferenceError`, `SyntaxError`, `RangeError`.

5. **When do you use `TypeError` vs `Error`?**
   Use `TypeError` for wrong types (e.g., calling non‑function), `Error` when generic.

6. **How to preserve original error details when rethrowing?**
   Wrap with `new Error("context", { cause: err })`.

7. **What happens if `finally` has a `return`?**
   It overrides earlier `return`/`throw`. Avoid it.

8. **How to catch errors from multiple async ops without failing fast?**
   Use `Promise.allSettled` and inspect results.

9. **Difference: `throw new Error()` vs `return Promise.reject()` in async fn**
   In an `async` function both become rejected promises, but `throw` is clearer and keeps stack semantics.

10. **How to classify errors cleanly in an API?**
    Create custom errors (`ValidationError`, `ExternalApiError`) and map them to HTTP codes.

11. **What is `AggregateError` used for?**
    To hold several errors together (e.g., from `Promise.any`).

12. **How to retry only on transient errors?**
    Catch, check error type/status, backoff, retry; otherwise rethrow.

13. **Why keep `try` blocks small?**
    So you don’t accidentally hide unrelated errors and to keep intent clear.

14. **How to guarantee resource cleanup?**
    Use `finally` (close file/conn, release lock, stop timer).

15. **Do `catch` parameterless and `catch (e)` differ?**
    `catch {}` (no param) is allowed if you don’t need the error object.

16. **What is a “swallowed” error?**
    You catch but neither fix nor rethrow/log → it disappears; avoid this.

17. **How to attach metadata to errors?**
    Subclass `Error` with fields (e.g., `status`, `field`), or set properties.

18. **Can `JSON.parse` errors be distinguished from others?**
    Yes: `err instanceof SyntaxError`.

19. **How to centralize error handling in Express?**
    `next(err)` and define a final error middleware.

20. **React: what don’t Error Boundaries catch?**
    Async/event handler errors. Use local try/catch in handlers.

21. **Why use `cause` over concatenating messages?**
    Keeps original stack and structured provenance.

22. **What happens to the stack when you `throw`?**
    The stack is captured at throw; wrapping with `cause` preserves original.

23. **How to make a user‑friendly message while logging technical detail?**
    Log full error (and `cause`), return sanitized message to user.

24. **When to prefer `allSettled` vs `all`?**
    `allSettled` when you want all outcomes without short‑circuit on first failure.

25. **How to test error paths?**
    Mock dependencies to throw/reject; assert that you handle/transform correctly.

---

# Mini “Templates” You Can Reuse

**1) Validate → Map → Throw**

```ts
function requireEnv(key: string) {
  const v = process.env[key];
  if (!v) throw new ValidationError(`Missing env ${key}`, key);
  return v;
}
```

**2) Wrap with context**

```ts
try {
  await doPayment();
} catch (e) {
  throw new Error("Payment failed for order 123", { cause: e });
}
```

**3) Node CLI safe main**

```ts
async function main() {
  try { /* ... */ }
  catch (e) { console.error(e); process.exitCode = 1; }
}
main().finally(() => console.log("done"));
```

**4) Promise utilities**

```ts
const safe = (p) => p.then(v => [v, null]).catch(e => [null, e]);
const [data, err] = await safe(fetchJSON(url));
if (err) /* handle */;
```

---

# When to Use What (Cheat Sheet)

* **User input / JSON / config** → `try…catch`, `SyntaxError` / `ValidationError`.
* **External API / DB** → `try…catch` with `await`, custom `ExternalApiError`, retries + backoff.
* **File/stream/temp** → `finally` for cleanup.
* **Batch ops** → `Promise.allSettled` to collect per‑item errors.
* **Web API (Express)** → throw custom errors in routes, central error middleware.
* **UI (React)** → try/catch in event handlers; Error Boundaries for render crashes.
