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





var swap = function(arr, i, j) {
  var temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

var PriorityQueue = function(comparator) {
  this.storage = [];
  this.storage.push(null);
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

PriorityQueue.prototype.heapify = function(index) {
  while(Math.floor(index / 2) > 0)    
  {
    if(this.comparator(this.storage[index], this.storage[Math.floor(index / 2)]) < 0)
    {
      swap(this.storage, index, Math.floor(index / 2));    
    }
    
    index = Math.floor(index / 2); 
  }
    
};

PriorityQueue.prototype.push = function(value) {
  this.storage[this.storage.length] = value;
  console.log("before: ", this.storage);
  this.heapify(this.storage.length - 1);
  console.log("after: ", this.storage);
};

PriorityQueue.prototype.top = function() {
  return this.storage[1];
};

PriorityQueue.prototype.pop = function() {
  
};








