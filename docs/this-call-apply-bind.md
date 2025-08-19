# 📌 `this`, `call`, `apply`, and `bind` in JavaScript

---

## 🔹 1. Understanding `this`

* `this` refers to the **execution context** (who is calling the function).
* Its value depends on **how a function is called**, not where it’s defined.

### 1.1 `this` in Global Scope

```js
console.log(this); 
// In browser → Window object
// In Node.js → {}
```

---

### 1.2 `this` in Normal Function

```js
function showThis() {
  console.log(this);
}
showThis(); 
// In strict mode → undefined
// Non-strict → Window (browser)
```

---

### 1.3 `this` in Object Method

```js
const obj = {
  name: "Shyam",
  greet: function() {
    console.log(this.name);
  }
};

obj.greet(); // "Shyam"
```

👉 `this` refers to the object (`obj`).

---

### 1.4 `this` in Arrow Function

```js
const obj = {
  name: "Shyam",
  greet: () => {
    console.log(this.name);
  }
};

obj.greet(); // undefined (Arrow doesn’t bind its own `this`)
```

👉 Arrow functions capture `this` from their **lexical scope** (where they are defined).

---

### 1.5 `this` Inside a Function in Object

```js
const obj = {
  name: "Shyam",
  nested: {
    show: function () {
      console.log(this.name);
    }
  }
};

obj.nested.show(); // undefined (because `this` refers to `nested`, not `obj`)
```

---

### 1.6 `this` in Constructor Functions / Classes

```js
function Person(name) {
  this.name = name;
}
const p1 = new Person("Shyam");
console.log(p1.name); // "Shyam"
```

👉 In constructor, `this` points to the new object created.

---

### 1.7 Event Handlers

```js
document.querySelector("button").addEventListener("click", function () {
  console.log(this); // button element
});

document.querySelector("button").addEventListener("click", () => {
  console.log(this); // lexical `this` (likely Window)
});
```

---

## 🔹 2. `call`, `apply`, and `bind`

These methods **manually control the value of `this`**.

---

### 2.1 `call()`

* Calls a function with a given `this` and **arguments passed individually**.

```js
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const user = { name: "Shyam" };

greet.call(user, "Hello", "!"); // Hello, Shyam!
```

---

### 2.2 `apply()`

* Similar to `call()`, but arguments are passed as an **array**.

```js
greet.apply(user, ["Hi", "!!!"]); // Hi, Shyam!!!
```

---

### 2.3 `bind()`

* Returns a **new function** with `this` permanently bound.
* Doesn’t call immediately.

```js
const boundGreet = greet.bind(user, "Hey");
boundGreet("?"); // Hey, Shyam?
```

👉 You can **pass variables later** to the bound function.

---

## 🔹 3. Core Differences

| Feature       | `call`                   | `apply`                        | `bind`                            |
| ------------- | ------------------------ | ------------------------------ | --------------------------------- |
| **Execution** | Calls function instantly | Calls function instantly       | Returns new function (delayed)    |
| **Arguments** | Passed individually      | Passed as array                | Passed partially (later possible) |
| **Use Case**  | Direct function invoke   | When args are already in array | Event handlers, callbacks         |

---

## 🔹 4. Real-World Examples

### Example 1: Borrowing Methods

```js
const person1 = { name: "Alice" };
const person2 = { name: "Bob" };

function sayHello() {
  console.log(`Hello, ${this.name}`);
}

sayHello.call(person1); // Hello, Alice
sayHello.call(person2); // Hello, Bob
```

---

### Example 2: Math with `apply`

```js
const numbers = [5, 2, 9, 1];
console.log(Math.max.apply(null, numbers)); // 9
```

---

### Example 3: `bind` for Event Handlers

```js
class Button {
  constructor(label) {
    this.label = label;
  }

  click() {
    console.log(`${this.label} clicked`);
  }
}

const b = new Button("Save");

document.querySelector("button")
  .addEventListener("click", b.click.bind(b));
```

---

### Example 4: Partial Application with `bind`

```js
function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2);
console.log(double(5)); // 10
```

---

## 🔹 5. Why Do They Exist in JS?

* To **control context (`this`)** explicitly.
* To **borrow functions** between objects.
* To implement **function currying** / **partial application**.
* To handle **callbacks** where `this` is lost (e.g., event listeners, setTimeout).

---

## 🔹 6. Interview Questions (Basic → Advanced)

### 🔹 Basics

1. What is `this` in JavaScript? How does it differ in arrow vs normal functions?
2. Difference between `call`, `apply`, and `bind`.
3. What is the **default value of `this`** in strict mode vs non-strict mode?

### 🔹 Intermediate

4. Can you use `bind` to implement partial functions? Example?
5. Why do we need `bind` in event handlers in React/JS?
6. What happens if you use `new` with a function that’s bound with `bind`?
7. How does `this` behave inside a `setTimeout`?

### 🔹 Advanced / Tricky

8. Why can’t arrow functions be used as constructors with `new`?
9. Can you re-bind a function multiple times? What will happen?

   ```js
   const f = greet.bind(user1).bind(user2);
   f(); // Who will it bind to?
   ```
10. How would you polyfill `call`, `apply`, and `bind`?
11. How does `this` behave in nested objects? Example:

    ```js
    const obj = {
      a: 10,
      inner: {
        a: 20,
        show: function () {
          console.log(this.a);
        }
      }
    };
    obj.inner.show(); // ?
    ```

---

✅ This is enough to handle **90% of interview questions** around `this`, `call`, `apply`, and `bind`.
