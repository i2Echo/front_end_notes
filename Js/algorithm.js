/* ==常用js算法合集==
** author: kujhon
**
*/
"use strict";

/**
 * 功能：获取[n,m]间的随机数
 * @param {*Number} max
 * @param {*Number} min
 */
const getRandomNum = (max, min) => {
  return Math.floor( Math.random()*(max-min+1) ) + 1;
}

/**
 * 功能：检测回文
 * @param {*String} str
 */
const checkPalindrom = str => {
  return str == str.split("").reverse().join("");
}

/**
 * 功能：获取最多重复字符
 * @param {*String} str
 */
const findMaxDuplicateChar = str => {
  if(str.length == 1) {return str;}
  let obj = {};
  for( let i=0; i<str.length; i++) {
    if(!obj[str.charAt(i)]) {
      obj[str.charAt(i)] = 1;
    }else{
      obj[str.charAt(i)] += 1;
    }
  }
  let maxChars = [],
  maxValue = 1;
  for (let key in obj) {
    if (obj[key] > maxValue) {
      maxChars = [];
      maxChars.push(key);
      maxValue = obj[key];
    }else if(obj[key] == maxValue) {
      maxChars.push(key);
    }
  }

  return maxChars.join(",");
}

/**
 * 功能：数组去重
 * @param {*Array} arr
 * @return {*Array} data
 */
const unique = arr => {
  let hashTable = {};
  let data = [];
  for(let i=0; i<arr.length; i++) {
    if(!hashTable[arr[i]]) {
      hashTable[arr[i]] = true;
      data.push(arr[i]);
    }
  }

  return data;
}

/**
 * 功能：冒泡排序
 * @param {*Array} arr
 */
const bubbleSort = arr => {
  for(let i=0, len=arr.length; i<len-1; i++)
    for(let j=i+1; j<len; j++) {
      if(arr[i] > arr[j]) {
        let swap = arr[i];
        arr[i] = arr[j];
        arr[j] = swap;
      }
  }

  return arr;
}

/**
 * 功能：快速排序
 * @param {*Array} arr
 */
const quickSort = function(arr) {
  if(arr.length <= 1)
    return arr;
  let leftArr = [],
  rightArr = [],
  mid = arr[0];
  for(let i=1; i<arr.length; i++) {
    if(arr[i] < mid){
      leftArr.push(arr[i]);
    }else{
      rightArr.push(arr[i]);
    }
  }

  return [].concat(quickSort(leftArr), [mid], quickSort(rightArr));
}

// let arr = [19,4,21,6,13,11,7,7,1,33,443,3,5,5];
// let[u, b, q] = [unique(arr), bubbleSort(arr), quickSort(arr)];
// console.log(u, b, q);
// let str = 'abcba';
// console.log(checkPalindrom(str), findMaxDuplicateChar(str));

/**
 * 功能：变量值交换 a,b为正整数
 * @param {*Number} a
 * @param {*Number} b
 */
const swap = (a, b) => {
  b = b - a;
  a = a + b;
  b = a - b;

  return [a, b];
}
const swap1 = (a, b) => {
  a = a^b;
  b = a^b;
  a = a^b;

  return [a, b];
}
// console.log(swap1(1, 4));

/**
 * 功能：生成斐波那契数列，非递归
 * @param {*Number} n
 */
const fabonacci = n => {
  let faboArr = [];
  let i = 0;
  while(i < n){
    if(i <= 1) {
      faboArr.push(i);
    }else {
      faboArr.push(faboArr[i-2] + faboArr[i-1]);
    }
    i++;
  }
  return faboArr;
}
/**
 * 功能：生成斐波那契数 递归
 * @param {*Number} n
 */
const fabonacci1 = function(n){
  if(n <= 1) {
    return n;
  } else {
    return fabonacci1(n-2) + fabonacci1(n-1);
  }
}
console.log(fabonacci1(9));
