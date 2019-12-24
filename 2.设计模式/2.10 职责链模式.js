/**
 * 1. 职责链模式：商城优惠券实例
 */
// a. 代码基本实现
var order = function(orderType, pay, stock) {
  if (orderType === 1) {
    // 500 元定金购买模式
    if (pay === true) {
      // 已支付定金
      console.log("500 元定金预购, 得到 100 优惠券");
    } else {
      // 未支付定金，降级到普通购买模式
      if (stock > 0) {
        // 用于普通购买的手机还有库存
        console.log("普通购买, 无优惠券");
      } else {
        console.log("手机库存不足");
      }
    }
  } else if (orderType === 2) {
    // 200 元定金购买模式
    if (pay === true) {
      console.log("200 元定金预购, 得到 50 优惠券");
    } else {
      if (stock > 0) {
        console.log("普通购买, 无优惠券");
      } else {
        console.log("手机库存不足");
      }
    }
  } else if (orderType === 3) {
    // 普通购买订单
    if (stock > 0) {
      console.log("普通购买, 无优惠券");
    } else {
      console.log("手机库存不足");
    }
  }
};
order(1, true, 500); // 输出： 500 元定金预购, 得到 100 优惠券

// b. 用职责链模式重构代码
// 500 元订单
var order500 = function(orderType, pay, stock) {
  if (orderType === 1 && pay === true) {
    console.log("500 元定金预购, 得到 100 优惠券");
  } else {
    order200(orderType, pay, stock); // 将请求传递给 200 元订单
  }
};
// 200 元订单
var order200 = function(orderType, pay, stock) {
  if (orderType === 2 && pay === true) {
    console.log("200 元定金预购, 得到 50 优惠券");
  } else {
    orderNormal(orderType, pay, stock); // 将请求传递给普通订单
  }
};
// 普通购买订单
var orderNormal = function(orderType, pay, stock) {
  if (stock > 0) {
    console.log("普通购买, 无优惠券");
  } else {
    console.log("手机库存不足");
  }
};
// 测试：
order500(1, true, 500); // 输出： 500 元定金预购, 得到 100 优惠券
order500(1, false, 500); // 输出：普通购买, 无优惠券
order500(2, true, 500); // 输出： 200 元定金预购, 得到 500 优惠券
order500(3, false, 500); // 输出：普通购买, 无优惠券
order500(3, false, 0); // 输出：手机库存不足

// c.灵活可拆分的职责链节点
var order500 = function(orderType, pay, stock) {
  if (orderType === 1 && pay === true) {
    console.log("500 元定金预购，得到 100 优惠券");
  } else {
    return "nextSuccessor"; // 不用知道下一个节点是谁，反正把请求往后面传递
  }
};
var order200 = function(orderType, pay, stock) {
  if (orderType === 2 && pay === true) {
    console.log("200 元定金预购，得到 50 优惠券");
  } else {
    return "nextSuccessor"; // 不用知道下一个节点是谁，反正把请求往后面传递
  }
};
var orderNormal = function(orderType, pay, stock) {
  if (stock > 0) {
    console.log("普通购买，无优惠券");
  } else {
    console.log("手机库存不足");
  }
};
var Chain = function(fn) {
  this.fn = fn;
  this.successor = null;
};
Chain.prototype.setNextSuccessor = function(successor) {
  return (this.successor = successor);
};
Chain.prototype.passRequest = function() {
  var ret = this.fn.apply(this, arguments);
  if (ret === "nextSuccessor") {
    return (
      this.successor &&
      this.successor.passRequest.apply(this.successor, arguments)
    );
  }
  return ret;
};
// 把 3 个订单函数分别包装成职责链的节点：
var chainOrder500 = new Chain(order500);
var chainOrder200 = new Chain(order200);
var chainOrderNormal = new Chain(orderNormal);
// 指定节点在职责链中的顺序：
chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);
// 最后把请求传递给第一个节点：
chainOrder500.passRequest(1, true, 500); // 输出： 500 元定金预购，得到 100 优惠券
chainOrder500.passRequest(2, true, 500); // 输出： 200 元定金预购，得到 50 优惠券
chainOrder500.passRequest(3, true, 500); // 输出：普通购买，无优惠券
chainOrder500.passRequest(1, false, 0); // 输出：手机库存不足

/**
 * 2. 用 AOP (面向切面编程)实现职责链：
 */
Function.prototype.after = function(fn) {
  var self = this;
  return function() {
    var ret = self.apply(this, arguments);
    if (ret === "nextSuccessor") {
      return fn.apply(this, arguments);
    }
    return ret;
  };
};
var order = order500yuan.after(order200yuan).after(orderNormal);
order(1, true, 500); // 输出： 500 元定金预购，得到 100 优惠券
order(2, true, 500); //  输出： 200 元定金预购，得到 50 优惠券
order(1, false, 500); // 输出：普通购买，无优惠券
