//bellmanFord.js


//implementation of bellman-ford algorithm


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


//queue class
var Queue = function(){
  this.storage = new SinglyLinkedList();
  this.numItems = 0;
};

//enqueue into queue
Queue.prototype.enqueue = function(value){
  this.storage.pushBack(value);
  ++this.numItems;
};

//dequeue from queue
Queue.prototype.dequeue = function(){
  if(this.numItems >= 1)
  {
    var temp = this.storage.pop();
    --this.numItems;
    return temp;
  }

  return null;
};

//get the size of the queue
Queue.prototype.size = function(){
  return this.numItems;
};


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//bellman-ford algorithm for finding the shortest path from source to all nodes in the graph
//bellman-ford algorithm can handle negative weight edges and also detect negative cycles in the graph
//  the function returns the distances and previous node keys from the source node to every node contained in an object
//  the distance will be infinity if the node in the graph cannot be reached
Graph.prototype.bellmanFordAlgorithm = function(srcNode) {
  var distances = {}; //an object that holds the smallest known distance to a node from the src
  var prevNodeKeys = {}; //an object used to help construct the shortest path from src to dest


  //iterate through every node in the graph
  //set the distances of non source nodes to infinity and set the distance of the source node to 0
  //also update the prevNodeKeys object for the source node  
  //count the number of nodes in the graph
  var nodeKey;
  var numNodes = 0;
  for(nodeKey in this.adjList)
  {
    if(nodeKey !== srcNode.key)
    {
      distances[nodeKey] = Infinity;
    }
    else
    {
      distances[nodeKey] = 0;
      prevNodeKeys[nodeKey] = undefined;
    }
    ++numNodes;
  }

  var q = new Queue(); //queue used to help with traversal
  var neighborNodeKey; 
  var newDistance;
  var visited;
  for(var i = 0; i < numNodes - 1; ++i) //repeat the following steps (numNodes - 1) number of times
  {
    //traverse the graph
    q.enqueue(srcNode.key); //start at the source node
    visited = {}; //object to keep track of visited nodes for each iteration
    while(q.size() > 0) //keep repeating until queue is empty
    {
      nodeKey = q.dequeue(); //dequeue the node key from the queue
      for(neighborNodeKey in this.adjList[nodeKey].dest) //look at each neighbor of the current node
      {
        //update distances
        //get the distance to the current neighbor node using the distance so far to the current node        
        newDistance = distances[nodeKey] + this.adjList[nodeKey].dest[neighborNodeKey];
        //check if the new distance is lower than the distance in the distance object 
        if(newDistance < distances[neighborNodeKey])
        {
          //if the new distance is lower than the distance in the distance object,
          //then update the distance in the distance object for the curent neighbor node with the new distance
          //and update the curent neighbor node's predecessor with the current node       
          distances[neighborNodeKey] = newDistance;
          prevNodeKeys[neighborNodeKey] = nodeKey;
        }

        //keep queueing until the graph is fully traversed
        if(visited.hasOwnProperty(neighborNodeKey) === false)
        {
          q.enqueue(neighborNodeKey);
          visited[neighborNodeKey] = nodeKey;
        }
      }
    }
  }

  //perform one final traversal to detect negative-weight cycles
  q.enqueue(srcNode.key);
  visited = {};
  while(q.size() > 0)
  {
    nodeKey = q.dequeue();
    for(neighborNodeKey in this.adjList[nodeKey].dest)
    {
      //update distances
      newDistance = distances[nodeKey] + this.adjList[nodeKey].dest[neighborNodeKey];
      if(newDistance < distances[neighborNodeKey])
      {
        return "graph contains a negative-weight cycle";
      }

      //keep queueing until the graph is fully traversed
      if(visited.hasOwnProperty(neighborNodeKey) === false)
      {
        q.enqueue(neighborNodeKey);
        visited[neighborNodeKey] = nodeKey;
      }
    }
  }
  
  //return object containing distances to every node and the predecessor to each node
  return {distances : distances, prevNodeKeys : prevNodeKeys};
};


//tests:


var a = new AdjListGraphNode("a");
var b = new AdjListGraphNode("b");
var c = new AdjListGraphNode("c");
var d = new AdjListGraphNode("d");
var e = new AdjListGraphNode("e");

var g = new Graph();

g.addNode(a);
g.addNode(b);
g.addNode(c);
g.addNode(d);
g.addNode(e);

g.addDirectedEdge(a, b, -3);
g.addDirectedEdge(b, c, 1);
g.addDirectedEdge(c, d, 1);
g.addDirectedEdge(d, e, 1);

console.log("test:");
console.log(g.bellmanFordAlgorithm(a));


var a = new AdjListGraphNode("a");
var b = new AdjListGraphNode("b");
var c = new AdjListGraphNode("c");
var d = new AdjListGraphNode("d");
var e = new AdjListGraphNode("e");

var g = new Graph();

g.addNode(a);
g.addNode(b);
g.addNode(c);
g.addNode(d);
g.addNode(e);

g.addDirectedEdge(a, b, -1);
g.addDirectedEdge(b, e, 2);
g.addDirectedEdge(e, d, -3);
g.addDirectedEdge(d, c, 5);
g.addDirectedEdge(a, c, 4);
g.addDirectedEdge(b, c, 3);
g.addDirectedEdge(b, d, 2);
g.addDirectedEdge(d, b, 1);

console.log("test:");
console.log(g.bellmanFordAlgorithm(a));


var a = new AdjListGraphNode("a");
var b = new AdjListGraphNode("b");
var c = new AdjListGraphNode("c");
var d = new AdjListGraphNode("d");
var e = new AdjListGraphNode("e");

var g = new Graph();

g.addNode(a);
g.addNode(b);
g.addNode(c);
g.addNode(d);
g.addNode(e);

g.addBidirectionalEdge(a, b, 2);
g.addBidirectionalEdge(b, c, 1);
g.addBidirectionalEdge(c, d, -4);
g.addBidirectionalEdge(d, b, 2);
g.addBidirectionalEdge(c, e, 3);

console.log("test:");
console.log(g.bellmanFordAlgorithm(a)); //graph contains negative weight cycle



