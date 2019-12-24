/**
 * 1. call 和 apply 基本使用:
 */
var obj1 = { name: "aaa" };
var obj2 = { name: "bbb" };
window.name = "window";
var getName = function() {
  alert(this.name);
};
getName(); // 输出: window
getName.call(obj1); // 输出: aaa
getName.call(obj2); // 输出: bbb

/**
 * 2. Function.prototype.bind 函数模拟实现:
 */
Function.prototype.bind = function(context) {
  var self = this; // 保存原函数
  return function() {
    // 返回一个新的函数
    return self.apply(context, arguments); // 执行新的函数的时候，会把之前传入的 context 当作新函数体内的 this
  };
};
var obj = { name: "aaa" };
var func = function() {
  alert(this.name); // 输出： aaa
}.bind(obj);
func(); // 输出： aaa
