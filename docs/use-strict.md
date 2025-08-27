# "use strict" in JavaScript

> **TL;DR**: `"use strict"` switches JavaScript to a safer mode. It catches silent errors, blocks risky features, and makes `this` behave predictably. ES modules and `class` bodies are already strict by default.

---

## What is `"use strict"`?

A special directive string that turns on **strict mode** for a script or a function.

```js
"use strict"; // put at the top of a file OR inside a function
```

* **File‑level**: Must be the very first statement.
* **Function‑level**: Put it as the first line inside the function.
* **ES Modules** (`.mjs` / `type="module"`) and **class bodies** are **always strict**, no directive needed.

Why use it? It:

* Converts many silent bugs into **runtime errors** (so you see them early).
* Disallows dangerous features like `with`.
* Makes `this` in normal functions **`undefined`** if not bound (no more accidental `window`/global).
* Locks down `eval`/`arguments` behavior for predictability.

---

## Common JavaScript mistakes strict mode catches/changes

1. **Accidental globals** (assigning to an undeclared variable)

```js
"use strict";
price = 100; // ❌ ReferenceError (was creating a global in non‑strict)
```

2. **Duplicate object property names** (ES5 engines)

```js
"use strict";
const item = { id: 1, id: 2 }; // ❌ SyntaxError in older ES5 engines
```

3. **Duplicate function parameter names**

```js
"use strict";
function total(price, price) { /*...*/ } // ❌ SyntaxError
```

4. **`this` defaulting to global** (no more!)

```js
"use strict";
function show() { console.log(this); }
show(); // logs undefined (✅). Non‑strict: would be the global object
```

5. **Deleting variables, functions, or non‑configurable props**

```js
"use strict";
var a = 1;
delete a;            // ❌ SyntaxError
Object.defineProperty(globalThis, "x", { value: 1, configurable: false });
// delete x;         // ❌ TypeError in strict (fails loudly)
```

6. **Writing to read‑only / getter‑only properties**

```js
"use strict";
const obj = {};
Object.defineProperty(obj, "ro", { value: 7, writable: false });
obj.ro = 9; // ❌ TypeError (non‑strict: silently ignored)
```

7. **Octal literals like `0123` are forbidden** (use `0o123`)

```js
"use strict";
const n = 0123; // ❌ SyntaxError
const ok = 0o123; // ✅ 83
```

8. **`with` is banned**

```js
"use strict";
with (Math) { // ❌ SyntaxError
  console.log(random());
}
```

9. **Safer `eval`** (no leaking new vars to surrounding scope)

```js
"use strict";
let x = 1;
eval("var x = 99; console.log('inner', x)"); // prints inner 99
console.log("outer", x); // prints outer 1 (unchanged) ✅
```

10. **`arguments`/`eval` are reserved** (no reassigning or shadowing)

```js
"use strict";
function f(eval) {}      // ❌ SyntaxError (param named eval)
arguments = 5;           // ❌ TypeError
function g(a){ a = 10; console.log(arguments[0]); }
g(1); // prints 1 in strict (no aliasing); non‑strict: would print 10
```

11. **Accessing `arguments.callee` / `arguments.caller` is forbidden**

```js
"use strict";
(function self(){ console.log(arguments.callee); })(); // ❌ TypeError
```

12. **Future reserved words are blocked**
    `implements, interface, let, package, private, protected, public, static, yield` cannot be identifiers.

---

## Real‑world, super simple examples (5–10 quick wins)

### 1) Prevent accidental global

```js
"use strict";
function applyDiscount() {
  finalPrice = 99; // ❌ typo: should be let/const
}
```

**Fix**:

```js
let finalPrice = 0;
function applyDiscount(){ finalPrice = 99; }
```

### 2) Safer handlers with `this`

```js
"use strict";
function onClick(){ console.log(this === undefined); } // true
```

No more accidental reliance on `window`. Use `.bind`, arrow, or call via object.

### 3) Catch duplicate params in an API

```js
"use strict";
function createUser(id, id){ /*...*/ } // ❌ SyntaxError
```

### 4) No silent failure when writing to read‑only config

```js
"use strict";
const config = {};
Object.defineProperty(config, "mode", { value: "prod", writable:false });
config.mode = "dev"; // ❌ TypeError instead of silent ignore
```

### 5) Ban `with` in legacy code

```js
"use strict";
with(user){ name = "Shyam" } // ❌ SyntaxError
```

### 6) Block octal literals in price lists

```js
"use strict";
const price = 075; // ❌ SyntaxError; use 0o75
```

### 7) Keep `eval` boxed

```js
"use strict";
let token = "A";
eval("var token='B'");
console.log(token); // A ✅ (no bleed‑through)
```

### 8) Delete misuse surfaces instantly

