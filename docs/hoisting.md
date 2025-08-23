# Hoisting

## 🔹 What is Hoisting?

* **Hoisting** is JavaScript’s default behavior of moving **declarations** to the top of their scope (global or function scope).
* It means you can use variables/functions **before they are declared** in the code (though behavior depends on `var`, `let`, `const`, or function type).

Check out the video and come back here

# Video by Web Dev Simplified
https://www.youtube.com/watch?v=EvfRXyKa_GI

---

## 🔹 What Gets Hoisted?

| Item                          | Hoisted?   | Behavior                                                                                                               |
| ----------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| **`var` variables**           | ✅ Yes      | Hoisted but initialized as `undefined`.                                                                                |
| **`let` & `const` variables** | ✅ Yes      | Hoisted, but kept in **Temporal Dead Zone (TDZ)** until initialized. Using before declaration → ❌ ReferenceError.      |
| **Function Declarations**     | ✅ Yes      | Hoisted fully (you can call them before declaration).                                                                  |
| **Function Expressions**      | ⚠️ Partial | Variable is hoisted, but assignment happens later. If declared with `var` → `undefined`; with `let/const` → TDZ error. |
| **Class Declarations**        | ✅ Yes      | Hoisted but in TDZ. Cannot access before declaration.                                                                  |

---

## 🔹 Examples

### 1. `var` Hoisting

```js
console.log(a); // undefined (not error)
var a = 10;
console.log(a); // 10
```

👉 `var a;` is hoisted at the top, but value assignment (`a=10`) happens later.

---

### 2. `let` & `const` Hoisting (TDZ)

```js
console.log(b); // ❌ ReferenceError
let b = 20;

console.log(c); // ❌ ReferenceError
const c = 30;
```

👉 Both `b` and `c` are hoisted but kept in **Temporal Dead Zone** until their line of initialization.

---

### 3. Function Declaration Hoisting

```js
sayHello(); // ✅ Works

function sayHello() {
  console.log("Hello, World!");
}
```

👉 Entire function is hoisted, so you can call it before declaration.

---

### 4. Function Expression Hoisting

```js
greet(); // ❌ TypeError: greet is not a function

var greet = function () {
  console.log("Hi!");
};
```

👉 `var greet;` is hoisted → `undefined`. At call time, it’s not yet assigned as a function.

---

### 5. Arrow Functions with `let`/`const`

```js
sayHi(); // ❌ ReferenceError

const sayHi = () => {
  console.log("Hi there!");
};
```

👉 Hoisted but in **TDZ** → cannot use before declaration.

---

### 6. Class Declaration Hoisting

```js
const obj = new Person(); // ❌ ReferenceError

class Person {
  constructor() {
    this.name = "John";
  }
}
```

👉 Classes are also hoisted but in **TDZ** like `let`/`const`.

---

## 🔹 Real-Time Example (Why It Matters)

### Example: Loading Config

```js
// Use config before declaration
initializeApp();

function initializeApp() {
  console.log("App started with mode:", mode);
}

var mode = "production";
```

**Output:**

```
App started with mode: undefined
```

👉 Here, `mode` is hoisted as `var mode;` but initialized as `undefined` when `initializeApp` runs.
This can cause **bugs in production apps** if developers expect the value.

✅ **Fix**: Use `let`/`const` to avoid unexpected `undefined`.

---

## 🔹 Key Takeaways

* **Declarations are hoisted, not initializations**.
* Use **`let` and `const`** to avoid bugs caused by `var`.
* Function **declarations** are hoisted completely.
* Function **expressions** & **arrow functions** depend on variable hoisting rules.
* **Classes** are hoisted but inaccessible before initialization (TDZ).
