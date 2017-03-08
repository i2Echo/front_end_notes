'use strict';

/**
 * 
 * @param {*Number} max 
 * @param {*Number} min 
 */
let getRandomNum = function(max, min){
  return Math.floor( Math.random()*(max-min+1) ) + 1;
}


const MAX = 10;
const MIN = 1;

let num = getRandomNum(MAX, MIN);
console.log(num);
