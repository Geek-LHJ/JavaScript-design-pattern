/**
 * 1. 策略模式实例： 积分模式（基础分乘上对于的等级倍数）
 */

// a. 最简单代码实现
var calculateBonus = function(level, base) {
  if (level === "S") {
    return base * 4;
  }
  if (level === "A") {
    return base * 3;
  }
};
calculateBonus("B", 10); // 输出： 40
calculateBonus("S", 5); // 输出： 15

// b. 模仿传统面向对象语言中的策略模式实现
var performanceS = function() {};
performanceS.prototype.calculate = function(base) {
  return base * 4;
};
var performanceA = function() {};
performanceA.prototype.calculate = function(base) {
  return base * 3;
};
// 定义总分类 Bonus：
var Bonus = function() {
  this.base = null; // 原始值
  this.strategy = null; // 等级对应的策略对象
};
Bonus.prototype.setSalary = function(base) {
  this.base = base; // 设置基础值
};
Bonus.prototype.setStrategy = function(strategy) {
  this.strategy = strategy; // 设置等级对应的策略对象
};
Bonus.prototype.getBonus = function() {
  // 取得总分数
  return this.strategy.calculate(this.base); // 把计算分数的操作委托给对应的策略对象
};

// c. JavaScript 版本的策略模式
var strategies = {
  S: function(base) {
    return base * 4;
  },
  A: function(base) {
    return base * 3;
  }
};
var calculateBonus = function(level, base) {
  return strategies[level](base);
};
console.log(calculateBonus("S", 10)); // 输出： 40
console.log(calculateBonus("A", 5)); // 输出： 15

/**
 * 2. 策略模式实现表单校验
 * */

// 步骤1. 封装策略对象
var strategies = {
  isNonEmpty: function(value, errorMsg) {
    // 不为空
    if (value === "") {
      return errorMsg;
    }
  },
  minLength: function(value, length, errorMsg) {
    // 限制最小长度
    if (value.length < length) {
      return errorMsg;
    }
  },
  isMobile: function(value, errorMsg) {
    // 手机号码格式
    if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
      return errorMsg;
    }
  }
};
// 步骤2. 实现 Validator 类(作为 Context，负责接收用户的请求并委托给 strategy 对象)
var Validator = function() {
  this.cache = []; // 保存校验规则
};
Validator.prototype.add = function(dom, rule, errorMsg) {
  var ary = rule.split(":"); // 把 strategy 和参数分开
  this.cache.push(function() {
    // 把校验的步骤用空函数包装起来，并且放入 cache
    var strategy = ary.shift(); // 用户挑选的 strategy
    ary.unshift(dom.value); // 把 input 的 value 添加进参数列表
    ary.push(errorMsg); // 把 errorMsg 添加进参数列表
    return strategies[strategy].apply(dom, ary);
  });
};
Validator.prototype.start = function() {
  for (var i = 0, validatorFunc; (validatorFunc = this.cache[i++]); ) {
    var msg = validatorFunc(); // 开始校验，并取得校验后的返回信息
    if (msg) {
      // 如果有确切的返回值，说明校验没有通过
      return msg;
    }
  }
};
// 步骤3. 向 Validator 类发送校验的请求
var validataFunc = function() {
  var validator = new Validator(); // 创建一个 validator 对象
  /***************添加一些校验规则****************/
  validator.add(registerForm.userName, "isNonEmpty", "用户名不能为空");
  validator.add(registerForm.password, "minLength:6", "密码长度不能少于 6 位");
  validator.add(registerForm.phoneNumber, "isMobile", "手机号码格式不正确");
  var errorMsg = validator.start(); // 获得校验结果
  return errorMsg; // 返回校验结果
};

var registerForm = document.getElementById("registerForm");
registerForm.onsubmit = function() {
  var errorMsg = validataFunc(); // 如果 errorMsg 有确切的返回值，说明未通过校验
  if (errorMsg) {
    alert(errorMsg);
    return false; // 阻止表单提交
  }
};
