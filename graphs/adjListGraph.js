




var Queue = function(){
  this.storage = {};
  this.sizep = 0;
  this.pushIndex = 0;
  this.popIndex = 0;
};

Queue.prototype.enqueue = function(value){
  this.storage[this.pushIndex] = value;
  this.sizep++;
  this.pushIndex++;
};

Queue.prototype.dequeue = function(){
  if(this.sizep>0){
    var temp = this.storage[this.popIndex];
    delete this.storage[this.popIndex];
    this.popIndex++;
    this.sizep--;
    return temp;
  }

};

Queue.prototype.size = function(){
  return this.sizep;
};






var Stack = function() {
  this.storage = {};
  this.sizep = 0;
};

Stack.prototype.push = function(value){
  this.storage[this.sizep] = value;
  ++this.sizep;
};

Stack.prototype.pop = function(){
  if(this.sizep >= 1)
  {
    var temp = this.storage[this.sizep - 1];
    delete this.storage[this.sizep - 1];
    --this.sizep;
    return temp;
  }

  return undefined;
};

Stack.prototype.size = function(){
  return this.sizep;
};





var swap = function(arr, i, j) {
  var temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

//priority queue built off binary heap (not the most efficient implementation of priority queues)
var PriorityQueue = function(comparator) {
  this.heap = [];
  this.map = {}; //map to store the indices for each key; this is needed for update key function to remain O(log n)
  this.comparator = comparator;
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

PriorityQueue.prototype.heapifyUp = function(index) {
  while(Math.floor(index / 2) > 0)    
  {
    if(this.comparator(this.heap[index - 1].value, this.heap[Math.floor(index / 2) - 1].value) < 0)
    {
      swap(this.map, this.heap[index - 1].key, this.heap[Math.floor(index / 2) - 1].key); //swap indices of the objects to be swapped   
      swap(this.heap, index - 1, Math.floor(index / 2) - 1);    
    }
    
    index = Math.floor(index / 2); 
  }
};

PriorityQueue.prototype.heapifyDown = function(index) {
  var childIndex;
  while(index * 2 <= this.heap.length)
  {
    childIndex = (2 * index + 1 <= this.heap.length && this.comparator(this.heap[2 * index].value, this.heap[2 * index - 1].value) < 0) 
      ? 2 * index + 1 
      : 2 * index;   
    if(this.comparator(this.heap[childIndex - 1].value, this.heap[index - 1].value) < 0)
    {
      swap(this.map, this.heap[childIndex - 1].key, this.heap[index - 1].key); //swap indices of the objects to be swapped
      swap(this.heap, childIndex - 1, index - 1);
    }
    
    index = childIndex; 
  }
};

PriorityQueue.prototype.push = function(key, value) {
  if(this.map.hasOwnProperty(key) === true)
    return; //don't allow pushing of duplicate keys; use updateValueAtKey instead

  this.map[key] = this.heap.length; //store the index of the new object
  this.heap[this.heap.length] = {key : key, value : value}; //put the new object into the heap array
  this.heapifyUp(this.heap.length); //heapify the heap array
};

PriorityQueue.prototype.top = function() {
  return (this.heap.length > 0) ? this.heap[0] : null;
};

PriorityQueue.prototype.pop = function() {
  if(this.heap.length > 0)
  {  
    var lastIndex = this.heap.length - 1;
    swap(this.map, this.heap[0].key, this.heap[lastIndex].key); //swap indices of the objects to be swapped
    swap(this.heap, 0, lastIndex);
    delete this.map[this.heap[lastIndex].key]; //delete the key from the index map
    var temp = this.heap.pop();
    this.heapifyDown(1);
    return temp;
  }
  
  return null;
};

PriorityQueue.prototype.isEmpty = function() {
  return this.heap.length === 0;
};

PriorityQueue.prototype.updateValueAtKey = function(key, updateCallback) {

  if(this.map.hasOwnProperty(key) === false)
    return; //don't do anything if key doesn't exist

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



//dijkstra's algorithm for finding the shortest path between source and destination
//if a dest node exists in the graph, then the function returns the distance and path contained in an object
//  the distance will be infinity if the node in the graph cannot be reached
//  the path will be every node in the shortest path from the srcNode to the destNode, but will not include the destNode itself
//if the dest node is not provided or does not exist in the graph, 
//  then the function returns the distances and previous node keys from the source node to every node contained in an object
Graph.prototype.dijkstrasShortestPathAlgorithm = function(srcNode, destNode) {
  var distances = {};
  var prevNodeKeys = {};

  var pq = new PriorityQueue();

  var nodeKey;
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
    pq.push(nodeKey, distances[nodeKey]);
  }

  var neighborNodeKey; 
  var newDistance;
  var path = [];
  while(pq.isEmpty() === false)
  {
    nodeKey = pq.pop().key;
    if(destNode !== undefined && nodeKey === destNode.key)
    {
      var pathNodeKey = prevNodeKeys[destNode.key];
      while(pathNodeKey !== undefined)
      {
        path.push(this.adjList[pathNodeKey]);
        pathNodeKey = prevNodeKeys[pathNodeKey];
      }
      path.reverse();
      return {distance : distances[destNode.key], path : path};
    }
    for(neighborNodeKey in this.adjList[nodeKey].dest)
    {
      newDistance = distances[nodeKey] + this.adjList[nodeKey].dest[neighborNodeKey];
      if(newDistance < distances[neighborNodeKey])
      {
        distances[neighborNodeKey] = newDistance;
        prevNodeKeys[neighborNodeKey] = nodeKey;
        pq.updateValueAtKey(neighborNodeKey, function() {
          return newDistance;
        });
      }
    }
  }
  
  return {distances : distances, prevNodeKeys : prevNodeKeys};
};



Graph.prototype.aStarSearch = function(srcNode, destNode, heuristic) {
  var costs = {};
  var prevNodeKeys = {};

  var pq = new PriorityQueue();

  var nodeKey;
  for(nodeKey in this.adjList)
  {
    if(nodeKey !== srcNode.key)
    {
      costs[nodeKey] = Infinity;
    }
    else
    {
      costs[nodeKey] = 0;
      prevNodeKeys[nodeKey] = undefined;
    }
    pq.push(nodeKey, costs[nodeKey]);
  }

  var neighborNodeKey; 
  var tentativeCost;
  var estimatedCost;
  var path = [];
  while(pq.isEmpty() === false)
  {
    nodeKey = pq.pop().key;
    if(destNode !== undefined && nodeKey === destNode.key)
    {
      var pathNodeKey = prevNodeKeys[destNode.key];
      while(pathNodeKey !== undefined)
      {
        path.push(this.adjList[pathNodeKey]);
        pathNodeKey = prevNodeKeys[pathNodeKey];
      }
      path.reverse();
      return {distance : costs[destNode.key], path : path};
    }
    for(neighborNodeKey in this.adjList[nodeKey].dest)
    {
      tentativeCost = costs[nodeKey] + this.adjList[nodeKey].dest[neighborNodeKey];
      if(costs.hasOwnProperty(neighborNodeKey) === false || tentativeCost < costs[neighborNodeKey])
      {
        costs[neighborNodeKey] = tentativeCost;
        prevNodeKeys[neighborNodeKey] = nodeKey;
        estimatedCost = tentativeCost + heuristic(this.adjList[neighborNodeKey], destNode);
        pq.updateValueAtKey(neighborNodeKey, function() {
          return estimatedCost;
        });
      }
    }
  }
  
  return {costs : costs, prevNodeKeys : prevNodeKeys};
};



//prim's algorithm for finding the minimum spanning tree of a graph
Graph.prototype.primsMinimumSpanningTreeAlgorithm = function() {
  var mst = new Graph();
 
  var distances = {};
  var prevNodes= {};

  var pq = new PriorityQueue();

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

  var newNode;
  var neighborNodeKey; 
  var newDistance;
  while(pq.isEmpty() === false)
  {
    nodeKey = pq.pop().key;
    newNode = new AdjListGraphNode(nodeKey, this.adjList[nodeKey].value);
    mst.addNode(newNode);
    if(prevNodes[nodeKey] !== undefined)
    {
      mst.addBidirectionalEdge(newNode, prevNodes[nodeKey], distances[nodeKey]);
    }
//can actually break here if the total number of nodes from the original graph is added to the mst 
//since every path leading to the last node will have already been explored
    for(neighborNodeKey in this.adjList[nodeKey].dest)
    {
      newDistance = this.adjList[nodeKey].dest[neighborNodeKey];
      if(newDistance < distances[neighborNodeKey])
      {
        distances[neighborNodeKey] = newDistance;
        prevNodes[neighborNodeKey] = newNode;
        pq.updateValueAtKey(neighborNodeKey, function() {
          return newDistance;
        });
      }
    }
  }

  return mst;
};



Graph.prototype.breadthFirstSearch = function(srcNode, destNode) {

  var prevNodeKeys = {};

  var q = new Queue();

  q.enqueue(srcNode.key);

  prevNodeKeys[srcNode.key] = undefined;

  var nodeKey;
  var neighborNodeKey; 
  var path = [];
  while(q.size() > 0)
  {
    nodeKey = q.dequeue();
    if(destNode !== undefined && nodeKey === destNode.key)
    {
      var pathNodeKey = prevNodeKeys[destNode.key];
      while(pathNodeKey !== undefined)
      {
        path.push(this.adjList[pathNodeKey]);
        pathNodeKey = prevNodeKeys[pathNodeKey];
      }
      path.reverse();
      return path;
    }
    for(neighborNodeKey in this.adjList[nodeKey].dest)
    {
      if(prevNodeKeys.hasOwnProperty(neighborNodeKey) === false)
      {
        q.enqueue(neighborNodeKey);
        prevNodeKeys[neighborNodeKey] = nodeKey;
      }
    }
  }

  return prevNodeKeys;

};

Graph.prototype.depthFirstSearch = function(srcNode, destNode) {

  var prevNodeKeys = {};

  var s = new Stack();

  s.push(srcNode.key);

  prevNodeKeys[srcNode.key] = undefined;

  var nodeKey;
  var neighborNodeKey; 
  var path = [];
  while(s.size() > 0)
  {
    nodeKey = s.pop();
    if(destNode !== undefined && nodeKey === destNode.key)
    {
      var pathNodeKey = prevNodeKeys[destNode.key];
      while(pathNodeKey !== undefined)
      {
        path.push(this.adjList[pathNodeKey]);
        pathNodeKey = prevNodeKeys[pathNodeKey];
      }
      path.reverse();
      return path;
    }
    for(neighborNodeKey in this.adjList[nodeKey].dest)
    {
      if(prevNodeKeys.hasOwnProperty(neighborNodeKey) === false)
      {
        s.push(neighborNodeKey);
        prevNodeKeys[neighborNodeKey] = nodeKey;
      }
    }
  }

  return prevNodeKeys;

};

Graph.prototype.iterativeDeepeningDepthFirstSearch = function(srcNode, destNode) {

  var prevNodeKeysToReturn = {}; //will contain information to create a path and also keep track of visited nodes
  
  var found = false; //flag to indicate if the dest node has been found

  //helper function to perform dfs up to the given depth
  var graph = this;
  var depthLimitedSearch = function(maxDepth) {

    var depth = 1;
    var updated = false; //flag to indicate if something in prevNodeKeysToReturn has been updated 

    var prevNodeKeys = {}; //will be used to track if a node has been visited in the current DLS call
    prevNodeKeys[srcNode.key] = undefined;

    var s = new Stack();
    s.push({key : srcNode.key, depth : depth});

    var stackItem;
    var nodeKey;
    var neighborNodeKey; 
    while(s.size() > 0)
    {
      stackItem = s.pop();
      nodeKey = stackItem.key;
      depth = stackItem.depth;
      
      if(depth === maxDepth)
      {
        if(prevNodeKeysToReturn.hasOwnProperty(nodeKey) === false)  
        {
          prevNodeKeysToReturn[nodeKey] = prevNodeKeys[nodeKey];
          if(destNode !== undefined && nodeKey === destNode.key)
          {
            found = true;
            return false; //stop if destination node has been found
          }
          updated = true; 
        }
        continue;     
      }
      
      for(neighborNodeKey in graph.adjList[nodeKey].dest)
      {
        if(prevNodeKeys.hasOwnProperty(neighborNodeKey) === false)
        {          
          s.push({key : neighborNodeKey, depth : depth + 1});     
          prevNodeKeys[neighborNodeKey] = nodeKey;
        }
      }
    }

    return updated;
  };

  //keep performing DLS until nothing in prevNodeKeysToReturn gets updated
  //  if nothing in prevNodeKeysToReturn gets updated, then that means that every node in the graph has been visited
  //  and we can stop traversing the graph
  //alternatively, stop if the dest node has been found 
  //  (updated will be false if the dest node has been found, even though prevNodeKeysToReturn will have been updated)
  var i = 0;
  var updated = true;
  while(updated === true)
  {
    ++i;
    updated = depthLimitedSearch(i);
  }

  if(found === true)
  {
    var path = [];
    var pathNodeKey = prevNodeKeysToReturn[destNode.key];
    while(pathNodeKey !== undefined)
    {
      path.push(this.adjList[pathNodeKey]);
      pathNodeKey = prevNodeKeysToReturn[pathNodeKey];
    }
    path.reverse();
    return path;
  }
  else
  {
    return prevNodeKeysToReturn;
  }

};



Graph.prototype.bellmanFordAlgorithm = function(srcNode) {
  var distances = {};
  var prevNodeKeys = {};

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

  var q = new Queue(); //to help with traversal
  var neighborNodeKey; 
  var newDistance;
  var visited;
  for(var i = 0; i < numNodes - 1; ++i)
  {
    //traverse the graph
    q.enqueue(srcNode.key); //start at the source node
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
  
  return {distances : distances, prevNodeKeys : prevNodeKeys};
};











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

console.log(g.adjList);


//find shortest path using dijkstra's algorithm
console.log(g.dijkstrasShortestPathAlgorithm(one));
console.log(g.dijkstrasShortestPathAlgorithm(one, one));
console.log(g.dijkstrasShortestPathAlgorithm(one, five));
console.log(g.dijkstrasShortestPathAlgorithm(one, seven));


//find shortest path using a* search
//when heuristic returns 0, then a* search becomes equivalent to dijkstra's
console.log(g.aStarSearch(one, undefined, function() {
  return 0;
}));

console.log(g.aStarSearch(one, one, function() {
  return 0;
}));

console.log(g.aStarSearch(one, five, function() {
  return 0;
}));

console.log(g.aStarSearch(one, seven, function() {
  return 0;
}));







var grid = new Graph();

//grid of "squares" represented by coordinates
//00 01 02 XX 04 05
//10 11 12 XX 14 15
//20 21 22 XX 24 25
//30 31 32 XX 34 35
//40 41 42 XX 44 45
//50 51 52 53 54 55
//XX means blocked
//every square can get to the square that is to the right/left/top/bottom of it, as long as the square isn't blocked
//ie. 31 can get to 21, 30, 32, 41
//and 32 can get to 22, 31, 42

//create 6x6 grid
var numCols = 6;
var numRows = 6;
var coordinate;
for(var rows = 0; rows < numRows; ++rows)
{
  for(var cols = 0; cols < numCols; ++cols)
  {
    coordinate = [];
    coordinate[0] = rows;
    coordinate[1] = cols;
    grid.addNode(new AdjListGraphNode(coordinate.toString(), coordinate));
  }
}

//block every square in the fourth row of the grid except the bottom most square
grid.adjList["0,3"].value = "XX";
grid.adjList["1,3"].value = "XX";
grid.adjList["2,3"].value = "XX";
grid.adjList["3,3"].value = "XX";
grid.adjList["4,3"].value = "XX";

//create a connection between every adjacent (up/down/left/right) square, as long as a square isn't blocked
var newCoordinate;
for(var nodeKey in grid.adjList)
{

  if(grid.adjList[nodeKey].value !== "XX")
  {
    //create connection to the top if the square to the top is valid
    newCoordinate = grid.adjList[nodeKey].value.slice();
    --newCoordinate[0];
    if(newCoordinate[0] >= 0 && grid.adjList[newCoordinate.toString()].value !== "XX")
    {
      grid.addDirectedEdge(grid.adjList[nodeKey], grid.adjList[newCoordinate.toString()], 1);
    }

    //create connection to the bottom if the square to the bottom is valid
    newCoordinate = grid.adjList[nodeKey].value.slice();
    ++newCoordinate[0];
    if(newCoordinate[0] < numRows && grid.adjList[newCoordinate.toString()].value !== "XX")
    {
      grid.addDirectedEdge(grid.adjList[nodeKey], grid.adjList[newCoordinate.toString()], 1);
    }

    //create connection to the left if the square to the left is valid
    newCoordinate = grid.adjList[nodeKey].value.slice();
    --newCoordinate[1];
    if(newCoordinate[1] >= 0 && grid.adjList[newCoordinate.toString()].value !== "XX")
    {
      grid.addDirectedEdge(grid.adjList[nodeKey], grid.adjList[newCoordinate.toString()], 1);
    }

    //create connection to the right if the square to the right is valid
    newCoordinate = grid.adjList[nodeKey].value.slice();
    ++newCoordinate[1];
    if(newCoordinate[1] < numCols && grid.adjList[newCoordinate.toString()].value !== "XX")
    {
      grid.addDirectedEdge(grid.adjList[nodeKey], grid.adjList[newCoordinate.toString()], 1);
    }
  }

}

console.log(grid.adjList);


//look for shortest path (can only move left/right/up/down in grid, and every edge has a cost of 1) from 11 to 25
//use manhattan distance as heuristic
console.log(grid.aStarSearch(grid.adjList["1,1"], grid.adjList["2,5"], function(node1, node2) {
  return Math.abs(node2.value[0] - node1.value[0]) + Math.abs(node2.value[1] - node1.value[1]);
}));







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

console.log(g.primsMinimumSpanningTreeAlgorithm().adjList);







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


//BFS should return a path (only optimal if all weights in the graph are identical) if the source can reach the destination

console.log(g.breadthFirstSearch(frankfurt));

console.log(g.breadthFirstSearch(frankfurt, unconnectedCity));

console.log(g.breadthFirstSearch(frankfurt, frankfurt));

console.log(g.breadthFirstSearch(frankfurt, mannheim));

console.log(g.breadthFirstSearch(frankfurt, stuttgart));

console.log(g.breadthFirstSearch(frankfurt, karlsruhe));


//DFS should return a path if BFS with the same inputs also returns a path, but the returned paths aren't necessarily identical

console.log(g.depthFirstSearch(frankfurt));

console.log(g.depthFirstSearch(frankfurt, unconnectedCity));

console.log(g.depthFirstSearch(frankfurt, frankfurt));

console.log(g.depthFirstSearch(frankfurt, mannheim));

console.log(g.depthFirstSearch(frankfurt, stuttgart));

console.log(g.depthFirstSearch(frankfurt, karlsruhe));


//IDDFS should return the same path as BFS if destination node can been found
//  and return an object with identical properties and values if the destination node cannot be found 
//  (properties stored in the object don't have to be stored in the same order though)

console.log(g.iterativeDeepeningDepthFirstSearch(frankfurt));

console.log(g.iterativeDeepeningDepthFirstSearch(frankfurt, unconnectedCity));

console.log(g.iterativeDeepeningDepthFirstSearch(frankfurt, frankfurt));

console.log(g.iterativeDeepeningDepthFirstSearch(frankfurt, mannheim));

console.log(g.iterativeDeepeningDepthFirstSearch(frankfurt, stuttgart));

console.log(g.iterativeDeepeningDepthFirstSearch(frankfurt, karlsruhe));







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

console.log(g.bellmanFordAlgorithm(a));
















//ADD COMMENTS!!!
//ADD MORE TEST CASES!!!
//SPLIT INTO MULTIPLE FILES!!!






