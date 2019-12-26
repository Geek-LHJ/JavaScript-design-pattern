/**
 * 1. 订阅者和售楼处的案例：
 * - 首先要指定好谁充当发布者（比如售楼处）；
 * - 然后给发布者添加一个缓存列表，用于存放回调函数以便通知订阅者（售楼处的花名册）；
 * - 最后发布消息的时候，发布者会遍历这个缓存列表，依次触发里面存放的订阅者回调函数（遍历花名册，挨个发短信）。
 */

// a. 基本实现
var salesOffices = {}; // 定义售楼处
salesOffices.clientList = []; // 缓存列表，存放订阅者的回调函数
salesOffices.listen = function (fn) { // 增加订阅者
  this.clientList.push(fn); // 订阅的消息添加进缓存列表
};
salesOffices.trigger = function () { // 发布消息
  for (var i = 0, fn; fn = this.clientList[i++];) {
    fn.apply(this, arguments); // (2) // arguments 是发布消息时带上的参数
  }
};
salesOffices.listen(function (price, squareMeter) { // 小明订阅消息
  console.log('价格= ' + price);
  console.log('squareMeter= ' + squareMeter);
});
salesOffices.listen(function (price, squareMeter) { // 小红订阅消息
  console.log('价格= ' + price);
  console.log('squareMeter= ' + squareMeter);
});
salesOffices.trigger(2000000, 88); // 输出： 200 万， 88 平方米
salesOffices.trigger(3000000, 110); // 输出： 300 万， 110 平方米

// b. 发布订阅模式的通用实现
// 第一步：把发布订阅的功能提取出来，放在一个单独的对象内
var event = {
  clientList: [],
  listen: function (key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = [];
    }
    this.clientList[key].push(fn); // 订阅的消息添加进缓存列表
  },
  trigger: function () {
    var key = Array.prototype.shift.call(arguments), // (1);
      fns = this.clientList[key];
    if (!fns || fns.length === 0) { // 如果没有绑定对应的消息
      return false;
    }
    for (var i = 0, fn; fn = fns[i++];) {
      fn.apply(this, arguments); // (2) // arguments 是 trigger 时带上的参数
    }
  }
};
// 第二步：定义 installEvent 函数给所有的对象都动态安装发布—订阅功能
var installEvent = function (obj) {
  for (var i in event) {
    obj[i] = event[i];
  }
};
// 测试：给售楼处对象 salesOffices 动态增加发布—订阅功能
var salesOffices = {};
installEvent(salesOffices);
salesOffices.listen('squareMeter88', function (price) { // 小明订阅消息
  console.log('价格= ' + price);
});
salesOffices.listen('squareMeter100', function (price) { // 小红订阅消息
  console.log('价格= ' + price);
});
salesOffices.trigger('squareMeter88', 2000000); // 输出： 2000000
salesOffices.trigger('squareMeter100', 3000000); // 输出： 3000000

/**
 * 2. 取消订阅的事件
 */

event.remove = function (key, fn) {
  var fns = this.clientList[key];
  if (!fns) { // 如果 key 对应的消息没有被人订阅，则直接返回
    return false;
  }
  if (!fn) { // 如果没有传入具体的回调函数，表示需要取消 key 对应消息的所有订阅
    fns && (fns.length = 0);
  } else {
    for (var l = fns.length - 1; l >= 0; l--) { // 反向遍历订阅的回调函数列表
      var _fn = fns[l];
      if (_fn === fn) {
        fns.splice(l, 1); // 删除订阅者的回调函数
      }
    }
  }
};
var salesOffices = {};
var installEvent = function (obj) {
  for (var i in event) {
    obj[i] = event[i];
  }
}
installEvent(salesOffices);
salesOffices.listen('squareMeter88', fn1 = function (price) { // 小明订阅消息
  console.log('价格= ' + price);
});
salesOffices.listen('squareMeter88', fn2 = function (price) { // 小红订阅消息
  console.log('价格= ' + price);
});
salesOffices.remove('squareMeter88', fn1); // 删除小明的订阅
salesOffices.trigger('squareMeter88', 2000000); // 输出： 2000000


/**
 * 3. 全局的发布订阅对象:
 * a 模块里面有一个按钮，每次点击按钮之后， b 模块里的 div 中会显示按钮的总点击次数，
 * 用全局发布—订阅模式完成下面的代码，使得 a 模块和 b 模块可以在保持封装性的前提下进行通信。
 */
var a = (function () {
  var count = 0;
  var button = document.getElementById('count');
  button.onclick = function () {
    Event.trigger('add', count++);
  }
})();
var b = (function () {
  var div = document.getElementById('show');
  Event.listen('add', function (count) {
    div.innerHTML = count;
  });
})();