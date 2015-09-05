//aStar.js


//implementation of a* search algorithm


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


//a* search algorithm for finding the shortest path between source and destination
//if a dest node exists in the graph, then the function returns the distance and path contained in an object
//  the distance will be infinity if the node in the graph cannot be reached
//  the path will be every node in the shortest path from the srcNode to the destNode, but will not include the destNode itself
//if the dest node is not provided or does not exist in the graph, 
//  then the function returns the distances and previous node keys from the source node to every node contained in an object
Graph.prototype.aStarSearch = function(srcNode, destNode, heuristic) {
  var costs = {}; //an object that holds the smallest tentative cost to a node from the src
  var prevNodeKeys = {}; //an object used to help construct the shortest path from src to dest

  var frontier = new PriorityQueue(); //will hold all of the node keys and the estimated cost to each node from the src

  //put all of the node keys into the priority queue
  var nodeKey;
  for(nodeKey in this.adjList)
  {
    //set the costs of non source nodes to infinity and set the cost of the source node to 0
    //also update the prevNodeKeys object for the source node    
    if(nodeKey !== srcNode.key)
    {
      costs[nodeKey] = Infinity;
    }
    else
    {
      costs[nodeKey] = 0;
      prevNodeKeys[nodeKey] = undefined;
    }
    frontier.push(nodeKey, costs[nodeKey]);
  }

  //keep popping from the priority queue until it is empty or the destination node is found
  var neighborNodeKey; 
  var tentativeCost;
  var estimatedCost;
  while(frontier.isEmpty() === false)
  {
    //console log for debugging
    console.log("selected node: " + frontier.top().key + ", " + frontier.top().value);  

    //pop the node key from the priority queue
    nodeKey = frontier.pop().key;

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
      return {distance : costs[destNode.key], path : path};
    }

    //look at each neighbor of the current node
    for(neighborNodeKey in this.adjList[nodeKey].dest)
    {
      //get the cost to the current neighbor node using the cost so far to the current node
      tentativeCost = costs[nodeKey] + this.adjList[nodeKey].dest[neighborNodeKey];

      //check if the tentative cost is lower than the cost in the cost object
      //dont need to check if node exists in cost object since all nodes were already put into it with cost of infinity
      if(tentativeCost < costs[neighborNodeKey])
      {
        //if the tentative cost is lower than the cost in the cost object, 
        //then update the cost in the cost object for the current neighbor node with the tentative cost
        //and use the tentative cost and heuristic to calculate the estimated cost
        //and update the current neighbor node's cost in the priority queue with the estimated cost
        costs[neighborNodeKey] = tentativeCost;
        prevNodeKeys[neighborNodeKey] = nodeKey;
        estimatedCost = tentativeCost + heuristic(this.adjList[neighborNodeKey], destNode);
        frontier.updateValueAtKey(neighborNodeKey, function() {
          return estimatedCost;
        });
      }
    }
  }
  
  //return the cost and prevNodeKeys objects if the destination cannot be reached or found
  return {costs : costs, prevNodeKeys : prevNodeKeys};
};


//tests:


//test with return 0 heuristic
//when heuristic returns 0, then a* search becomes equivalent to dijkstra's
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

//find shortest path using a* search

//find shortest path from node "one" to all nodes
console.log("test:");
console.log(g.aStarSearch(one, undefined, function() {
  return 0;
}));

//find shortest path from node "one" to itself
console.log("test:");
console.log(g.aStarSearch(one, one, function() {
  return 0;
}));

//find shortest path from node "one" to node "five"
console.log("test:");
console.log(g.aStarSearch(one, five, function() {
  return 0;
}));

//find shortest path from node "one" to unreachable node "seven"
console.log("test:");
console.log(g.aStarSearch(one, seven, function() {
  return 0;
}));


//the following is the wikipedia example on the a* search algorithm page

