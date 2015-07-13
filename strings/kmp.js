//kmp.js


//Knuth–Morris–Pratt algorithm for finding a needle string in a haystack string
//this function will return the starting indices of all needle matches in the haystack
var kmp = function(needle, haystack) {

  var createPartialMatchTable = function(str) {

    var partialMatchTable = []; //table consisting of the longest matching prefix and suffix up to each position
    partialMatchTable[0] = 0;

    //index for the input string
    var i = 1;
    //index of the prefix used to help find the length of the longest matching suffix up to i; 
    //ie. for string "abab" at index 3, the longest matching prefix and suffix is "ab" of length 2
    var j = 0;

    while(i < str.length)
    {
      //if the character at the prefix index matches the character at the current index
      //then the length of the matching prefix and suffix should be increased and stored in the table
      if(str[i] === str[j])
      {
        partialMatchTable[i++] = ++j;
      }
      //else if the characters don't match and the prefix index is greater than 0
      //need to set the prefix index back to the prefix index at the position before the prefix index in the table
      //this is to check if the current character can make a suffix that matches a previous prefix
      //ie. for string "aaabaaaa", the final "a" won't make a suffix match to prefix "aaab", but it will make a match to "aaa" 
      else if(j > 0)
      {
        j = partialMatchTable[j - 1];
      }
      //else if the characters don't match and the prefix index is 0
      //then set the length of the longest matching prefix and suffix for the current position to 0
      else
      {
        partialMatchTable[i++] = 0;
      }
    } 

    return partialMatchTable;
  };

  //create partial match table containing the longest matching prefix and suffix up to each position
  var partialMatchTable = createPartialMatchTable(needle);

  var indicesOfMatchingNeedles = []; //array of starting indices where needles are found in the haystack
  var i = 0; //index for haystack
  var j = 0; //index for needle; the index of the needle will indicate how much of a match is currently found

  //search for needle matches in the haystack
  //can think of the needle as a DFA with each character as a state
  //a character match (iterating through haystack and comparing each character to the character at the needle index) will go to the next character state
  //a character mismatch will make the next state be the character at the end of the longest prefix with a matching suffix up to the needle index
  //and subsequent mismatches will keep moving the state back to a previous state until the initial state is reached
  //ie. for needle "abcabd" and haystack "abcabe", the DFA will get to the latter "b", 
  //but will eventually be reset back to the initial "a" state because "d" and "e" don't match and "c" and "e" don't match
  //if the haystack was "abcabc" for the above needle, then the DFA would go to state "c" since "d" doesn't match "c" but "c" matches "c"
  while(i < haystack.length)
  {
    //if the character at the needle index matches the character at the current index
    //then increment both of their indices
    if(haystack[i] === needle[j])
    {
      ++i;
      ++j;
    }

    //if the needle index has reached the length of the needle
    //then push the starting index of the needle match into the array to indicate that a match has been found
    //then reset j to the index at the position before j in the table
    //this is to check if the previously seen characters could contain a prefix in the subsequent needle
    //ie. for needle "abcab" and haystack "abcabcab", there are two needle matches and the initial needle will contain prefix "ab" in the subsequent needle
    if(j === needle.length)
    {
      indicesOfMatchingNeedles.push(i - j);
      j = partialMatchTable[j - 1];
    }
    //else if the needle index has not reached the length of the needle
    //and the character at the needle index does not match the character at the current index
    else if(i < haystack.length && haystack[i] !== needle[j])
    {
      //if j (the needle index) is greater than 0,
      //then reset j to the index at the position before j in the table
      //this is to check if the previously seen characters could contain a prefix for a potential needle match
      //ie. for needle "abcabd" and haystack "abcabcabd", the second "abc" is a prefix for the needle match
      if(j > 0)
      {
        j = partialMatchTable[j - 1];
      }
      //else just move to the next character in the haystack
      else
      {
        ++i;
      }
    }
  }

  return indicesOfMatchingNeedles;
};




//no matches
console.log(kmp("abc", "a"));
console.log(kmp("abcd", "abcef"));
console.log(kmp("abcd", "abcabc"));
console.log(kmp("abcd", "abceabc"));


//matches
console.log(kmp("a", "aaaaa"));
console.log(kmp("a", "aaabaaaa"));
console.log(kmp("a", "abc"));
console.log(kmp("b", "abc"));
console.log(kmp("c", "abc"));
console.log(kmp("ab", "aaabaaaa"));
console.log(kmp("ab", "aaaaaaab"));
console.log(kmp("ab", "aaabaaab"));
console.log(kmp("abc", "abc"));
console.log(kmp("abc", "abcabc"));
console.log(kmp("abc", "abcdabc"));
console.log(kmp("abc", "abcdabce"));
console.log(kmp("abc", "dsadsadasabcdsadasabcdasa"));
console.log(kmp("abcabd", "abcabcabd"));
console.log(kmp("abcab", "abcabcabcab"));




