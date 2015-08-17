//red-black tree
//based on pseudocode and description of red-black tree on wikipedia



//"const" variables

//colors for the tree nodes
var RED = "red";
var BLACK = "black";



//tree node class to be used in the red-black tree
var TreeNode = function(key, value) {
  this.right = null;
  this.left = null;
  this.parent = null;
  this.key = key;
  this.value = value;
  this.color = RED; //default a node to the color red
};


//tree node functions to be used by the red-black tree

//function to return the grandparent of the node
TreeNode.prototype.getGrandParent = function() {
  return (this.parent !== null) ? this.parent.parent : null;
};

//function to return the uncle of the node
TreeNode.prototype.getUncle = function() {
  var grandParent = this.getGrandParent();

  if(grandParent !== null) {
    return (grandParent.left === this.parent) ? grandParent.right : grandParent.left;
  }

  return null;
};

//function to get the sibling of the node
TreeNode.prototype.getSibling = function() {
  if(this.parent === null)
    return null;

  return (this === this.parent.left) ? this.parent.right : this.parent.left;
};

//function to get the inorder successor of the node
TreeNode.prototype.getInorderSuccessor = function() {
  if(this === null || this.right === null)
    return null;

  var inorderSuccessor = this.right;

  while(inorderSuccessor.left !== null && inorderSuccessor.left.isNullLeaf() !== true) {
    inorderSuccessor = inorderSuccessor.left;
  }

  return inorderSuccessor;
};

//function to check if the node is a null leaf 
//all nodes in a binary search tree with null children
//will instead have null leaf children in a red-black tree
TreeNode.prototype.isNullLeaf = function() {
  return this.parent !== null && this.left === null && this.right === null 
    && this.key === null && this.color === BLACK;
};

//function to append two null leaves to the node
TreeNode.prototype.appendNullLeaves = function() {
  if(this.left === null) {
    this.left = new TreeNode(null, null);
    this.left.color = BLACK;
    this.left.parent = this;
  }
  if(this.right === null) {
    this.right = new TreeNode(null, null);
    this.right.color = BLACK;
    this.right.parent = this;   
  }
};

//function to the print the key, value, and color of the node
TreeNode.prototype.print = function() {
  console.log("[k: " + this.key + ", v: " + this.value + " (" + this.color.charAt(0) + ")]");
};



//red-black tree class
var RedBlackTree = function() {
  this.root = null;
};


//red-black tree helper functions

//function to perform a left rotation on the given node
RedBlackTree.prototype.rotateLeft = function(node) {
  if(node === null || node.isNullLeaf() === true)
    return;

  var temp = node.right;

  if(this.root === node) {
    this.root = temp;
  }  
  else {
    if(node === node.parent.right) {
      node.parent.right = temp;
    }
    else {
      node.parent.left = temp;
    }
  }
  temp.parent = node.parent;

  
  node.right = temp.left;
  temp.left.parent = node;
  
  temp.left = node;
  node.parent = temp;
  
};

//function to perform a right rotation on the given node
RedBlackTree.prototype.rotateRight = function(node) {
  if(node === null || node.isNullLeaf() === true)
    return;

  var temp = node.left;

  if(this.root === node) {
    this.root = temp;
  }  
  else {
    if(node === node.parent.right) {
      node.parent.right = temp;
    }
    else {
      node.parent.left = temp;
    }
  }
  temp.parent = node.parent;  
  
  node.left = temp.right;
  temp.right.parent = node;
  
  temp.right = node;
  node.parent = temp;
  
};

//the following functions help perform an insertion
//each function handles a different insert case
//the functions are based off the pseudocode on wikipedia 
RedBlackTree.prototype.insertCase1 = function(node) {
  if(node.parent === null) {
    node.color = BLACK;
  }
  else {
    this.insertCase2(node);
  }
};

RedBlackTree.prototype.insertCase2 = function(node) {
  if(node.parent.color !== BLACK) {
    this.insertCase3(node);
  }
};

RedBlackTree.prototype.insertCase3 = function(node) {
  var uncle = node.getUncle();

  if(uncle !== null && uncle.color === RED) {
    node.parent.color = BLACK;
    uncle.color = BLACK;
    var grandParent = node.getGrandParent();
    grandParent.color = RED;
    this.insertCase1(grandParent);
  }
  else {
    this.insertCase4(node);
  }
};

