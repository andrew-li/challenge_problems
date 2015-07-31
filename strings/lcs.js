//lcs.js

//solution for finding the longest common subsequence between two strings
var lcs = function(s1, s2) {
  
  //keep table of (m + 1) x (n + 1) size, where m = size of s1 and n = size of s2
  //prepopulate first column of table with 0's
  var table = []; 
  for(var i = 0; i <= s1.length; ++i)
  {
    table[i] = [];
    table[i][0] = 0;
  }

  //prepopulate first row of table with 0's
  for(var i = 1; i <= s2.length; ++i)
  {
    table[0][i] = 0;
  }

  //the algorithm is to keep the length of the lcs up to position i in s1 and position j in s2
  //and use the stored lengths to calculate future lengths when a character match is found
  for(var i = 0; i < s1.length; ++i)
  {
    for(var j = 0; j < s2.length; ++j)
    {
      //assume the current table position is (i + 1, j + 1)
      //if characters at current position in strings match, then set current table position to the value of the upper left position + 1
      if(s1.charAt(i) === s2.charAt(j))
      {
        table[i + 1][j + 1] = table[i][j] + 1;
      }
      //if the characters don't match, then take the max between the values in the positions to the left and above the current position in the table
      else
      {
        table[i + 1][j + 1] = Math.max(table[i + 1][j], table[i][j + 1]);
      }
    }
  }

  var lcsString = [];
  var i = s1.length;
  var j = s2.length;
  var length = table[i][j];
  while(length > 0)
  {
    //go to the left if there is a matching length
    //this means that the characters don't match at the current positions in the strings
    if(table[i][j - 1] === length)
    {
      --j;
    }
    //go up if there is matching length
    //this means that the characters don't match at the current positions in the strings    
    else if(table[i - 1][j] === length)
    {
      --i;
    }   
    //otherwise, go to the upper left diagonal position
    //this means that there is a matching character at the current positions in the strings
    //so the character should be stored into the lcs string
    else
    {
      lcsString[length - 1] = s1.charAt(i - 1);
      --i;    
      --j;  
    }
    length = table[i][j];
  }

  return lcsString.join("");
};


console.log(lcs("a", "b") === "");
console.log(lcs("ab", "ab") === "ab");
console.log(lcs("ab", "abc") === "ab");
console.log(lcs("abc", "ab") === "ab");
console.log(lcs("abc", "acb") === "ac");
console.log(lcs("aggtab", "gxtxyab") === "gtab");
console.log(lcs("abcdgh", "aedfhr") === "adh");
console.log(lcs("thisisatest", "testing123testing") === "tsitest");
console.log(lcs("abhfdgcabfdg", "acbxkgjadblgd") === "abgadg");


