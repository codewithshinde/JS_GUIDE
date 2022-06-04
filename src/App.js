import "./styles.css";
import { count, inOrder, insert, min } from "./Customlib/BST";

export default function App() {
  const executeNodeCase = () => {
    let nodeData = [4, 2, 1, 3, 6, 5];
    let root = null;
    nodeData.forEach((key) => {
      root = insert(root, key);
    });
    return "Minimum value in BST is " + inOrder(root);
  };

  return (
    <div className="App">
      <h1>{executeNodeCase()}</h1>
    </div>
  );
}
