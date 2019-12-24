/**
 * 1. 实例：判断数据的类型
 * */

// 方式 1. 基本实现
var isString = function(obj) {
  return Object.prototype.toString.call(obj) === "[object String]";
};
var isArray = function(obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
};
var isNumber = function(obj) {
  return Object.prototype.toString.call(obj) === "[object Number]";
};
// 方式 2：字符串作为参数，进行函数封装
var isType = function(type) {
  return function(obj) {
    return Object.prototype.toString.call(obj) === "[object " + type + "]";
  };
};
var isString = isType("String");
var isArray = isType("Array");
var isNumber = isType("Number");
console.log(isArray([1, 2])); // 输出： true
// 方式 3：用循环语句，来批量注册 isType 函数
var Type = {};
for (var i = 0, type; (type = ["String", "Array", "Number"][i++]); ) {
  (function(type) {
    Type["is" + type] = function(obj) {
      return Object.prototype.toString.call(obj) === "[object " + type + "]";
    };
  })(type);
}
Type.isArray([]); // 输出： true
Type.isString("str"); // 输出： true

/**
 * 2. 实例：单例模式：既把函数当作参数传递，又让函数执行后返回了另外一个函数；
 * */

var getSingle = function(fn) {
  var ret;
  return function() {
    return ret || (ret = fn.apply(this, arguments));
  };
};
