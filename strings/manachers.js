//manachers.js


//Manacher's Algorithm to find the longest palindrome in a string
//O(n) space and time complexity
//based on the code from http://articles.leetcode.com/2011/11/longest-palindromic-substring-part-ii.html
var manachers = function (string) {
    
  if(string.length <= 1)
    return string;

  //preprocess the string to make even strings have the same properties as odd strings (a # char will be in the middle of an even string instead of no char)
  //^ and $ will help with boundary checking
  //# will be inserted before the first char, after the last char, and between every char
  //abbbc will be ^#a#b#b#b#c#$
  //abbc will be ^#a#b#b#c#$
  var tempArr = ['^'];
  var i;
  for(i = 0; i < string.length; ++i)
  {
    tempArr.push("#" + string.charAt(i));      
  }
  tempArr.push('#$');
  var processedStr = tempArr.join('');
  
  //array that will hold the length of every palindrome (the length is actually the number of equivalent chars surrounding a center in the preprocessed string)
  var palinLengths = [];
  
  //assume that there is an outer palindrome with a center in the middle position
  //i will be an index to the right of the center while mirrorIndex will be the corresponding index to the left of the center
  //i and mirrorIndex will represent the center of two palindromes contained in the outer palindrome
  //rightBound represents the index at which the outer palindrome ends
  //the palindrome length of every index before the center will have already been computed
  //the length of every palindrome with i as its center must be equal to (with an exception listed below) 
  //  the length of palindrome with the mirroring index as its center, so the value at palinLengths[mirrorIndex] can be copied into palinLengths[i]
  //c|abacaba|s
  //s|abacaba|c
  //in the above examples with c as the center of the palindrome, when i points to the letter b in the right side of the palindrome, 
  //  the only thing that can be said about the lengh of the palindrome with the letter b as its center is that it must be atleast length three 
  //  (the rightBound is used to determine this)
  //the function must look past the right bound in order to determine if the palindrome is greater than length three, 
  //  in which case the center variable is updated to the center of this palindrome
  //in the first example, the palindrome with center at letter b is length three 
  //in the second example, the palindrome is length five
  var center = 0;
  var rightBound = 0;
  var mirrorIndex = 0;
  for(i = 1; i < processedStr.length; ++i)
  {
    //the mirror index will be the same distance to the left as i is to the right of the center  
    //so center - mirrorIndex = i - center => mirrorIndex = 2 * center - i 
    mirrorIndex = 2 * center - i;

    //copy the length of palindrome with center at mirrorIndex into the array position holding the length of the palindrome with center at index
    //however, the copied length cannot be greater than the length of the center to the left bound (same as right bound minus center)
    palinLengths[i - 1] = (rightBound > i) ? Math.min(rightBound - i, palinLengths[mirrorIndex - 1]) : 0;
  
    //see if the palindrome with center at i can grow any longer and update its length
    while(processedStr[i + 1 + palinLengths[i - 1]] === processedStr[i - 1 - palinLengths[i - 1]])
      ++palinLengths[i - 1];
  
    //if the expansion of the palindrome with center i goes past the right bound of the old palindrome,
    //then set the center variable to the center of this palindrome and readjust the right bound
    if(i + palinLengths[i - 1] > rightBound)
    {
      center = i;
      rightBound = i + palinLengths[i - 1];
    }
  }

  //find the center index and length of the longest palindrome
  var lengthOfLongestPalindrome = 0;
  var centerOfLongestPalindrome = 0;
  for(i = 0; i < processedStr.length; ++i)
  {
    if(palinLengths[i] > lengthOfLongestPalindrome)
    {
      lengthOfLongestPalindrome = palinLengths[i];
      centerOfLongestPalindrome = i;
    }
  }

  //perform some math to get the substring representing the longest palindrome
  return string.substr((centerOfLongestPalindrome - lengthOfLongestPalindrome) / 2, lengthOfLongestPalindrome);
};


console.log(manachers("a"));
console.log(manachers("ab"));
console.log(manachers("aba"));
console.log(manachers("aaa"));
console.log(manachers("abcdefgfedcba"));
console.log(manachers("dsadasdsadasabcdefgfedcbadsadas"));
console.log(manachers("abaabba"));
console.log(manachers("abaabcbaf"));
console.log(manachers("abaabcbaab"));



