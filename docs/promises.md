# Promises

## 1) What is a Promise?

An object representing a value that may arrive **later**.

**States:** `pending → fulfilled` (value) **or** `pending → rejected` (reason).
**Handlers:**

* `.then(onFulfilled?, onRejected?)`
* `.catch(onRejected)`
* `.finally(onFinally)` (no args; runs either way)

### Tiny start

```js
new Promise(res => setTimeout(() => res("done"), 300))
  .then(v => console.log(v)); // "done"
```

```js
Promise.reject(new Error("boom"))
  .catch(e => console.log("caught:", e.message))
  .finally(() => console.log("cleanup"));
```

---

## 2) Async/Await (sugar over Promises)

`async` fn returns a Promise. `await` pauses inside it until the Promise settles.

```js
async function getTotal(userId) {
  try {
    const user = await fetchUser(userId);
    const orders = await fetchOrders(user.id);
    return orders.reduce((s, o) => s + o.total, 0);
  } catch (e) {
    throw new Error("Total failed: " + e.message);
  }
}
```

---

## 3) Chaining & Error Rules

* Returning a **value** in `.then` → next link gets that value.
* Returning a **Promise** → chain waits for it.
* **Throw** in `.then` → becomes a rejection down the chain.
* `.catch` handles any rejection **above** it; if it returns a value, chain becomes fulfilled again.

```js
doThing()
  .then(() => { throw new Error("fail"); })
  .catch(() => "recovered")
  .then(v => console.log(v)); // "recovered"
```

---

## 4) Combinators (Concurrency Tools)

```js
await Promise.all([a(), b()]);      // all succeed or reject fast
await Promise.allSettled([a(), b()]); // always resolves with per-item status
await Promise.race([a(), b()]);     // first settle (fulfill OR reject)
await Promise.any([a(), b()]);      // first fulfill; rejects if all reject
```

---

## 5) Event Loop & Microtasks (execution order)

* **Sync** code first.
* Then **microtasks** (Promises).
* Then **macrotasks** (`setTimeout`, I/O).

```js
console.log("A");
setTimeout(() => console.log("D"), 0);
Promise.resolve().then(() => console.log("B"));
console.log("C");
// A, C, B, D
```

---

## 6) Real‑World Patterns (simple + solid)

### A) Retry with Exponential Backoff (gentle)

```js
async function retry(fn, { retries = 3, base = 200 } = {}) {
  for (let attempt = 0; ; attempt++) {
    try { return await fn(); }
    catch (e) {
      if (attempt >= retries) throw e;
      const wait = base * 2 ** attempt;         // 200, 400, 800, ...
      await new Promise(r => setTimeout(r, wait));
    }
  }
}
```

### B) Limited Concurrency (only N running)

```js
async function runWithPool(tasks, poolSize = 2) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < tasks.length) {
      const idx = i++;
      results[idx] = await tasks[idx]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(poolSize, tasks.length) }, worker));
  return results;
}

// usage: tasks = [() => fetch(...), () => fetch(...), ...]
```

### C) Memoize Async (dedupe in‑flight)

```js
function memoizeAsync(fn) {
  const cache = new Map(); // key → Promise
  return async (key) => {
    if (!cache.has(key)) cache.set(key, fn(key).finally(() => {}));
    return cache.get(key);
  };
}
```

### D) Timeout + AbortController

```js
function fetchWithTimeout(url, { ms = 2000, ...opts } = {}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort("timeout"), ms);
  return fetch(url, { ...opts, signal: controller.signal }).finally(() => clearTimeout(t));
}
```

### E) End‑to‑End Mini Demo (timeout + retry + parallel)

```js
async function getJson(url) {
  return retry(async () => {
    const res = await fetchWithTimeout(url, { ms: 1500 });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  }, { retries: 2, base: 200 });
}

(async () => {
  try {
    const [users, posts] = await Promise.all([
      getJson("https://jsonplaceholder.typicode.com/users"),
      getJson("https://jsonplaceholder.typicode.com/posts"),
    ]);
    console.log("users:", users.length, "posts:", posts.length);
  } catch (e) {
    console.error("Failed:", e.message);
  }
})();
```

---

## 7) Static Helpers (what exists today)

* `Promise.resolve(value)`
* `Promise.reject(reason)`
* `Promise.all(iterable)`
* `Promise.allSettled(iterable)`
* `Promise.race(iterable)`
* `Promise.any(iterable)`

> Note: Proposed (not universally available yet): `Promise.isFulfilled`, `isRejected`, `isSettled`, etc. Until then, track manually:

```js
function track(p) {
  let state = "pending", result;
  const t = p.then(
    v => (state = "fulfilled", result = v, v),
    e => { state = "rejected"; result = e; throw e; }
  );
  t.getState = () => state; t.getResult = () => result;
  return t;
}
```

---

## 8) Unhandled Rejections

* **Browser:** `window.addEventListener('unhandledrejection', e => ...)`
* **Node:** `process.on('unhandledRejection', (reason, p) => ...)`

Always ensure every Promise chain has a `.catch()` (or is awaited in a `try/catch`).

---

## 9) Best Practices & Gotchas

* Prefer `await` for readability; return early.
* **Always** `return` inside `.then()` chains to keep chaining correct.
* Use **one** `.catch()` per chain unless you can recover earlier.
* Use `finally` for cleanup only (it doesn’t receive result).
* Run independent async work in parallel via `Promise.all`.
* Use **backoff + jitter** for retries; consider idempotency.
* Don’t block the thread with heavy sync work before resolving.

---

# 30 Interview Q\&As (sharp & succinct)

