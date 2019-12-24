/**
 * 1. 实例：使用装饰函数实现 window.onload 函数功能扩展
 */
Function.prototype.after = function(afterfn) {
  var __self = this;
  return function() {
    var ret = __self.apply(this, arguments);
    afterfn.apply(this, arguments);
    return ret;
  };
};
window.onload = (window.onload || function() {}).after(function() {
  console.log(document.getElementsByTagName("*").length);
});

/**
 * 2. 用对象的多态性消除条件分支，实例：动物发出叫声的例子
 */

// a. 使用 if-else 基本实现
var makeSound = function(animal) {
  if (animal instanceof Duck) {
    console.log("嘎嘎嘎");
  } else if (animal instanceof Chicken) {
    console.log("咯咯咯");
  }
};
var Duck = function() {};
var Chicken = function() {};
makeSound(new Duck()); // 输出：嘎嘎嘎
makeSound(new Chicken()); // 输出：咯咯咯
// b. 利用对象的多态性重构代码
var makeSound = function(animal) {
  animal.sound();
};
var Duck = function() {};
Duck.prototype.sound = function() {
  console.log("嘎嘎嘎");
};
var Chicken = function() {};
Chicken.prototype.sound = function() {
  console.log("咯咯咯");
};
makeSound(new Duck()); // 嘎嘎嘎
makeSound(new Chicken()); // 咯咯咯
