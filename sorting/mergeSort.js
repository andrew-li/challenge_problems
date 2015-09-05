//mergeSort.js

//implementation of merge sort
var mergeSort = function(array, comparator) {

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
  
  //function to merge two sorted subarrays
  var merge = function(low, mid, high) {

    //create subarray copies to help with merging
    var leftArr = array.slice(low, mid + 1);
    var rightArr = array.slice(mid + 1, high + 1); 
    
    //console.log("merging: ");
    //console.log(low, mid, high);
    //console.log(leftArr);
    //console.log(rightArr);

    //use indices in the subarray copies and the main array
    //to sort the main array from index low to high
    //this will effectively merge the two sorted subarrays
    var i = 0;
    var j = 0;
    var k = low;
    while(i < leftArr.length || j < rightArr.length)
    {
      if(j >= rightArr.length || comparator(leftArr[i], rightArr[j]) < 0)
      {
        array[k] = leftArr[i];
        ++i;      
      }
      else
      {
        array[k] = rightArr[j];
        ++j
      }
      ++k;
    }

    //console.log("merged: ", array.slice(low, high + 1));

  };
  
  //recursive function to split the array
  var recursiveHelper = function(low, high) {
    //keep recursively splitting the array in half until the chunks are of size 1
    //then merge the chunks together

    if(low >= high)
      return;

    var mid = Math.floor((low + high) / 2);
    recursiveHelper(low, mid);
    recursiveHelper(mid + 1, high);
    merge(low, mid, high);
    
  };

  recursiveHelper(0, array.length - 1);
 
  return array;
  
};


//sort ascending order
console.log(mergeSort([1]));
console.log(mergeSort([1, 2]));
console.log(mergeSort([2, 1]));
console.log(mergeSort([1, 2, 3, 4, 5, 6]));
console.log(mergeSort([4, 5, 6, 1, 2, 3]));
console.log(mergeSort([6, 5, 4, 3, 2, 1]));
console.log(mergeSort([3, 2, 1, 6, 5, 4]));
console.log(mergeSort([4, 5, 6, 1, 2, 3]));
console.log(mergeSort([5, 6, 3, 4, 1, 2]));
console.log(mergeSort([3, 2, 1, 7, 8, 9, 19]));
console.log(mergeSort([3, 5, 7, 7, 6, 8, 19]));
console.log(mergeSort([3, 6, 7, 7, 5, 8, 19]));
console.log(mergeSort([2, 2, 2, 2, 1, 2, 2, 2]));
console.log(mergeSort([6, 26, 6, 10]));
console.log(mergeSort([19, 28, 9, 10, 6, 16, 8, 1, 4, 24, 10, 2, 8, 3, 9, 13, 4, 10, 19, 1, 8, 18, 1, 5, 10, 17, 6, 26, 6, 10]));


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

console.log(mergeSort([1], comparator));
console.log(mergeSort([1, 2], comparator));
console.log(mergeSort([2, 1], comparator));
console.log(mergeSort([1, 2, 3, 4, 5, 6], comparator));
console.log(mergeSort([4, 5, 6, 1, 2, 3], comparator));
console.log(mergeSort([6, 5, 4, 3, 2, 1], comparator));
console.log(mergeSort([3, 2, 1, 6, 5, 4], comparator));
console.log(mergeSort([4, 5, 6, 1, 2, 3], comparator));
console.log(mergeSort([5, 6, 3, 4, 1, 2], comparator));
console.log(mergeSort([3, 2, 1, 7, 8, 9, 19], comparator));
console.log(mergeSort([3, 5, 7, 7, 6, 8, 19], comparator));
console.log(mergeSort([3, 6, 7, 7, 5, 8, 19], comparator));
console.log(mergeSort([2, 2, 2, 2, 1, 2, 2, 2], comparator));
console.log(mergeSort([6, 26, 6, 10], comparator));
console.log(mergeSort([19, 28, 9, 10, 6, 16, 8, 1, 4, 24, 10, 2, 8, 3, 9, 13, 4, 10, 19, 1, 8, 18, 1, 5, 10, 17, 6, 26, 6, 10], comparator));