RedBlackTree.prototype.insertCase4 = function(node) {
  var grandParent = node.getGrandParent();

  if(node === node.parent.right && node.parent === grandParent.left) {
    this.rotateLeft(node.parent);
    node = node.left;
  }
  else if(node === node.parent.left && node.parent === grandParent.right) {
    this.rotateRight(node.parent);
    node = node.right;
  }

  this.insertCase5(node);
};

RedBlackTree.prototype.insertCase5 = function(node) {
  var grandParent = node.getGrandParent();

  node.parent.color = BLACK;
  grandParent.color = RED;
  if(node === node.parent.left) {
    this.rotateRight(grandParent);
  }
  else {
    this.rotateLeft(grandParent);
  }
};

//function to replace a node in the tree with its child
RedBlackTree.prototype.replaceNode = function(node, child) {
  if(this.root === node) {
    this.root = child;
  }  
  else {
    if(node === node.parent.right) {
      node.parent.right = child;
    }
    else {
      node.parent.left = child;
    }
  }
  child.parent = node.parent;
};

//the following functions help perform a deletion
//each function handles a different deletion case
//the functions are based off the pseudocode on wikipedia 
RedBlackTree.prototype.deleteNode = function(node) {
  if(node === null || node.isNullLeaf() === true
    || node.left.isNullLeaf() !== true && node.right.isNullLeaf() !== true) //only allow deletion of node with one or no non null children
    return;

  var child = (node.right.isNullLeaf() === true) ? node.left : node.right;
  this.replaceNode(node, child);

  if(node.color === BLACK) {
    if(child.color === RED)
      child.color = BLACK;
    else
      this.deleteCase1(child); //balance the tree
  }

  //node will get garbage collected
};

RedBlackTree.prototype.deleteCase1 = function(node) {
  if(node.parent !== null)
    this.deleteCase2(node);
};

RedBlackTree.prototype.deleteCase2 = function(node) {
  var sibling = node.getSibling();

  if(sibling.color === RED) {
    node.parent.color = RED;
    sibling.color = BLACK;

    if(node === node.parent.left)
      this.rotateLeft(node.parent);
    else
      this.rotateRight(node.parent); 
  }

  this.deleteCase3(node);
};

RedBlackTree.prototype.deleteCase3 = function(node) {
  var sibling = node.getSibling();

  if(node.parent.color === BLACK
    && sibling.color === BLACK
    && sibling.left.color === BLACK
    && sibling.right.color === BLACK) {
    sibling.color = RED;
    this.deleteCase1(node.parent);
  }
  else {
    this.deleteCase4(node);
  }
};

RedBlackTree.prototype.deleteCase4 = function(node) {
  var sibling = node.getSibling();

  if(node.parent.color === RED
    && sibling.color === BLACK
    && sibling.left.color === BLACK
    && sibling.right.color === BLACK) {
    sibling.color = RED;
    node.parent.color = BLACK;
  }
  else {
    this.deleteCase5(node);
  }
};

RedBlackTree.prototype.deleteCase5 = function(node) {
  var sibling = node.getSibling();

  if(sibling.color === BLACK) {
    if(node === node.parent.left
      && sibling.right.color === BLACK
      && sibling.left.color === RED) {
      sibling.color = RED;
      sibling.left.color = BLACK;
      this.rotateRight(sibling);
    }
    else if(node === node.parent.right
      && sibling.left.color === BLACK
      && sibling.right.color === RED) {
      sibling.color = RED;
      sibling.right.color = BLACK;
      this.rotateLeft(sibling);
    }
  }

  this.deleteCase6(node);
};

RedBlackTree.prototype.deleteCase6 = function(node) {
  var sibling = node.getSibling();

  sibling.color = node.parent.color;
  node.parent.color = BLACK;

  if(node === node.parent.left) {
    sibling.right.color = BLACK;
    this.rotateLeft(node.parent);
  }
  else {
    sibling.left.color = BLACK;
    this.rotateRight(node.parent);
  }
};


//red-black tree primary functions

