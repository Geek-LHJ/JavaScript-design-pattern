/**
 * 1. 实例：具有缓存效果的计算乘积的函数
 */

var mult = (function() {
  var cache = {};
  return function() {
    var args = Array.prototype.join.call(arguments, ",");
    if (cache[args]) {
      return cache[args];
    }
    var a = 1;
    for (var i = 0, l = arguments.length; i < l; i++) {
      a = a * arguments[i];
    }
    return (cache[args] = a);
  };
})();
mult(1, 2, 3); // 输出： 6
