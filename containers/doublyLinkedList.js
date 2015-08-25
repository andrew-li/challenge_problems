//doublyLinkedList.js


//simple implementation of doubly linked list to be used for other containers and problems


//node class to be used by the linked list
var ListNode = function(value) {
  this.value = value;
  this.prev = null;
  this.next = null;
};


//linked list class
var DoublyLinkedList = function() {
  this.head = null;
  this.tail = null;
};

//create a new node with value and insert in the front
DoublyLinkedList.prototype.pushFront = function(value) {
  if(this.head === null)
  {
    this.head = new ListNode(value);
    this.tail = this.head;
  }
  else
  {
    this.head.prev = new ListNode(value);
    this.head.prev.next = this.head;
    this.head = this.head.prev;
  }
};

//create a new node with value and insert in the back
DoublyLinkedList.prototype.pushBack = function(value) {
  if(this.head === null)
  {
    this.head = new ListNode(value);
    this.tail = this.head;
  }
  else
  {
    this.tail.next = new ListNode(value);
    this.tail.next.prev = this.tail;
    this.tail = this.tail.next;
  }
};

//remove node in front and return the value
DoublyLinkedList.prototype.popFront = function() {
  if(this.head === null)
    return null;  

  var tempValue = this.head.value;

  this.head = this.head.next;
  if(this.head === null)
  {
    this.tail = null;
  }
  else
  {
    this.head.prev = null;
  }

  //old head node will get garbage collected

  return tempValue;
};

//remove node in back and return the value
DoublyLinkedList.prototype.popBack = function() {
  if(this.tail === null)
    return null;  

  var tempValue = this.tail.value;

  this.tail = this.tail.prev;
  if(this.tail === null)
  {
    this.head = null;
  }
  else
  {
    this.tail.next = null;
  }

  //old tail node will get garbage collected

  return tempValue;
};

//find node with given value and return it
//only finds and returns the first occurrence of the value
DoublyLinkedList.prototype.find = function(value) {
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
DoublyLinkedList.prototype.print = function(value) {
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

DoublyLinkedList.prototype.moveToFront = function(node) {
  if(this.head === null || node === null || this.head === node)
    return;

  //if the node is the tail, then make the tail the prev node
  if(this.tail === node)
    this.tail = node.prev;

  //remove pointers to the node
  if(node.prev !== null)
    node.prev.next = node.next;
  if(node.next !== null)
    node.next.prev = node.prev;

  //make head point to node
  this.head.prev = node;

  //make node point to head and null
  node.prev = null;
  node.next = this.head;

  //make the head the node
  this.head = node;
};

DoublyLinkedList.prototype.moveToBack = function(node) {
  if(this.tail === null || node === null || this.tail === node)
    return;

  //if the node is the head, then make the head the next node
  if(this.head === node)
    this.head = node.next;  

  //remove pointers to the node
  if(node.prev !== null)
    node.prev.next = node.next;
  if(node.next !== null)
    node.next.prev = node.prev;

  //make tail point to node
  this.tail.next = node;

  //make node point to tail and null
  node.prev = this.tail;
  node.next = null;

  //make the tail the node
  this.tail = node;
};


//test

var ll = new DoublyLinkedList();

console.log("test print empty:")
ll.print(); //empty

console.log("test initial push back:")
ll.pushBack(7);
ll.print(); //7
console.log("head value: " + ll.head.value);
console.log("tail value: " + ll.tail.value);

console.log("test find on one element list");
console.log(ll.find(7));
console.log(ll.find(8)); //null

console.log("test pop front on one element list:")
console.log(ll.popFront());
ll.print(); //empty
console.log("head: " + ll.head); //null
console.log("tail: " + ll.tail); //null

console.log("test find on empty list");
console.log(ll.find(7)); //null

console.log("test initial push front:")
ll.pushFront(6); //6
ll.print();
console.log("head value: " + ll.head.value);
console.log("tail value: " + ll.tail.value);

console.log("test combination of push back and push front:")
ll.pushBack(5); //6 5
ll.pushFront(4); //4 6 5
ll.pushBack(2); //4 6 5 2
ll.pushFront(3); //3 4 6 5 2
ll.pushBack(5); //3 4 6 5 2 5
ll.pushFront(1); //1 3 4 6 5 2 5
ll.pushBack(8); //1 3 4 6 5 2 5 8
ll.pushFront(7); //7 1 3 4 6 5 2 5 8
ll.print();
console.log("head value: " + ll.head.value);
console.log("tail value: " + ll.tail.value);

console.log("test find:");
console.log(ll.find(7));
console.log(ll.find(3));
console.log(ll.find(5));
console.log(ll.find(8));
console.log(ll.find(10)); //null

console.log("test pop front:")
console.log(ll.popFront());
console.log(ll.popFront());
console.log(ll.popFront());
console.log(ll.popFront());
console.log(ll.popFront());
console.log(ll.popFront());
console.log(ll.popFront());
console.log(ll.popFront());
console.log(ll.popFront());
console.log(ll.popFront()); //shouldn't pop anything
ll.print(); //empty

ll.pushFront(6); //6

console.log("test move to front on one element list:")
ll.moveToFront(ll.find(6));
ll.print(); //6

console.log("test move to back on one element list:")
ll.moveToBack(ll.find(6));
ll.print(); //6

ll.pushBack(5); //6 5
ll.pushFront(4); //4 6 5
ll.pushBack(2); //4 6 5 2
ll.pushFront(3); //3 4 6 5 2
ll.pushBack(5); //3 4 6 5 2 5
ll.pushFront(1); //1 3 4 6 5 2 5
ll.pushBack(8); //1 3 4 6 5 2 5 8
ll.pushFront(7); //7 1 3 4 6 5 2 5 8

console.log("test move to front:")
ll.moveToFront(ll.find(7)); //7 1 3 4 6 5 2 5 8
ll.moveToFront(ll.find(1)); //1 7 3 4 6 5 2 5 8
ll.moveToFront(ll.find(3)); //3 1 7 4 6 5 2 5 8
ll.moveToFront(ll.find(4)); //4 3 1 7 6 5 2 5 8
ll.moveToFront(ll.find(7)); //7 4 3 1 6 5 2 5 8
ll.moveToFront(ll.find(8)); //8 7 4 3 1 6 5 2 5
ll.print();
console.log("head value: " + ll.head.value);
console.log("tail value: " + ll.tail.value);

console.log("test move to back:")
ll.moveToBack(ll.find(5)); //8 7 4 3 1 6 2 5 5
ll.moveToBack(ll.find(8)); //7 4 3 1 6 2 5 5 8
ll.moveToBack(ll.find(8)); //7 4 3 1 6 2 5 5 8
ll.moveToBack(ll.find(1)); //7 4 3 6 2 5 5 8 1
ll.moveToBack(ll.find(4)); //7 3 6 2 5 5 8 1 4
ll.moveToBack(ll.find(7)); //3 6 2 5 5 8 1 4 7
ll.moveToBack(ll.find(8)); //3 6 2 5 5 1 4 7 8
ll.print();
console.log("head value: " + ll.head.value);
console.log("tail value: " + ll.tail.value);

console.log("test pop back:")
console.log(ll.popBack());
console.log(ll.popBack());
console.log(ll.popBack());
console.log(ll.popBack());
console.log(ll.popBack());
console.log(ll.popBack());
console.log(ll.popBack());
console.log(ll.popBack());
console.log(ll.popBack());
console.log(ll.popBack()); //shouldn't pop anything
ll.print(); //empty
console.log("head: " + ll.head); //null
console.log("tail: " + ll.tail); //null


