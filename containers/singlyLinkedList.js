//singlyLinkedList.js


//simple implementation of singly linked list to be used for other containers and problems


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


//test

var ll = new SinglyLinkedList();

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

console.log("test pop on one element list:")
console.log(ll.pop());
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

console.log("test pop:")
console.log(ll.pop());
console.log(ll.pop());
console.log(ll.pop());
console.log(ll.pop());
console.log(ll.pop());
console.log(ll.pop());
console.log(ll.pop());
console.log(ll.pop());
console.log(ll.pop());
console.log(ll.pop()); //shouldn't pop anything
ll.print(); //empty