var x = new AdjListGraphNode("x"); //src
var a = new AdjListGraphNode("a");
var b = new AdjListGraphNode("b");
var c = new AdjListGraphNode("c");
var d = new AdjListGraphNode("d");
var e = new AdjListGraphNode("e");
var y = new AdjListGraphNode("y"); //dest

var g = new Graph();

g.addNode(x);
g.addNode(a);
g.addNode(b);
g.addNode(c);
g.addNode(d);
g.addNode(e);
g.addNode(y);

g.addBidirectionalEdge(x, a, 1.5);
g.addBidirectionalEdge(x, d, 2);
g.addBidirectionalEdge(a, b, 2);
g.addBidirectionalEdge(b, c, 3);
g.addBidirectionalEdge(c, y, 4);
g.addBidirectionalEdge(d, e, 3);
g.addBidirectionalEdge(e, y, 2);

//console.log(g.adjList);

//run a* with a heuristic that returns the values in the wikipedia diagram example
//and run a* again when the heuristic function always returns 0

//the second call to a* will need to check more nodes
//in order words, having the heuristic will reduce the search space
//this works because once e is seen, the algorithm determines that
//it is impossible for c to be part of the shortest path since adding the heuristic value to 
//c will exceed the calculated shortest path
//since the heuristic never overestimates the cost of the node to the destination,
//it is impossible for the path consisting of c to be shorter

console.log("test:");
console.log(g.aStarSearch(x, y, function(node1) {
  //this heuristic is supposed to return the distance of a straight line from the node to the destination
  //but for this example, the return values will be hardcoded for testing purposes

  var testSampleHeuristicValues = {
    "a" : 4,
    "b" : 2,
    "c" : 4,
    "d" : 4.5,
    "e" : 2
  };

  return (testSampleHeuristicValues.hasOwnProperty(node1.value) === true) ? testSampleHeuristicValues[node1.value] : 0;
}));

console.log("test:");
console.log(g.aStarSearch(x, y, function() {
  //have the heuristic just return 0, which makes a* turn into dijkstra's

  return 0;
}));


//the following is just a test on a random grid

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

//console.log(grid.adjList);

//the heuristic doesn't really help on this blocked grid

//look for shortest path (can only move left/right/up/down in grid, and every edge has a cost of 1) from 11 to 25
//use return 0 as heuristic
console.log("test:");
console.log(grid.aStarSearch(grid.adjList["1,1"], grid.adjList["2,5"], function(node1, node2) {
  return 0;
}));

//look for shortest path (can only move left/right/up/down in grid, and every edge has a cost of 1) from 11 to 25
//use manhattan distance as heuristic
//note: the shortest path is slightly different than the 0 heuristic one, but the distance is still the same
console.log("test:");
console.log(grid.aStarSearch(grid.adjList["1,1"], grid.adjList["2,5"], function(node1, node2) {
  return Math.abs(node2.value[0] - node1.value[0]) + Math.abs(node2.value[1] - node1.value[1]);
}));


//recreate the grid but with no blocks this time
//and test a* again

grid = new Graph();

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

//console.log(grid.adjList);

//the heuristic helps a lot on this grid

//look for shortest path (can only move left/right/up/down in grid, and every edge has a cost of 1) from 11 to 25
//use return 0 as heuristic
console.log("test:");
console.log(grid.aStarSearch(grid.adjList["1,1"], grid.adjList["2,5"], function(node1, node2) {
  return 0;
}));

//look for shortest path (can only move left/right/up/down in grid, and every edge has a cost of 1) from 11 to 25
//use manhattan distance as heuristic
//note: the shortest path is slightly different than the 0 heuristic one, but the distance is still the same
console.log("test:");
console.log(grid.aStarSearch(grid.adjList["1,1"], grid.adjList["2,5"], function(node1, node2) {
  return Math.abs(node2.value[0] - node1.value[0]) + Math.abs(node2.value[1] - node1.value[1]);
}));



