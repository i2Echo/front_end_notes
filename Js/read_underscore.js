//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

//=====underscore.js源码解读=========

/**
 * 这里函数写法采用了匿名自执行函数，将函数内部变量绑定到全局变量(window or global)产生了闭包，避免污染全局变量；
 * 将this(即浏览器端window,node服务端global)传入函数改变作用域；
 */
(function(){

  // 将this赋值给变量root，这里root的指向是`window` in the browser,
  // or `exports` on the server(node)
  var root = this;
  // 保存`_`的先前值，避免被覆盖
  var previousUnderscore = root._;
}.call(this));