//function to insert a node into the tree
RedBlackTree.prototype.insert = function(key, value) {
  if(key === undefined || key === null)   
    return;

  var tree = this; //variable to hold the current context object, which is lost in the inner function

  var insertRecursive = function(node) {
    if(node === null) { //this is for when the tree is empty
      node = new TreeNode(key, value); //default red color for root will get set to black in balance function
      node.appendNullLeaves();
      tree.root = node;
      tree.insertCase1(node); //balance the tree
    }
    else if(node.isNullLeaf() === true) { //no key found, insert new node
      //turn the null leaf into a tree leaf with the passed in key and value and default red color
      node.key = key;
      node.value = value;
      node.color = RED;
      node.appendNullLeaves();
      tree.insertCase1(node); //balance the tree
    }
    else if(key < node.key) { //key in left side of tree
      insertRecursive(node.left);
    }
    else if(key > node.key) { //key in right side of tree
      insertRecursive(node.right);
    }
    else { //key found, update value if key already in tree
      node.value = value;
    }
  };

  insertRecursive(tree.root);
};

//function to delete a node from the tree
RedBlackTree.prototype.delete = function(key) {
  var tree = this; //variable to hold the current context object, which is lost in the inner function

  var deleteRecursive = function(node, k) {
    if(node === null || node.isNullLeaf() === true) { //no key found
      return;
    }
    else if(k < node.key) { //key in left side of tree
      deleteRecursive(node.left, k);
    }
    else if(k > node.key) { //key in right side of tree
      deleteRecursive(node.right, k);
    }
    else { //key has been found
      //node has at least one null leaf, which means that it has one or no non null children
      if(node.left === null || node.left.isNullLeaf() === true
        || node.right === null || node.right.isNullLeaf() === true) {
        tree.deleteNode(node); //handle deletion of node
      }
      //node has no null leaves, which means that it has two non null children
      else {
        //copy key and value of in order successor into the current node
        //then recurse to delete the appropriate node
        var inorderSuccessor = node.getInorderSuccessor();
        node.key = inorderSuccessor.key;
        node.value = inorderSuccessor.value;
        deleteRecursive(inorderSuccessor, inorderSuccessor.key);
      }
    }
  };

  deleteRecursive(tree.root, key);

  //if the only remaining node is a null leaf, then that means that the tree is empty
  //and the root should be set to null
  if(tree.root.key === null && tree.root.left === null && tree.root.right === null)
    tree.root = null;
};

//function to find a node in the tree and return the node object
RedBlackTree.prototype.find = function(key) {
  if(this.root === null) {
    return null;
  }

  var findRecursive = function(node) {

    if(node === null || node.isNullLeaf() === true) { //no key found
      return null;
    }
    else if(key < node.key) { //key in left side of tree
      return findRecursive(node.left);
    }
    else if(key > node.key) { //key in right side of tree
      return findRecursive(node.right);
    }

    //key has been found, return the node
    return node;
  };

  return findRecursive(this.root);
};

//function to find a node in the tree and return the node's value
RedBlackTree.prototype.findValue = function(key) {
  var node = this.find(key);

  return (node !== null) ? node.value : null;
};

//function to see if a node with the given key exists in the tree
RedBlackTree.prototype.contains = function(key) {
  return (this.find(key) !== null) ? true : false;
};

//function to perform a preorder print of the tree
RedBlackTree.prototype.print = function() {
  var printRecursive = function(node) {
    if(node === null || node.isNullLeaf() === true) //don't print anything if tree is empty and don't print null leaves
      return;

    node.print();
    printRecursive(node.left);
    printRecursive(node.right);
  };

  printRecursive(this.root);
};



//the following tests will form trees that meet the following constraints of a red-black tree:
//-a node is either black or red
//-the root is black
//-all sentinel nodes/null leaves are black
//-every red node must have two black child nodes (null leaves count as black nodes)
//-every path from a given node to a sentinel node/null leaf must contain the same number of black nodes


//the following test cases will hit every insert case on the way to forming the final tree formation

//final tree formation has 3 black nodes (inc root) from root to every sentinel leaf
console.log("insert test 1:");
var rbt = new RedBlackTree();
rbt.insert(1, 1);
rbt.insert(6, 6);
rbt.insert(8, 8);
rbt.insert(11, 11);
rbt.insert(13, 13);
rbt.insert(15, 15);
rbt.insert(17, 17);
rbt.insert(22, 22);
rbt.insert(25, 25);
rbt.insert(27, 27);
rbt.print();