1. **Promise states? Can it settle twice?**
   **A:** `pending → fulfilled` or `pending → rejected`. Extra resolve/reject calls after settlement are ignored.

2. **Return value vs return Promise vs throw in `.then()`?**
   **A:** `return 5` → next `.then(5)`; `return p` → waits; `throw e` → rejection flows to next `.catch()`.

3. **Order puzzle:** `console`, `Promise.then`, `setTimeout(0)`.
   **A:** Sync logs → all microtasks (Promises) → macrotasks (timeouts).

4. **`all` vs `allSettled`? When to use which?**
   **A:** `all` = all must succeed (fail fast). `allSettled` = collect results/errors for best‑effort/reporting.

5. **`race` vs `any` difference?**
   **A:** `race`: first to **settle** (fulfill or reject). `any`: first to **fulfill**, rejects only if all reject (`AggregateError`).

6. **Thenable definition + risk?**
   **A:** Object with `.then`. `Promise.resolve(thenable)` adopts it; untrusted thenables can misbehave or call handlers oddly.

7. **Promise cancellation?**
   **A:** Not natively; use `AbortController` with APIs that support `signal` (e.g., `fetch`).

8. **Can `.finally()` change the result?**
   **A:** No; it passes through prior outcome unless it **throws**, which turns chain into a rejection.

9. **What is an unhandled rejection? Why care?**
   **A:** A rejection without a catch. Leads to noisy logs, potential process crashes; always handle or log.

10. **Where to place `.catch()`?**
    **A:** Usually at the **end**. Place inner `.catch()` only to recover from specific errors and continue.

11. **Awaiting non‑Promise?**
    **A:** `await 42` is `await Promise.resolve(42)` → continues next microtask.

12. **Mixing `await` and `.then()` okay?**
    **A:** Yes, but prefer consistent style. `.then` can be fine for one‑liners; `await` is clearer for branching/try‑catch.

13. **Exponential backoff & jitter—why?**
    **A:** To reduce server stampedes; jitter randomizes waits and avoids synchronized retries.

14. **Implement a simple concurrency limiter idea.**
    **A:** Spawn N workers sharing an index; each pulls the next task until none left (see pool example).

15. **`Promise.all` short‑circuit behavior.**
    **A:** Rejects immediately on first failure; other results ignored (underlying tasks may still run).

16. **`Promise.resolve()` vs `new Promise(r => r())`?**
    **A:** Both fulfill; `resolve()` is simpler/cheaper. Both queue handlers as microtasks.

17. **Common bug: forgotten `return` inside `.then()`?**
    **A:** Next `.then` runs too early with `undefined`. Fix: always return the value/Promise.

18. **`allSettled` hiding critical failures—what do?**
    **A:** After results, scan for critical failures and throw aggregated error; otherwise proceed.

19. **`await` inside a loop—when bad?**
    **A:** Serializes independent tasks. Prefer `Promise.all(map(...))`. Use serial when order/dependency is required.

20. **Deduping in‑flight requests?**
    **A:** Cache **Promises** by key; if present, return the cached Promise (memoizeAsync).

21. **Microtasks vs macrotasks names?**
    **A:** Microtasks = PromiseJobs/`queueMicrotask`; Macrotasks = timers, I/O, message events.

22. **Top‑level `await` impact?**
    **A:** Module load may pause; affects startup ordering; bundlers/loaders must support async module graphs.

23. **Bridge EventEmitter to a Promise once.**
    **A:** Return `new Promise((res, rej) => { emitter.once('event', res); emitter.once('error', rej); })`; remember to remove listeners if needed.

24. **Timeout without leaking timers?**
    **A:** `setTimeout` + abort/settle + **clearTimeout** in `finally` (see `fetchWithTimeout`).

25. **Use `race` for timeout or `AbortController`?**
    **A:** `race` works everywhere but doesn’t stop work; AbortController cancels underlying operation if supported.

26. **`.catch()` placement effect.**
    **A:** It only handles rejections **above** it. Errors after it need another `.catch()`.

27. **`async` throw vs sync throw before first `await`?**
    **A:** Both become a rejected Promise; `try/catch` around `await` will catch either.

28. **Is `.finally()` good for resource cleanup?**
    **A:** Yes—close connections, clear timers, release locks—runs on both success/failure.

29. **Preserve order while running in parallel?**
    **A:** Map in index order and `await Promise.all`, or write results to `results[i]` as each finishes (pool example does this).

30. **Circuit breaker sketch with Promises.**
    **A:** Track failures/time window; after threshold → **open** (fail fast). After cool‑down → **half‑open** (probe). Success → **close**.

---

## Quick Reference (copy/paste)

```js
// Retry
const retry = async (fn, {retries=3, base=200}={}) => {
  for (let i=0;; i++) try { return await fn(); }
  catch (e) { if (i>=retries) throw e; await new Promise(r=>setTimeout(r, base*2**i)); }
};

// Pool
const runWithPool = async (tasks, n=2) => {
  const res=[], L=tasks.length; let i=0;
  const worker = async ()=>{ while(i<L){ const k=i++; res[k]=await tasks[k](); } };
  await Promise.all(Array.from({length: Math.min(n,L)}, worker)); return res;
};

// Memoize async
const memoizeAsync = (fn) => {
  const cache=new Map();
  return async (key)=> cache.get(key) ?? cache.set(key, fn(key).finally(()=>{})).get(key);
};

// Timeout + fetch
const fetchWithTimeout = (url,{ms=2000,...o}={})=>{
  const c=new AbortController(), t=setTimeout(()=>c.abort("timeout"), ms);
  return fetch(url,{...o, signal:c.signal}).finally(()=>clearTimeout(t));
};
```

---
