//skipList.js


//an implementation of a simple skip list (a skip list is a "probabilistic" data structure 
//whose search, insert, and delete operations will run in O(log n) with high probability)

//this skip list implementation will have a default height, 
//which will represent the maximum number of levels that can be used
//each level is essentially a doubly linked list that acts like an express lane to the one below it

//when an item is inserted, it will be placed in the lowest level
//there is a 50% chance "coin flip" that it will be placed in the next level as well, 
//and the coin will keep being flipped until a "tails" is reached
//the ideal structure will look almost like a balanced binary search tree, 
//which will cause search, insert, and delete to have O(log n) runtimes


//node class to be used by the skip list
var ListNode = function(key, value) {
  this.key = key;
  this.value = value;
  
  this.above = null;
  this.left = null;
  this.right = null;
  this.below = null;  
};


//skip list class
var SkipList = function(height) {
  //height represents the maxmimum number of levels
  //it should not be less than 1
  this.height = (height === undefined || height === null || height <= 0) ? 1 : height;

  //init function performs the initial set up of the skip list
  this.init();
};

//helper functions

//function to put a negative infinity node for each level in the skip list
//the negative infinity nodes will make it easier to perform the insert/delete operations
SkipList.prototype.init = function() {
  //set the head of the skip list to a negative infinity node
  this.head = new ListNode(-Infinity, "Level " + this.height.toString() + ":");

  //place a negative infinity node to represent each level in the skip list
  //the negative infinity nodes will be placed vertically in the skip list
  var currNode = this.head;
  var prevNode = null;
  for(var i = 0; i < this.height - 1; ++i) //use height - 1 since the head represents a level 
  {
    currNode.above = prevNode;
    currNode.below = new ListNode(-Infinity, "Level " + (this.height - i - 1).toString() + ":");
   
    prevNode = currNode; 
    currNode = currNode.below;
  }
  currNode.above = prevNode; //need to set the above pointer for the final node
};

//function to find the predecessor of a node with the passed in key
SkipList.prototype.findNodePredecessor = function(key) {
  //start at the head
  var currNode = this.head;

  //keep going until the node is null
  while(currNode !== null)
  {
    //go right in the current level until key exceeds the next node's key
    while(currNode.right !== null && key >= currNode.right.key)
    {
      currNode = currNode.right;
    }

    //if the target has been found, return its predecessor 
    if(currNode.key === key)
      return currNode.left;

    //if we cannot go down anymore, return the current node,
    //which will be the predecessor of the new node that will be inserted
    if(currNode.below === null)
      return currNode;

    //go down
    currNode = currNode.below;
  }

  return currNode;
};

//function that returns the number of levels a node should be placed
SkipList.prototype.getNumLevels = function() {
  //a function that calculates the number of consecutive set bits in an integer starting from the end
  var getNumberOfConsecutiveSetBitsFromEnd = function(number) {
    var numBits = 0;

    //loop until a 0 bit is seen
    while((number & 1) === 1)
    {
      ++numBits;
      number >>= 1; //shift right
    }
    
    return numBits;
  };

  //get the highest possible number/integer using (this.height - 1) number of bits
  //use (height - 1) instead of height, because we want to have at least 1 level
  var maxNumber = Math.pow(2, this.height - 1) - 1;

  //generate a random number from 0 to maxNumber
  //note: depending on math.random precision, larger heights may not generate uniformly distributed random numbers
  var randomNumber = Math.floor(Math.random() * (maxNumber + 1));

  //get a random number from 0 to (this.height - 1) by counting the number of set bits from the end in the random number
  //essentially, we want to keep "flipping a coin" until we land on tails, with every head increasing the level (default level to 1)
  //however, we don't want to call math.random multiple times, so we can just call it once
  //then count the number of set bits from the end, since every bit has a 50% chance to be set
  return getNumberOfConsecutiveSetBitsFromEnd(randomNumber) + 1;
};

//primary functions