//final tree formation has 3 black nodes (inc root) from root to every sentinel leaf
console.log("insert test 2:");
var rbt = new RedBlackTree();
rbt.insert(27, 27);
rbt.insert(25, 25);
rbt.insert(22, 22);
rbt.insert(17, 17);
rbt.insert(15, 15);
rbt.insert(13, 13);
rbt.insert(11, 11);
rbt.insert(8, 8);
rbt.insert(6, 6);
rbt.insert(1, 1);
rbt.print();

//final tree formation has 2 black nodes (inc root) from root to every sentinel leaf
console.log("insert test 3:");
var rbt = new RedBlackTree();
rbt.insert(17, 17);
rbt.insert(25, 25);
rbt.insert(11, 11);
rbt.insert(22, 22);
rbt.insert(6, 6);
rbt.insert(1, 1);
rbt.insert(27, 27);
rbt.insert(15, 15);
rbt.insert(8, 8);
rbt.insert(13, 13);
rbt.print();

//final tree formation has 2 black nodes (inc root) from root to every sentinel leaf
console.log("insert test 4:");
var rbt = new RedBlackTree();
rbt.insert(25, 25);
rbt.insert(17, 17);
rbt.insert(8, 8);
rbt.insert(13, 13);
rbt.insert(1, 1);
rbt.insert(11, 11);
rbt.insert(22, 22);
rbt.insert(27, 27);
rbt.insert(6, 6);
rbt.insert(15, 15);
rbt.print();


//the following test cases will hit every delete case on the way to forming an empty tree

console.log("delete test 1:");
var rbt = new RedBlackTree();
rbt.insert(4, 4);
rbt.insert(3, 3);
rbt.insert(6, 6);
rbt.insert(5, 5);
rbt.insert(7, 7);
rbt.insert(8, 8);
rbt.print();
console.log("starting deletion");
rbt.delete(4);
rbt.print();
console.log("~~~~~~~~~~");
rbt.delete(8);
rbt.print();
console.log("~~~~~~~~~~");
rbt.delete(3);
rbt.print();
console.log("~~~~~~~~~~");
rbt.delete(6);
rbt.print();
console.log("~~~~~~~~~~");
rbt.delete(5);
rbt.print();
console.log("~~~~~~~~~~");
rbt.delete(7);
rbt.print();
console.log(rbt.root);

console.log("delete test 2:");
var rbt = new RedBlackTree();
rbt.insert(4, 4);
rbt.insert(3, 3);
rbt.insert(6, 6);
rbt.insert(5, 5);
rbt.insert(7, 7);
rbt.insert(8, 8);
rbt.print();
console.log("starting deletion");
rbt.delete(5);
rbt.print();
console.log("~~~~~~~~~~");
rbt.delete(4);
rbt.print();
console.log("~~~~~~~~~~");
rbt.delete(8);
rbt.print();
console.log("~~~~~~~~~~");
rbt.delete(3);
rbt.print();
console.log("~~~~~~~~~~");
rbt.delete(6);
rbt.print();
console.log("~~~~~~~~~~");
rbt.delete(7);
rbt.print();
console.log(rbt.root);


//test other functions

var rbt = new RedBlackTree();
rbt.insert(1, 1);
rbt.insert(6, 6);
rbt.insert(8, 8);
rbt.insert(11, 11);
rbt.insert(13, 13);
rbt.insert(15, 15);
rbt.insert(17, 17);
rbt.insert(22, 22);
rbt.insert(25, 25);
rbt.insert(27, 27);
rbt.print();

//should update values
console.log("update test:");
rbt.insert(1, 99);
rbt.insert(27, 100);
rbt.print();

//should not delete a node that doesn't exist
console.log("don't delete test:");
rbt.delete(0);
rbt.delete(14);
rbt.delete(28);
rbt.print();

//should find/not find nodes
console.log("find node test:");
console.log(rbt.find(1));
console.log(rbt.find(15));
console.log(rbt.find(27));
console.log(rbt.find(0));
console.log(rbt.find(30));

//should find/not find values
console.log("find value test:");
console.log(rbt.findValue(1));
console.log(rbt.findValue(15));
console.log(rbt.findValue(27));
console.log(rbt.findValue(0));
console.log(rbt.findValue(30));

//should check if key is in tree
console.log("contains test:");
console.log(rbt.contains(1));
console.log(rbt.contains(15));
console.log(rbt.contains(27));
console.log(rbt.contains(0));
console.log(rbt.contains(30));





