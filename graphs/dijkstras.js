//dijkstras.js


//implementation of dijkstra's algorithm 


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


//dijkstra's algorithm for finding the shortest path between source and destination
//if a dest node exists in the graph, then the function returns the distance and path contained in an object
//  the distance will be infinity if the node in the graph cannot be reached
//  the path will be every node in the shortest path from the srcNode to the destNode, but will not include the destNode itself
//if the dest node is not provided or does not exist in the graph, 
//  then the function returns the distances and previous node keys from the source node to every node contained in an object
Graph.prototype.dijkstrasShortestPathAlgorithm = function(srcNode, destNode) {
  var distances = {}; //an object that holds the smallest known distance to a node from the src
  var prevNodeKeys = {}; //an object used to help construct the shortest path from src to dest

  var pq = new PriorityQueue(); //will hold all of the node keys and the tentative distance to each node from the src

  //put all of the node keys into the priority queue
  var nodeKey;
  for(nodeKey in this.adjList)
  {
    //set the distances of non source nodes to infinity and set the distance of the source node to 0
    //also update the prevNodeKeys object for the source node        
    if(nodeKey !== srcNode.key)
    {
      distances[nodeKey] = Infinity;
    }
    else
    {
      distances[nodeKey] = 0;
      prevNodeKeys[nodeKey] = undefined;
    }
    pq.push(nodeKey, distances[nodeKey]);
  }

  //keep popping from the priority queue until it is empty or the destination node is found
  var neighborNodeKey; 
  var newDistance;
  while(pq.isEmpty() === false)
  {
    //pop the node key from the priority queue   
    nodeKey = pq.pop().key;

    //construct and return the path if the destination node has been found   
    if(destNode !== undefined && nodeKey === destNode.key)
    {
      //use the prevNodeKeys object to build the path      
      var path = [];
      var pathNodeKey = prevNodeKeys[destNode.key];
      while(pathNodeKey !== undefined)
      {
        path.push(this.adjList[pathNodeKey]);
        pathNodeKey = prevNodeKeys[pathNodeKey];
      }
      path.reverse();
      return {distance : distances[destNode.key], path : path};
    }

    //look at each neighbor of the current node    
    for(neighborNodeKey in this.adjList[nodeKey].dest)
    {
      //get the distance to the current neighbor node using the distance so far to the current node      
      newDistance = distances[nodeKey] + this.adjList[nodeKey].dest[neighborNodeKey];

      //check if the new distance is lower than the distance in the distance object
      //dont need to check if node exists in distance object since all nodes were already put into it with distance of infinity     
      if(newDistance < distances[neighborNodeKey])
      {
        //if the new distance is lower than the distance in the distance object,
        //then update the distance in the distance object for the curent neighbor node with the new distance
        //and update the current neighbor node's distance in the priority queue with the new distance
        distances[neighborNodeKey] = newDistance;
        prevNodeKeys[neighborNodeKey] = nodeKey;
        pq.updateValueAtKey(neighborNodeKey, function() {
          return newDistance;
        });
      }
    }
  }
  
  //return the distance and prevNodeKeys objects if the destination cannot be reached or found  
  return {distances : distances, prevNodeKeys : prevNodeKeys};
};


//tests:


//the following is the wikipedia example on the dijkstra's algorithm page
//with an unreachable "seven" node added in

var one = new AdjListGraphNode("one");
var two = new AdjListGraphNode("two");
var three = new AdjListGraphNode("three");
var four = new AdjListGraphNode("four");
var five = new AdjListGraphNode("five");
var six = new AdjListGraphNode("six");
var seven = new AdjListGraphNode("seven");

var g = new Graph();

g.addNode(one);
g.addNode(two);
g.addNode(three);
g.addNode(four);
g.addNode(five);
g.addNode(six);
g.addNode(seven);

g.addBidirectionalEdge(one, two, 7);
g.addBidirectionalEdge(two, four, 15);
g.addBidirectionalEdge(four, five, 6);
g.addBidirectionalEdge(five, six, 9);
g.addBidirectionalEdge(six, one, 14);
g.addBidirectionalEdge(one, three, 9);
g.addBidirectionalEdge(two, three, 10);
g.addBidirectionalEdge(four, three, 11);
g.addBidirectionalEdge(six, three, 2);

//console.log(g.adjList);

//find shortest path using dijkstra's algorithm

//find shortest path from node "one" to all nodes
console.log("test:");
console.log(g.dijkstrasShortestPathAlgorithm(one));

//find shortest path from node "one" to itself
console.log("test:");
console.log(g.dijkstrasShortestPathAlgorithm(one, one));

//find shortest path from node "one" to node "five"
console.log("test:");
console.log(g.dijkstrasShortestPathAlgorithm(one, five));

//find shortest path from node "one" to unreachable node "seven"
console.log("test:");
console.log(g.dijkstrasShortestPathAlgorithm(one, seven));