//function to insert a node or nodes with the given key and value
SkipList.prototype.insert = function(key, value) {

  if(key === undefined || key === null || key === -Infinity)
    return;

  //find the predecessor node of the given key
  //if the key already exists in the skip list, 
  //then the predecessor node is the node directly to the left of the first occurrence of the key
  //otherwise, it will be the node to the left of where the new node should be placed
  var currNode = this.findNodePredecessor(key);

  //if the key already exists in the skip list, then update the values for all the nodes with the key
  if(currNode.right !== null && currNode.right.key === key)
  {
    console.log("node(s) with key " + key + " already exist(s), updating value(s) for node(s)");

    currNode = currNode.right;

    while(currNode !== null)
    {
      currNode.value = value;
      currNode = currNode.below;
    }

    return;
  }

  //function to perform an insertion
  //it will rearrange the pointers of the nodes involved 
  //to make sure that every node is pointing to the correct one
  var performInsertion = function(node, prevNode) {
    var tempNode = node.right;

    //make the node point to a new right node
    node.right = new ListNode(key, value);
    node.right.left = node;

    //make the new right node point to the temp right node
    node.right.right = tempNode;
    if(tempNode !== null)
      tempNode.left = node.right;

    //make the new right node point to the previous below node
    node.right.below = prevNode;
    if(prevNode !== null)
      prevNode.above = node.right;   

    //return the new node
    return node.right;
  };  

  //get the number of levels that a node should be placed
  var numLevels = this.getNumLevels();

  console.log("inserting node with key " + key + " in " + numLevels + " level(s)");

  //insert the first node
  var newNode = performInsertion(currNode, null);

  //insert a node for each remaining level up to the selected amount
  var i = 1; //already performed an insert so start at 1
  while(currNode !== null && currNode !== this.head && i < numLevels)
  {
    //traverse the skip list by first checking if we can go up
    //and then moving to the left if we cannot
    if(currNode.above !== null)
    {
      currNode = currNode.above;
      newNode = performInsertion(currNode, newNode);
      ++i;
    }   
    else
    {
      currNode = currNode.left;
    }
  }

};

//function to delete a node with the given key
SkipList.prototype.delete = function(key) {

  if(key === undefined || key === null || key === -Infinity)
    return;

  //find the node with the given key
  var currNode = this.findNode(key);

  //if a node with the given key could be found
  //delete all nodes with the same key by traversing down
  while(currNode !== null)
  {
    currNode.left.right = currNode.right;

    if(currNode.right !== null)
      currNode.right.left = currNode.left;

    currNode = currNode.below;
  }

  //all nodes with given key will get garbage collected 
  //because nothing in the skip list is pointing to them now

};

//function to find a node with the given key
SkipList.prototype.findNode = function(key) {

  if(key === undefined || key === null || key === -Infinity)
    return null;

  //if the predecessor's right node's key is equal to the given key,
  //then the node with the given key exists and will be returned
  var tempNode = this.findNodePredecessor(key);
  return (tempNode !== null && tempNode.right !== null && tempNode.right.key === key) 
    ? tempNode.right : null;

};

//function to find the value of a given key
SkipList.prototype.find = function(key) {

  if(key === undefined || key === null || key === -Infinity)
    return null;

  //return the value of the found node if it is not null
  var tempNode = this.findNode(key);
  return (tempNode !== null) ? tempNode.value : null;

};

//function to print out the values of the nodes in the skip list
//note: the values of nodes with a matching key are not aligned in the ouput, 
//even though nodes with the same key are actually pointing to each other
SkipList.prototype.print = function() {

  var currNode = this.head;
  var tempNode = this.head; //used to keep track of the first node in each level
  var output;

  while(tempNode !== null)
  {
    output = "";
    currNode = tempNode; //set the current node to the first node in the level

    //keep traversing right until the end of the linked list is reached
    while(currNode.right !== null)
    {
      //append each value to the output string
      output += currNode.value + " ";

      currNode = currNode.right;
    }

    //append to the ouput string the value of the final node in the level
    //then print the output string
    output += currNode.value;
    console.log(output);

    //go down to the next level
    tempNode = tempNode.below;
  }

};



//test
//note: the values of nodes with a matching key are not aligned in the ouput, 
//even though nodes with the same key are actually pointing to each other

//create a skip list with a maximum of 6 levels
var s = new SkipList(6);

console.log("test insert:");
//s.print();
s.insert(5, 5);
//s.print();
s.insert(3, 3);
//s.print();
s.insert(7, 7);
//s.print();
s.insert(1, 1);
//s.print();
s.insert(4, 4);
//s.print();
s.insert(6, 6);
//s.print();
s.insert(2, 2);
//s.print();
s.insert(9, 9);
//s.print();
s.insert(8, 8);
s.print();

console.log("test insert update value:");
s.insert(5, 99); //should update values of nodes with key 5 to 99
s.print();

console.log("test find:");
console.log(s.find(3));
console.log(s.find(5));
console.log(s.find(7));
console.log(s.find(10)); //should print null since 10 isn't in skip list


console.log("test delete:");
s.delete(10); //shouldn't delete anything since 10 isn't in skip list
s.print();
s.delete(9);
s.print();
s.delete(3);
s.print();
s.delete(2);
s.print();
s.delete(5);
s.print();
s.delete(7);
s.print();
s.delete(1);
s.print();
s.delete(6);
s.print();
s.delete(8);
s.print();
s.delete(4);
s.print();





