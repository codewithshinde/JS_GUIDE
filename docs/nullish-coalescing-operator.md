# Nullish Coalescing Operator (`??`)

### 🔹 What is `??` ?

* `??` is called the **Nullish Coalescing Operator** in JavaScript.
* It returns the **right-hand side value** only when the **left-hand side value is `null` or `undefined`**.
* If the left-hand side has **any other falsy value** (like `0`, `false`, `''`), it **does not replace it** (unlike `||`).

---

### 🔹 Why use it?

It helps us **set default values safely**, without mistakenly treating `0`, `false`, or `""` as empty.

---

### 🔹 Basic Syntax

```js
let result = value1 ?? value2;
```

👉 If `value1` is **not null/undefined**, `result = value1`.
👉 If `value1` is **null/undefined**, `result = value2`.

---

# 📝 Real-Life Examples (Basic → Realistic)

### 1. Default user name

```js
let username = null;
let displayName = username ?? "Guest";
console.log(displayName); // "Guest"
```

### 2. Difference with `||`

```js
let score = 0;
console.log(score || 100); // 100 (wrong if 0 is valid)
console.log(score ?? 100); // 0 (correct)
```

### 3. Checking API response

```js
let apiResponse = undefined;
let data = apiResponse ?? "No data found";
console.log(data); // "No data found"
```

### 4. Default price in a shopping cart

```js
let price = 0;  
let finalPrice = price ?? 100; 
console.log(finalPrice); // 0 ✅ (because 0 is valid)
```

### 5. Boolean flags

```js
let isActive = false;
let status = isActive ?? true;
console.log(status); // false ✅ (does not overwrite with true)
```

### 6. Nested objects (safe fallback)

```js
let settings = { theme: null };
let theme = settings.theme ?? "light";
console.log(theme); // "light"
```

### 7. Database default values

```js
let userAge = undefined;
let ageToSave = userAge ?? 18;
console.log(ageToSave); // 18
```

### 8. Multiple fallbacks

```js
let city = null;
let defaultCity = city ?? "New York" ?? "London";
console.log(defaultCity); // "New York"
```

### 9. Function parameters

```js
function greet(name) {
  let user = name ?? "Stranger";
  console.log("Hello " + user);
}
greet();       // "Hello Stranger"
greet("Karthik"); // "Hello Karthik"
```

### 10. Real-time API config example

```js
let config = { retries: 0 };
let retries = config.retries ?? 3;
console.log(retries); // 0 ✅ (valid, not replaced with 3)
```

---

# ⚡ Key Difference: `??` vs `||`

* `||` checks for **falsy values** (`false, 0, '', null, undefined, NaN`).
* `??` checks for **only nullish values** (`null, undefined`).

👉 Use `??` when **0, false, ""** are valid values.
👉 Use `||` when you want to replace **all falsy values**.

---

# 🎯 50 Interview Questions on `??`

### 🔹 Beginner (1–15)

1. What is the nullish coalescing operator in JavaScript?
2. Which values are considered nullish?
3. How is `??` different from `||`?
4. What does `let x = null ?? "default"` return?
5. What does `let x = 0 ?? 100` return?
6. Can `??` replace the ternary operator in some cases?
7. Is `false ?? true` equal to `true` or `false`?
8. Why was `??` introduced in ES2020?
9. What will `let result = "" ?? "empty"` return?
10. Can `??` be chained multiple times?
11. What does `undefined ?? null` return?
12. Can you use `??` with function parameters?
13. Why is `??` safer than `||` in user input validation?
14. Will `NaN ?? 100` return `NaN` or `100`?
15. Which is better for defaults: `??` or `||`?

---

### 🔹 Intermediate (16–35)

16. What is the result of `null ?? undefined ?? "hello"`?
17. Why doesn’t `??` consider `false` as nullish?
18. Can `??` be used with objects? Give example.
19. Can `??` be used in template literals?
20. What happens in `0 || 5` vs `0 ?? 5`?
21. What is the output of `let a; console.log(a ?? "default")`?
22. What’s the difference between `a = a ?? 1` and `a ||= 1`?
23. Can `??` be mixed with `||` in the same expression?
24. What is operator precedence of `??` compared to `||`?
25. Can you use `??` inside an arrow function default value?
26. Is `x = null ?? false` equal to `false` or `null`?
27. Why is `??` not the same as `a !== null ? a : b`?
28. Does `null ?? 0` return `0` or `null`?
29. What happens if both sides of `??` are nullish?
30. Can `??` be used in database config defaults?
31. Does `??` short-circuit evaluation?
32. Can `??` be polyfilled for older browsers?
33. Compare `??` vs optional chaining (`?.`).
34. Is `value ??= 10` valid syntax?
35. When should you avoid using `??`?

---

### 🔹 Advanced (36–50)

36. Explain the internal algorithm of how `??` evaluates operands.
37. Why can’t `??` be mixed with `||` or `&&` without parentheses?
38. What’s the precedence of `??` compared to `?:` (ternary)?
39. How does `??` behave with BigInt values?
40. Does `??` work with Symbol type?
41. How does `??` interact with Proxy objects?
42. Can you use `??` in default destructuring values? (e.g., `{ x = val ?? 5 }`)
43. How does Babel transpile `??` for older browsers?
44. What is the performance impact of `??` in large loops?
45. Compare `??` with `if (value == null) value = default`.
46. How does TypeScript handle `??` differently?
47. What will `[null, undefined, 0].map(x => x ?? 5)` return?
48. How does `??` work inside JSON.parse defaults?
49. Can `??` be overloaded in custom classes (via valueOf)?
50. Give a real-world case where `||` fails but `??` works.

Got it 👍
Here’s the **comparison table recreated in plain text** (easy to copy without formatting issues).

---
