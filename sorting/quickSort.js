//quickSort.js

//implementation of quick sort
var quickSort = function(array, comparator) {

  //default sort order to ascending
  if(typeof(comparator) !== "function")
  {
    comparator = function(a, b) {
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

  //function to swap two elements in the array
  var swap = function(i, j) {
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  };

  //function that moves elements less than the pivot to the left
  //and elements greater than the pivot to the right by performing swaps (assuming ascending sort order)
  //the returned index represents the position where all elements to the left and including
  //that position must be less than or equal to the pivot, and all elements to the right of
  //that position must be greater than or equal to the pivot
  var partition = function(low, high) {
    var pivot = array[low]; //just select the leftmost element as the pivot (though this causes n^2 runtime for already sorted arrays)

    while(low < high) //continue while low is less than high
    {
      while(comparator(array[low], pivot) < 0) //don't swap elements left of the pivot that are already in the correct place
        ++low;
      while(comparator(array[high], pivot) > 0) //don't swap elements right of the pivot that are already in the correct place
        --high;
      if(low < high) //perform a swap if the low index is still less than the high index
      {
        swap(low, high--);
        //don't do low++ since that will cause an edge case
        //ie. for array [6, 26, 6, 10] and pivot 6, when low equals 0 and high equals 2,
        //the 6's will get swapped but then low and high will become 1 and
        //the loop will end since the indices would be the same
        //in this case, 26 would still be in position 1 so it would violate the rule
        //that anything up to and including the returned position is less than or equal to the pivot
      }
    }

    return high; //return the index that represents where to partition
  };
  
  //recursive function to split the array 
  var recursiveHelper = function(low, high) {
    //partition the array so that elements are in their correct position relative to the pivot
    //then keep recursively splitting the array by the partition index

    if(low >= high)
      return;

    var partitionIndex = partition(low, high);
    recursiveHelper(low, partitionIndex);
    recursiveHelper(partitionIndex + 1, high);
    
  };

  recursiveHelper(0, array.length - 1);
 
  return array;
  
};


//sort ascending order
console.log(quickSort([1]));
console.log(quickSort([1, 2]));
console.log(quickSort([2, 1]));
console.log(quickSort([1, 2, 3, 4, 5, 6]));
console.log(quickSort([4, 5, 6, 1, 2, 3]));
console.log(quickSort([6, 5, 4, 3, 2, 1]));
console.log(quickSort([3, 2, 1, 6, 5, 4]));
console.log(quickSort([4, 5, 6, 1, 2, 3]));
console.log(quickSort([5, 6, 3, 4, 1, 2]));
console.log(quickSort([3, 2, 1, 7, 8, 9, 19]));
console.log(quickSort([3, 5, 7, 7, 6, 8, 19]));
console.log(quickSort([3, 6, 7, 7, 5, 8, 19]));
console.log(quickSort([2, 2, 2, 2, 1, 2, 2, 2]));
console.log(quickSort([6, 26, 6, 10]));
console.log(quickSort([19, 28, 9, 10, 6, 16, 8, 1, 4, 24, 10, 2, 8, 3, 9, 13, 4, 10, 19, 1, 8, 18, 1, 5, 10, 17, 6, 26, 6, 10]));


//sort descending order
var comparator = function(a, b) {
  if(a < b)
  {
    return 1;
  }

  if(a > b)
  {
    return -1;
  }

  return 0;
};

console.log(quickSort([1], comparator));
console.log(quickSort([1, 2], comparator));
console.log(quickSort([2, 1], comparator));
console.log(quickSort([1, 2, 3, 4, 5, 6], comparator));
console.log(quickSort([4, 5, 6, 1, 2, 3], comparator));
console.log(quickSort([6, 5, 4, 3, 2, 1], comparator));
console.log(quickSort([3, 2, 1, 6, 5, 4], comparator));
console.log(quickSort([4, 5, 6, 1, 2, 3], comparator));
console.log(quickSort([5, 6, 3, 4, 1, 2], comparator));
console.log(quickSort([3, 2, 1, 7, 8, 9, 19], comparator));
console.log(quickSort([3, 5, 7, 7, 6, 8, 19], comparator));
console.log(quickSort([3, 6, 7, 7, 5, 8, 19], comparator));
console.log(quickSort([2, 2, 2, 2, 1, 2, 2, 2], comparator));
console.log(quickSort([6, 26, 6, 10], comparator));
console.log(quickSort([19, 28, 9, 10, 6, 16, 8, 1, 4, 24, 10, 2, 8, 3, 9, 13, 4, 10, 19, 1, 8, 18, 1, 5, 10, 17, 6, 26, 6, 10], comparator));


