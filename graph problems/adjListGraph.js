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

Graph.prototype.hasDirectedEdge = function(srcNode, destNode) {
  return this.adjList[srcNode.key].dest.hasOwnProperty(destNode.key);
};

Graph.prototype.addDirectedEdge = function(srcNode, destNode, weight) {
  this.adjList[srcNode.key].dest[destNode.key] = weight;
};

Graph.prototype.removeDirectedEdge = function(srcNode, destNode) {
  delete this.adjList[srcNode.key].dest[destNode.key];
};


//dijkstra's
Graph.prototype.shortestPath = function(srcNode, destNode) {
  
};






var swap = function(arr, i, j) {
  var temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

//priority queue built off binary heap (not the most efficient implementation)
var PriorityQueue = function(comparator) {
  this.heap = [];
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
    if(this.comparator(this.heap[index - 1], this.heap[Math.floor(index / 2) - 1]) < 0)
    {
      swap(this.heap, index - 1, Math.floor(index / 2) - 1);    
    }
    
    index = Math.floor(index / 2); 
  }
};

PriorityQueue.prototype.heapifyDown = function(index) {
  var childIndex;
  while(index * 2 <= this.heap.length)
  {
    childIndex = (2 * index + 1 <= this.heap.length && this.comparator(this.heap[2 * index], this.heap[2 * index - 1]) < 0) 
      ? 2 * index + 1 
      : 2 * index;   
    if(this.comparator(this.heap[childIndex - 1], this.heap[index - 1]) < 0)
    {
      swap(this.heap, childIndex - 1, index - 1);
    }
    
    index = childIndex; 
  }
};

PriorityQueue.prototype.push = function(value) {
  this.heap[this.heap.length] = value;
  this.heapifyUp(this.heap.length);
};

PriorityQueue.prototype.top = function() {
  return (this.heap.length > 0) ? this.heap[0] : null;
};

PriorityQueue.prototype.pop = function() {
  if(this.heap.length > 0)
  {  
    swap(this.heap, 0, this.heap.length - 1);
    var temp = this.heap.pop();
    this.heapifyDown(1);
    return temp;
  }
  
  return null;
};















