//adjListGraph.js


//an implementation of a graph using the adjacency list representation
//the graph object will contain a hash table of nodes
//and each node will have a hash table of node keys and weights to represent edges to adjacent nodes


//node class to be used by the graph
var AdjListGraphNode = function(key, value) {
  this.key = key || "";
  this.value = value || this.key;
  this.dest = {};
};


//graph class
var Graph = function() {
  this.adjList = {};
};

//function to add a node to the graph
Graph.prototype.addNode = function(node) {
  this.adjList[node.key] = node;
};

//function to check if the graph contains a node
Graph.prototype.contains = function(node) {
  return this.adjList.hasOwnProperty(node.key);
};

//function to remove a node from the graph
Graph.prototype.removeNode = function(node) {
  delete this.adjList[node.key];
};

//function to check if there is a bidirectional edge between two nodes in the graph
Graph.prototype.hasBidirectionalEdge = function(srcNode, destNode){
  return this.adjList[srcNode.key].dest.hasOwnProperty(destNode.key)
    && this.adjList[destNode.key].dest.hasOwnProperty(srcNode.key);
};

//function to add a bidirectional edge between two nodes in the graph
Graph.prototype.addBidirectionalEdge = function(srcNode, destNode, weight){
  this.adjList[srcNode.key].dest[destNode.key] = weight;
  this.adjList[destNode.key].dest[srcNode.key] = weight;
};

//function to remove a bidirectional edge between two nodes in the graph
Graph.prototype.removeBidirectionalEdge = function(srcNode, destNode){
  delete this.adjList[srcNode.key].dest[destNode.key];
  delete this.adjList[destNode.key].dest[srcNode.key];
};

//function to check if there is a directed edge between two nodes in the graph
Graph.prototype.hasDirectedEdge = function(srcNode, destNode) {
  return this.adjList[srcNode.key].dest.hasOwnProperty(destNode.key);
};

//function to add a directed edge between two nodes in the graph
Graph.prototype.addDirectedEdge = function(srcNode, destNode, weight) {
  this.adjList[srcNode.key].dest[destNode.key] = weight;
};

//function to remove a directed edge between two nodes in the graph
Graph.prototype.removeDirectedEdge = function(srcNode, destNode) {
  delete this.adjList[srcNode.key].dest[destNode.key];
};



