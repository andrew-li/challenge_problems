//dfs.js


//implementation of depth-first search on a graph


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//helper classes...TO-DO: refactor code later to work with node and use import


var AdjListGraphNode = function(key, value) {
  this.key = key || "";
  this.value = value || this.key;
  this.dest = {};
};

var Graph = function() {
  this.adjList = {};
};

Graph.prototype.addNode = function(node) {
  this.adjList[node.key] = node;
};

Graph.prototype.contains = function(node) {
  return this.adjList.hasOwnProperty(node.key);
};

Graph.prototype.removeNode = function(node) {
  delete this.adjList[node.key];
};

Graph.prototype.hasBidirectionalEdge = function(srcNode, destNode){
  return this.adjList[srcNode.key].dest.hasOwnProperty(destNode.key)
    && this.adjList[destNode.key].dest.hasOwnProperty(srcNode.key);
};

Graph.prototype.addBidirectionalEdge = function(srcNode, destNode, weight){
  this.adjList[srcNode.key].dest[destNode.key] = weight;
  this.adjList[destNode.key].dest[srcNode.key] = weight;
};

Graph.prototype.removeBidirectionalEdge = function(srcNode, destNode){
  delete this.adjList[srcNode.key].dest[destNode.key];
  delete this.adjList[destNode.key].dest[srcNode.key];
};

Graph.prototype.hasDirectedEdge = function(srcNode, destNode) {
  return this.adjList[srcNode.key].dest.hasOwnProperty(destNode.key);
};

Graph.prototype.addDirectedEdge = function(srcNode, destNode, weight) {
  this.adjList[srcNode.key].dest[destNode.key] = weight;
};

Graph.prototype.removeDirectedEdge = function(srcNode, destNode) {
  delete this.adjList[srcNode.key].dest[destNode.key];
};


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


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//depth-first search
//returns a path to the destination node if it can be found
//otherwise returns an object containing all nodes that can be reached and the predecessor of each node
Graph.prototype.depthFirstSearch = function(srcNode, destNode) {
  var prevNodeKeys = {}; //will contain information to create a path and also keep track of visited nodes

  var s = new Stack(); //stack used to help with traversal

  s.push(srcNode.key); //push the source node's key into the stack

  prevNodeKeys[srcNode.key] = undefined; //set the predecessor of the source node to undefined

  //keep popping from the stack until it is empty or the destination node is found
  var nodeKey;
  var neighborNodeKey; 
  while(s.size() > 0)
  {
    //pop the node key from the stack
    nodeKey = s.pop();

    //construct and return the path if the destination node has been found 
    if(destNode !== undefined && nodeKey === destNode.key)
    {
      var path = [];  
      var pathNodeKey = prevNodeKeys[destNode.key];
      while(pathNodeKey !== undefined)
      {
        path.push(this.adjList[pathNodeKey]);
        pathNodeKey = prevNodeKeys[pathNodeKey];
      }
      path.reverse();
      return path;
    }

    //look at each neighbor of the current node
    for(neighborNodeKey in this.adjList[nodeKey].dest)
    {
      //if the neighbor node hasn't been visited yet
      //push its key into the stack and update its predecessor with the current node
      if(prevNodeKeys.hasOwnProperty(neighborNodeKey) === false)
      {
        s.push(neighborNodeKey);
        prevNodeKeys[neighborNodeKey] = nodeKey;
      }
    }
  }

  //return the prevNodeKeys object if the destination cannot be reached or found
  return prevNodeKeys;
};


//tests:


//perform dfs on the following graph
//the graph is the wikipedia example on the breadth-first search page
//like bfs, dfs traverses the entire graph until the destination is found, but the travesal order is different
//dfs goes down one path until the path can't be traversed anymore (no more unvisited neighbors) before moving on to the next path

var frankfurt = new AdjListGraphNode("frankfurt");
var mannheim = new AdjListGraphNode("mannheim");
var karlsruhe = new AdjListGraphNode("karlsruhe");
var augsburg = new AdjListGraphNode("augsburg");
var munchen = new AdjListGraphNode("munchen");
var kassel = new AdjListGraphNode("kassel");
var wurzburg = new AdjListGraphNode("wurzburg");
var stuttgart = new AdjListGraphNode("stuttgart");
var erfurt = new AdjListGraphNode("erfurt");
var nurnberg = new AdjListGraphNode("nurnberg");
var unconnectedCity = new AdjListGraphNode("unconnectedCity");

var g = new Graph();

g.addNode(frankfurt);
g.addNode(mannheim);
g.addNode(karlsruhe);
g.addNode(augsburg);
g.addNode(munchen);
g.addNode(kassel);
g.addNode(wurzburg);
g.addNode(stuttgart);
g.addNode(erfurt);
g.addNode(nurnberg);
g.addNode(unconnectedCity);

g.addBidirectionalEdge(frankfurt, mannheim, 85);
g.addBidirectionalEdge(mannheim, karlsruhe, 80);
g.addBidirectionalEdge(karlsruhe, augsburg, 250);
g.addBidirectionalEdge(augsburg, munchen, 84);
g.addBidirectionalEdge(munchen, kassel, 502);
g.addBidirectionalEdge(kassel, frankfurt, 173);
g.addBidirectionalEdge(frankfurt, wurzburg, 217);
g.addBidirectionalEdge(wurzburg, erfurt, 186);
g.addBidirectionalEdge(wurzburg, nurnberg, 103);
g.addBidirectionalEdge(nurnberg, stuttgart, 183);
g.addBidirectionalEdge(nurnberg, munchen, 167);

//dfs should return a path if the source can reach the destination

console.log("test:");
console.log(g.depthFirstSearch(frankfurt)); //no destination, so will show all reachable nodes

console.log("test:");
console.log(g.depthFirstSearch(frankfurt, unconnectedCity)); //destination can't be reached, so will show all reachable nodes

console.log("test:");
console.log(g.depthFirstSearch(frankfurt, frankfurt)); //path will be empty since src and dest are the same

console.log("test:");
console.log(g.depthFirstSearch(frankfurt, mannheim));

console.log("test:");
console.log(g.depthFirstSearch(frankfurt, stuttgart));

console.log("test:");
console.log(g.depthFirstSearch(frankfurt, karlsruhe));



