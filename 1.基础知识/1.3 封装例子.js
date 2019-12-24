/**
 * 封装数据：使用函数来创建作用域
 */
var myObject = (function() {
  var __name = "aaa"; // 私有（ private）变量
  return {
    getName: function() {
      // 公开（ public）方法
      return __name;
    }
  };
})();
console.log(myObject.getName()); // 输出： aaa
console.log(myObject.__name); // 输出： undefined
