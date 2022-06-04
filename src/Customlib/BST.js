class Node {
  constructor(data) {
    this.left = null;
    this.right = null;
    this.data = data;
  }
}

export const insert = (node, data) => {
  if (node == null) {
    return new Node(data);
  } else {
    if (data <= node.data) {
      node.left = insert(node.left, data);
    } else {
      node.right = insert(node.right, data);
    }
    return node;
  }
};

export const min = (node) => {
  if (node === null) return null;
  let minValue = node.data;
  while (node.left !== null) {
    node = node.left;
    minValue = node.data;
  }
  return minValue;
};

export const count = (node) => {
  if (node == null) return 0;
  return count(node.left) + count(node.right) + 1;
};

export const inOrder = (node) => {
  if (node == null) return null;
  inOrder(node.left);
  console.log(node.data);
  inOrder(node.right);
};

export const preOrder = (node) => {
  if (node == null) return null;
  console.log(node.data);
  preOrder(node.left);
  preOrder(node.right);
};

export const postOrder = (node) => {
  if (node == null) return null;
  postOrder(node.left);
  postOrder(node.right);
  console.log(node.data);
};

export default Node;