```js
"use strict";
var cart = 1;
delete cart; // ❌ SyntaxError
```

### 9) Block arguments tricks

```js
"use strict";
function sum(a,b){ a=10; return a + arguments[0]; }
sum(1,2); // 20 in non‑strict; 11 in strict ✅
```

### 10) Prevent shadowing `eval`

```js
"use strict";
function run(eval){ } // ❌ SyntaxError
```

---

## Where strict mode applies automatically

* **ES Modules**: `<script type="module">` or `.mjs` files are always strict.
* **Class bodies**: everything inside `class { ... }` is strict.

---

## Best practices

* Prefer **ES modules** and **classes**; you get strict mode by default.
* If you ship legacy scripts, add `"use strict";` at the **top** of each file.
* Avoid features banned by strict mode even in non‑strict code (e.g., no `with`, no octals, no `arguments.callee`).
* Write variables with `let/const`, never rely on implied globals.
* Use linters (ESLint) to catch strict‑mode issues early.

---

## FAQ (short)

* **Does strict mode make code faster?** Engines may optimize strict code better because semantics are simpler (no `with`, fewer dynamic tricks). Treat any speedup as a bonus, not a guarantee.
* **Will it break old libraries?** Yes, sometimes—especially ones using `arguments.callee`, duplicate params, or relying on `this === window`.
* **Node.js**: ES modules (`.mjs` or `"type":"module"`) and class bodies are strict; CommonJS files need `"use strict";` if you want strict.

---

## 50 advanced interview questions (with crisp answers)

1. **What are the semantics of `this` in strict vs non‑strict functions?** Strict: unbound `this` is `undefined`; non‑strict: it’s the global object.
2. **Why was `with` banned in strict mode?** It destroys lexical predictability and blocks optimizations.
3. **How does strict mode change `eval`?** `eval` runs in its own scope and doesn’t leak vars to the outer scope; `eval`/`arguments` cannot be reassigned or shadowed.
4. **What happens when you assign to a read‑only property in strict mode?** Throws `TypeError` (non‑strict: silent no‑op).
5. **Can you delete a variable or function in strict mode?** No—`delete` on bindings is a `SyntaxError`.
6. **What about deleting a non‑configurable property?** Throws `TypeError` in strict; returns `false` in sloppy.
7. **Do getters/setters change behavior in strict mode?** Assigning to getter‑only throws in strict; silently ignored in sloppy.
8. **Are octal literals allowed?** Legacy `0NNN` literals are banned; use `0oNNN`.
9. **What are the restrictions on `arguments` in strict mode?** No aliasing with parameters; `arguments.callee/caller` forbidden; cannot assign to `arguments`.
10. **Can function parameters have duplicate names?** Not in strict—`SyntaxError`.
11. **Do duplicate object properties error in strict?** In ES5 engines they do; modern engines allow last‑write‑wins but linters/strict style discourage.
12. **How does strict mode affect `Function` constructor?** Functions created are strict only if the source includes the directive.
13. **Does strict mode alter hoisting?** Hoisting still exists; strict changes what is allowed (e.g., duplicates) but not hoist mechanics.
14. **How does strict mode interact with `let`/`const` and TDZ?** TDZ is ES6 spec feature independent of strict; modules (strict by default) commonly expose TDZ errors sooner.
15. **Are `class` bodies strict?** Yes, always.
16. **Are ES modules strict?** Yes, always.
17. **How does strict mode impact performance optimizations?** Simpler semantics can enable better engine optimizations; not guaranteed.
18. **Can you detect strict mode at runtime?** `function(){ return !this; }()` returns `true` in strict (since `this` is `undefined`).
19. **How are `this` bindings in arrow functions affected?** Arrow `this` is lexical; strict affects the surrounding scope’s rules, not arrow binding.
20. **Does strict mode change JSON behavior?** No; JSON parsing is the same.
21. **How does strict mode affect `bind`/`call`/`apply` with `null`/`undefined`?** `this` remains `null`/`undefined` in strict; coerced to global in sloppy.
22. **What about primitive `this` (e.g., number) in function calls?** In strict, primitives are not boxed for `this`.
23. **Can you declare `eval` as a variable in strict?** No; `eval` is a restricted identifier.
24. **Is `arguments` writable?** Assigning to it throws in strict.
25. **Does strict mode change enumeration order?** No.
26. **What is the effect on `delete` of plain names?** Always a `SyntaxError` in strict.
27. **Can you create properties on primitives implicitly?** No; attempts to assign to primitives’ props have no effect, and in strict may throw in certain operations.
28. **How does strict mode affect `for..in` or `for..of`?** No semantic change; but errors surface earlier (e.g., writing to RO targets).
29. \*\*Are `caller` and `arguments` properties on functions acces
