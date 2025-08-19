# 📌 Pure Functions in JavaScript

## 🔹 Definition

A **Pure Function** is a function that:

1. **Given the same input, always returns the same output.**
2. **Has no side effects** (doesn’t modify variables, objects, or states outside of its scope).

---

## 🔹 Characteristics of Pure Functions

* **Deterministic** → Same input → Same output.
* **No side effects** → Doesn’t modify external variables, objects, databases, or DOM.
* **Self-contained** → Only depends on its arguments, not external state.

---

## 🔹 Examples

### ✅ Pure Function Example

```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // 5
console.log(add(2, 3)); // 5 (always the same result)
```

👉 Same input `(2,3)` will always give `5`.

---

### ❌ Impure Function Example (side effect)

```js
let total = 0;

function addToTotal(a) {
  total += a;  // modifies external variable
  return total;
}

console.log(addToTotal(5)); // 5
console.log(addToTotal(5)); // 10 (different result for same input)
```

👉 Depends on **external state** (`total`), so it’s **not pure**.

---

### ❌ Impure Function Example (randomness)

```js
function getRandomNumber() {
  return Math.random();
}

console.log(getRandomNumber()); // e.g. 0.123
console.log(getRandomNumber()); // e.g. 0.984
```

👉 Same input (none), but different outputs each time → **impure**.

---

## 🔹 Real-World Example

### Pure Function (Safe for financial calculations)

```js
function calculateTax(amount, taxRate) {
  return amount * taxRate;
}

console.log(calculateTax(1000, 0.2)); // 200
console.log(calculateTax(1000, 0.2)); // 200 (consistent)
```

### Impure Function (Not safe)

```js
let taxRate = 0.2;

function calculateTaxImpure(amount) {
  taxRate = taxRate + 0.01;  // modifies global state
  return amount * taxRate;
}

console.log(calculateTaxImpure(1000)); // 210
console.log(calculateTaxImpure(1000)); // 220 (different!)
```

---

## 🔹 Why Pure Functions Matter?

* ✅ Easier to **test** (no dependencies on external state).
* ✅ Easier to **debug** (predictable behavior).
* ✅ Useful in **functional programming** & frameworks like **React** (pure components).
* ✅ Help in **immutability** and avoiding bugs.


👉 Would you like me to also explain **how React components follow the idea of pure functions** (like `render()` being pure) with examples?
