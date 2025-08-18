## 🔹 What is a Closure?

A **closure** is created when a function **remembers variables from its lexical scope**, even after the outer function has finished executing.

In simple words:

* A function defined **inside another function** can access the outer function’s variables.
* Even if the outer function is done running, the inner function still “remembers” those variables.

---

## 🔹 Basic Example

```javascript
function outer() {
  let counter = 0;

  function inner() {
    counter++;
    return counter;
  }

  return inner;
}

const increment = outer(); 
console.log(increment()); // 1
console.log(increment()); // 2
console.log(increment()); // 3
```

👉 Here, `inner()` **remembers** `counter` from `outer()`, even though `outer()` has already returned. This is closure in action.

---

## 🔹 Real-Time Examples

### 1. **In JavaScript / Node.js – Data Privacy**

Closures let us create **private variables**, which is useful in backend logic.

```javascript
function createUser(name) {
  let balance = 100; // private variable

  return {
    getName: () => name,
    getBalance: () => balance,
    deposit: (amount) => balance += amount,
    withdraw: (amount) => balance -= amount
  };
}

const user = createUser("Shyam");
console.log(user.getName()); // Shyam
console.log(user.getBalance()); // 100
user.deposit(50);
console.log(user.getBalance()); // 150
```

👉 Used in **Node.js** to protect sensitive data (like balance, tokens, sessions).

---

### 2. **In React – Event Handlers & State**

Closures are everywhere in React because event handlers capture state at the time they are created.

```jsx
import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(prev => prev + 1); // closure remembers "prev"
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}
```

👉 Here, the `handleClick` function **closes over** `count` and `setCount`. Without closures, React state updates would not work correctly.

---

### 3. **In React – Avoiding Stale State**

Sometimes closures cause bugs if you don’t update state correctly.

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1); // ✅ closure over the latest state
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <p>{seconds} seconds</p>;
}
```

👉 Without closure (`setSeconds(prev => prev+1)`), the interval would capture a **stale value** of `seconds`.

---

### 4. **In Node.js – Middleware Functions**

Closures let middleware capture configurations.

```javascript
function authMiddleware(roleRequired) {
  return function (req, res, next) {
    if (req.user.role === roleRequired) {
      next(); // ✅ proceed
    } else {
      res.status(403).send("Forbidden");
    }
  };
}

// Usage in Express.js
app.get("/admin", authMiddleware("admin"), (req, res) => {
  res.send("Welcome Admin");
});
```

👉 `authMiddleware("admin")` returns a function that **remembers** the `roleRequired`. Perfect for reusable middleware.

---

## 🔹 Why Closures Are Important?

1. **Data privacy** → hide variables (like in Node services).
2. **Callbacks & async code** → closures capture variables in timers, promises, event handlers.
3. **React state management** → closures ensure state updates correctly.
4. **Functional programming** → compose, curry, and build higher-order utilities.

---

✨ In short:
Closures let functions **remember and use values outside their own scope**, which powers many real-world patterns in both **React (state, hooks, event handlers)** and **Node.js (middleware, services, async code)**.
