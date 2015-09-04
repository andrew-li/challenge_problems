//prims.js


//implementation of prim's algorithm


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


//helper function to swap two elements in an array
//will also work on objects with keys i and j
var swap = function(arr, i, j) {
  var temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

//priority queue class
var PriorityQueue = function(comparator) {
  this.heap = []; //array that will hold the elements in the priority queue
  this.map = {}; //map to store the indices for each key; this is needed for update key function to remain O(log n)
  this.comparator = comparator; //function that allows for user-defined comparisons
  
  //default to minimum priority queue (smaller values will have higher priority)
  if(typeof(this.comparator) !== "function")
  {
    this.comparator = function(a, b) {
      if(a < b)
      {
        return -1;
      }

      if(a > b)
      {
        return 1;
      }

      return 0;
    };
  }
};

//function that maintains heap structure integrity by moving higher priority elements up
PriorityQueue.prototype.heapifyUp = function(index) {
  //start from the element at the given index
  //keep swapping the element with its parent if it has higher priority than its parent
  while(Math.floor(index / 2) > 0)    
  {
    if(this.comparator(this.heap[index - 1].value, this.heap[Math.floor(index / 2) - 1].value) < 0)
    {
      swap(this.map, this.heap[index - 1].key, this.heap[Math.floor(index / 2) - 1].key); //swap indices of the objects to be swapped   
      swap(this.heap, index - 1, Math.floor(index / 2) - 1);    
    }
    
    index = Math.floor(index / 2); //update the current element to be its parent
  }
};

//function that maintains heap structure integrity by moving lower priority elements down
PriorityQueue.prototype.heapifyDown = function(index) {
  //start from the element at the given index
  //keep swapping the element with its child if it has lower priority than its child  
  var childIndex;
  while(index * 2 <= this.heap.length)
  {
    //if the parent has two children, then select the higher priority one
    //then perform the swap if the selected child has higher priority than the parent
    childIndex = (2 * index + 1 <= this.heap.length && this.comparator(this.heap[2 * index].value, this.heap[2 * index - 1].value) < 0) 
      ? 2 * index + 1 
      : 2 * index;   
    if(this.comparator(this.heap[childIndex - 1].value, this.heap[index - 1].value) < 0)
    {
      swap(this.map, this.heap[childIndex - 1].key, this.heap[index - 1].key); //swap indices of the objects to be swapped
      swap(this.heap, childIndex - 1, index - 1);
    }
    
    index = childIndex; //update the current element to be the selected child
  }
};

//function that pushes a new element into the priority queue
//the value is the priority associated with the passed in key
PriorityQueue.prototype.push = function(key, value) {
  if(this.map.hasOwnProperty(key) === true)
    return; //don't allow pushing of duplicate keys; use updateValueAtKey instead

  this.map[key] = this.heap.length; //store the index of the new object
  this.heap[this.heap.length] = {key : key, value : value}; //put the new object into the heap array
  this.heapifyUp(this.heap.length); //heapify the heap array
};

//function that gets the element at the top of the priority queue (this is the element with the highest priority)
PriorityQueue.prototype.top = function() {
  return (this.heap.length > 0) ? this.heap[0] : null;
};

//function that removes the element at the top of the priority queue (this is the element with the highest priority)
PriorityQueue.prototype.pop = function() {
  if(this.heap.length > 0)
  {  
    //the first and the last elements will be swapped
    //then the last element will be deleted and the heap array will be heapified
    var lastIndex = this.heap.length - 1;
    swap(this.map, this.heap[0].key, this.heap[lastIndex].key); //swap indices of the objects to be swapped
    swap(this.heap, 0, lastIndex);
    delete this.map[this.heap[lastIndex].key]; //delete the key from the index map
    var temp = this.heap.pop();
    this.heapifyDown(1); //heapify the heap array
    return temp;
  }
  
  return null;
};

//function that checks if the priority queue is empty or not
PriorityQueue.prototype.isEmpty = function() {
  return this.heap.length === 0;
};

//function that updates the value/priority of an element based on the passed in key
//the value/priority will be updated by the passed in function
PriorityQueue.prototype.updateValueAtKey = function(key, updateCallback) {

  if(this.map.hasOwnProperty(key) === false)
    return; //don't do anything if key doesn't exist

  //compare the old value and new value to determine if the priority queue needs to be heapified up or down
  var oldValue = this.heap[this.map[key]].value;
  var newValue = updateCallback(this.heap[this.map[key]].value); 
  if(this.comparator(this.heap[0].value, this.heap[this.heap.length - 1].value) < 0
    && this.comparator(newValue, oldValue) > 0
    || this.comparator(this.heap[0].value, this.heap[this.heap.length - 1].value) > 0
    && this.comparator(newValue, oldValue) < 0)
  {
    //if priority queue is a min queue and value just increased
    //or priority queue is a max queue and value just decreased
    //then heapify down
    this.heap[this.map[key]].value = newValue;
    this.heapifyDown(this.map[key] + 1);
  }
  else
  {
    //if priority queue is a min queue and value just decreased
    //or priority queue is a max queue and value just increased
    //then heapify up
    this.heap[this.map[key]].value = newValue;
    this.heapifyUp(this.map[key] + 1);
  }

};


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//prim's algorithm for finding the minimum spanning tree of a graph
Graph.prototype.primsMinimumSpanningTreeAlgorithm = function() {
  var mst = new Graph(); //the minimum spanning tree to return
 
  var distances = {}; //an object that holds the smallest known distance to a node from the src
  var prevNodes = {}; //an object containing the predecessor to each node

  var pq = new PriorityQueue(); //will hold all of the node keys and the tentative distance to each node from the src

  //put all of the node keys into the priority queue
  //make the source node the first one in the graph's hash table of nodes (the source node can be any arbitrary node in the graph)
  //set the distances of non source nodes to infinity and set the distance of the source node to 0
  //also update the prevNodeKeys object for the source node     
  var nodeKey;
  var first = true;
  for(nodeKey in this.adjList)
  {
    if(first !== true)
    {
      distances[nodeKey] = Infinity;
    }
    else
    {
      distances[nodeKey] = 0;
      prevNodes[nodeKey] = undefined;
      first = false;
    }
    pq.push(nodeKey, distances[nodeKey]);
  }

  //keep popping from the priority queue until it is empty
  var newNode;
  var neighborNodeKey; 
  var newDistance;
  while(pq.isEmpty() === false)
  {
    //pop the node key from the priority queue 
    nodeKey = pq.pop().key;

    //create new node based on popped node and add it to the minimum spanning tree
    newNode = new AdjListGraphNode(nodeKey, this.adjList[nodeKey].value);
    mst.addNode(newNode);

    //create an edge from the current node to its predecessor
    if(prevNodes[nodeKey] !== undefined)
    {
      mst.addBidirectionalEdge(newNode, prevNodes[nodeKey], distances[nodeKey]);
    }

    //look at each neighbor of the current node   
    for(neighborNodeKey in this.adjList[nodeKey].dest)
    {
      //get the distance to the current neighbor node using the distance so far to the current node           
      newDistance = this.adjList[nodeKey].dest[neighborNodeKey];

      //check if the new distance is lower than the distance in the distance object      
      if(newDistance < distances[neighborNodeKey])
      {
        //if the new distance is lower than the distance in the distance object,
        //then update the distance in the distance object for the curent neighbor node with the new distance
        //and update the current neighbor node's distance in the priority queue with the new distance    
        distances[neighborNodeKey] = newDistance;
        prevNodes[neighborNodeKey] = newNode;
        pq.updateValueAtKey(neighborNodeKey, function() {
          return newDistance;
        });
      }
    }
  }

  //return the minimum spanning tree
  return mst;
};


//tests:


var a = new AdjListGraphNode("a");
var b = new AdjListGraphNode("b");
var c = new AdjListGraphNode("c");

var g = new Graph();

g.addNode(a);
g.addNode(b);
g.addNode(c);

g.addBidirectionalEdge(a, b, 1);
g.addBidirectionalEdge(a, c, 2);
g.addBidirectionalEdge(b, c, 5);

console.log("test:");
console.log(g.primsMinimumSpanningTreeAlgorithm().adjList);


var a = new AdjListGraphNode("a");
var b = new AdjListGraphNode("b");
var c = new AdjListGraphNode("c");
var d = new AdjListGraphNode("d");

var g = new Graph();

g.addNode(a);
g.addNode(b);
g.addNode(c);
g.addNode(d);

g.addBidirectionalEdge(a, b, 2);
g.addBidirectionalEdge(a, d, 1);
g.addBidirectionalEdge(b, d, 2);
g.addBidirectionalEdge(d, c, 3);

//there can be multiple mst's for a given graph
//the following mst returned by the function call is correct, but different from the one on the wikipedia example image
//the following mst connects a and b instead of b and d, but both connections are of length 2 so either will work
//changing the connection length of a and b to 3 will cause b and d to instead become part of the mst
console.log("test:");
console.log(g.primsMinimumSpanningTreeAlgorithm().adjList);


var zero = new AdjListGraphNode("zero");
var one = new AdjListGraphNode("one");
var two = new AdjListGraphNode("two");
var three = new AdjListGraphNode("three");
var four = new AdjListGraphNode("four");
var five = new AdjListGraphNode("five");
var six = new AdjListGraphNode("six");
var seven = new AdjListGraphNode("seven");
var eight = new AdjListGraphNode("eight");

var g = new Graph();

g.addNode(zero);
g.addNode(one);
g.addNode(two);
g.addNode(three);
g.addNode(four);
g.addNode(five);
g.addNode(six);
g.addNode(seven);
g.addNode(eight);

g.addBidirectionalEdge(zero, one, 4);
g.addBidirectionalEdge(one, two, 8);
g.addBidirectionalEdge(two, three, 7);
g.addBidirectionalEdge(three, four, 9);
g.addBidirectionalEdge(four, five, 10);
g.addBidirectionalEdge(five, six, 2);
g.addBidirectionalEdge(six, seven, 1);
g.addBidirectionalEdge(seven, zero, 8);
g.addBidirectionalEdge(seven, one, 11);
g.addBidirectionalEdge(seven, eight, 7);
g.addBidirectionalEdge(eight, two, 2);
g.addBidirectionalEdge(eight, six, 6);
g.addBidirectionalEdge(two, five, 4);
g.addBidirectionalEdge(five, three, 14);

console.log("test:");
console.log(g.primsMinimumSpanningTreeAlgorithm().adjList);



