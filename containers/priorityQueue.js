//priorityQueue.js


//implementation of a priority queue using binary heap
//this is not the most asymptotically efficient implementation of a priority queue
//fibonacci heap, for example, has better worst case time complexity
//however, the real-world performance of binary heaps can be comparable or better depending on usage:
//-http://stackoverflow.com/questions/3767863/real-world-applications-of-binary-heaps-and-fibonacci-heaps
//-http://stackoverflow.com/questions/504823/has-anyone-actually-implemented-a-fibonacci-heap-efficiently?lq=1


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


//test

var pq = new PriorityQueue();

console.log("push and top test:");
console.log(pq.top()); //null
pq.push(5, 5);
console.log(pq.top());
pq.push(4, 4);
console.log(pq.top());
pq.push(3, 3);
console.log(pq.top());
pq.push(8, 8);
console.log(pq.top());
pq.push(6, 6);
console.log(pq.top());
pq.push(7, 7);
console.log(pq.top());

console.log("empty test:");
console.log(pq.isEmpty()); //false

console.log("update priority test:");
pq.updateValueAtKey(6, function() {
  return 2;
});
console.log(pq.top());
pq.updateValueAtKey(7, function() {
  return 1;
});
console.log(pq.top());
pq.updateValueAtKey(7, function(val) {
  return val + 9;
});
console.log(pq.top());

console.log("pop test:");
console.log(pq.pop());
console.log(pq.pop());
console.log(pq.pop());
console.log(pq.pop());
console.log(pq.pop());
console.log(pq.pop());
console.log(pq.pop()); //null

console.log("empty test:");
console.log(pq.isEmpty()); //true

