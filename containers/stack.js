//stack.js


//implementation of a stack using linked list


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//helper classes...TO-DO: refactor code later to work with node and use import


//node class to be used by the linked list
var ListNode = function(value) {
  this.value = value;
  this.next = null;
};


//linked list class
var SinglyLinkedList = function() {
  this.head = null;
  this.tail = null;
};

//create a new node with value and insert in the front
SinglyLinkedList.prototype.pushFront = function(value) {
  if(this.head === null)
  {
    this.head = new ListNode(value);
    this.tail = this.head;
  }
  else
  {
    var newNode = new ListNode(value);
    newNode.next = this.head;
    this.head = newNode;
  }
};

//create a new node with value and insert in the back
SinglyLinkedList.prototype.pushBack = function(value) {
  if(this.head === null)
  {
    this.head = new ListNode(value);
    this.tail = this.head;
  }
  else
  {
    this.tail.next = new ListNode(value);
    this.tail = this.tail.next;
  }
};

//remove node in front and return the value
SinglyLinkedList.prototype.pop = function() {
  if(this.head === null)
    return null;  

  var tempValue = this.head.value;

  this.head = this.head.next;
  if(this.head === null)
    this.tail = null;

  //old head node will get garbage collected

  return tempValue;
};

//find node with given value and return it
//only finds and returns the first occurrence of the value
SinglyLinkedList.prototype.find = function(value) {
  if(this.head === null)
    return null;

  var tempNode = this.head;
  while(tempNode !== null)
  {
    if(tempNode.value === value)
      return tempNode;

    tempNode = tempNode.next;
  }
  
  return null;
};

//print the values of the nodes in the linked list
SinglyLinkedList.prototype.print = function(value) {
  if(this.head === null)
  {
    console.log("List is empty!");
    return;
  }

  var tempNode = this.head;
  var output = "";
  while(tempNode !== null)
  {
    output += tempNode.value.toString() + " ";
    tempNode = tempNode.next;
  }
  
  console.log(output);
};


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//stack class
var Stack = function() {
  this.storage = new SinglyLinkedList();
  this.numItems = 0;
};

//push into stack
Stack.prototype.push = function(value) {
  this.storage.pushFront(value);
  ++this.numItems;
};

//pop from stack
Stack.prototype.pop = function() {
  if(this.numItems >= 1)
  {
    var temp = this.storage.pop();
    --this.numItems;
    return temp;
  }

  return null;
};

//get the size of the stack
Stack.prototype.size = function() {
  return this.numItems;
};


//test
var s = new Stack();

console.log("push:");
console.log("size: " + s.size());
s.push(1);
console.log("size: " + s.size());
s.push(2);
console.log("size: " + s.size());
s.push(3);
console.log("size: " + s.size());
s.push(4);
console.log("size: " + s.size());
s.push(5);
console.log("size: " + s.size());
s.push(6);
console.log("size: " + s.size());

console.log("pop:");
console.log(s.pop());
console.log("size: " + s.size());
console.log(s.pop());
console.log("size: " + s.size());
console.log(s.pop());
console.log("size: " + s.size());
console.log(s.pop());
console.log("size: " + s.size());
console.log(s.pop());
console.log("size: " + s.size());
console.log(s.pop());
console.log("size: " + s.size());
console.log(s.pop());
console.log("size: " + s.size());


