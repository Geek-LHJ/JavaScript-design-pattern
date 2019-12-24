// this 的指向可以分为以下 4 种：

/**
 * 1. 作为对象的方法调用：当函数作为对象的方法被调用时， this 指向该对象；
 */
var obj = {
  a: 1,
  getA: function() {
    alert(this === obj); // 输出： true
    alert(this.a); // 输出: 1
  }
};
obj.getA();

/**
 * 2. 作为普通函数调用：this 总是指向全局对象，在浏览器的 JavaScript 里，这个全局对象是 window 对象；
 */

window.name = "globalName";
var myObject = {
  name: "aaa",
  getName: function() {
    return this.name;
  }
};
var getName = myObject.getName;
console.log(getName()); // globalName

/**
 * 3. 构造器调用；构造器里的 this 就指向返回的这个对象；
 * 但用 new 调用构造器时， 如果构造器显式地返回了一个 object 类型的对象，那么此次运算结果最终会返回这个对象，而不是之前期待的 this：
 * */

var MyClass = function() {
  this.name = "aaa";
};
var obj = new MyClass();
alert(obj.name); // 输出： aaa

var MyClass = function() {
  this.name = "aaa";
  return {
    // 显式地返回一个对象
    name: "bbb"
  };
};
var obj = new MyClass();
alert(obj.name); // 输出： bbb

/**
 * 4. `Function.prototype.call` 或 `Function.prototype.apply` 调用；(动态地改变传入函数的 this )
 * */

var obj1 = {
  name: "aaa",
  getName: function() {
    return this.name;
  }
};
var obj2 = {
  name: "bbb"
};
console.log(obj1.getName()); // 输出: aaa
console.log(obj1.getName.call(obj2)); // 输出： bbb
