/**
 * 1. 闭包基础使用
 */
var a = 1;
var func1 = function() {
  var b = 2;
  var func2 = function() {
    var c = 3;
    alert(b); // 输出：2
    alert(a); // 输出：1
  };
  func2();
  alert(c); // 输出：Uncaught ReferenceError: c is not defined
};
func1();

/**
 * 2. 闭包应用实例：实现一个参数的乘积函数，并且对该函数加入缓存机制；
 */
var mult = (function() {
  var cache = {};
  var calculate = function() {
    // 封闭 calculate 函数
    var a = 1;
    for (var i = 0, l = arguments.length; i < l; i++) {
      a = a * arguments[i];
    }
    return a;
  };
  return function() {
    var args = Array.prototype.join.call(arguments, ",");
    if (args in cache) {
      return cache[args];
    }
    return (cache[args] = calculate.apply(null, arguments));
  };
})();
alert(mult(1, 2, 3)); // 输出： 6
alert(mult(1, 2, 3)); // 输出： 6
