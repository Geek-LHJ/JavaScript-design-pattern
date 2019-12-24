/**
 * 1. 图片预加载：不用代理的预加载图片函数实现
 */

var MyImage = (function() {
  var imgNode = document.createElement("img");
  document.body.appendChild(imgNode);
  var img = new Image();
  img.onload = function() {
    imgNode.src = img.src;
  };
  return {
    setSrc: function(src) {
      imgNode.src = "file:///C:/Users/svenzeng/Desktop/loading.gif";
      img.src = src;
    }
  };
})();
MyImage.setSrc("http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg");

/**
 * 2. 图片预加载：使用虚拟代理实现图片预加载
 */
var myImage = (function() {
  var imgNode = document.createElement("img");
  document.body.appendChild(imgNode);
  return {
    setSrc: function(src) {
      imgNode.src = src;
    }
  };
})();
// 代理对象,在图片被真正加载好之前，页面中将出现一张占位的图 loading.gif, 来提示图片正在加载
var proxyImage = (function() {
  var img = new Image();
  img.onload = function() {
    myImage.setSrc(this.src);
  };
  return {
    setSrc: function(src) {
      myImage.setSrc("file:///C:/Users/admin/Desktop/loading.gif");
      img.src = src;
    }
  };
})();
proxyImage.setSrc("http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg");

/**
 * 3. 使用虚拟代理合并 HTTP 请求
 */
var synchronousFile = function(id) {
  console.log("开始同步文件， id 为: " + id);
};
var proxySynchronousFile = (function() {
  var cache = [], // 保存一段时间内需要同步的 ID
    timer; // 定时器
  return function(id) {
    cache.push(id);
    if (timer) {
      // 保证不会覆盖已经启动的定时器
      return;
    }
    timer = setTimeout(function() {
      synchronousFile(cache.join(",")); // 2 秒后发送需要同步的 ID 集合
      clearTimeout(timer); // 清空定时器
      timer = null;
      cache.length = 0; // 清空 ID 集合
    }, 2000);
  };
})();
var checkbox = document.getElementsByTagName("input");
for (var i = 0, c; (c = checkbox[i++]); ) {
  c.onclick = function() {
    if (this.checked === true) {
      proxySynchronousFile(this.id);
    }
  };
}

/**
 * 4. 缓存代理：实现计算乘积
 */
var mult = function() {
  var a = 1;
  for (var i = 0, l = arguments.length; i < l; i++) {
    a = a * arguments[i];
  }
  return a;
};
var proxyMult = (function() {
  var cache = {};
  return function() {
    var args = Array.prototype.join.call(arguments, ",");
    if (args in cache) {
      return cache[args];
    }
    return (cache[args] = mult.apply(this, arguments));
  };
})();
proxyMult(1, 2, 3, 4); // 输出： 24
proxyMult(1, 2, 3, 4); // 输出： 24

/**
 * 5. 使用高阶函数动态创建代理：为乘法、加法、减法等创建缓存代理
 */
// 乘积函数
var mult = function() {
  var a = 1;
  for (var i = 0, l = arguments.length; i < l; i++) {
    a = a * arguments[i];
  }
  return a;
};
// 加和函数
var plus = function() {
  var a = 0;
  for (var i = 0, l = arguments.length; i < l; i++) {
    a = a + arguments[i];
  }
  return a;
};
// 创建缓存代理的工厂函数
var createProxyFactory = function(fn) {
  var cache = {};
  return function() {
    var args = Array.prototype.join.call(arguments, ",");
    if (args in cache) {
      return cache[args];
    }
    return (cache[args] = fn.apply(this, arguments));
  };
};
var proxyMult = createProxyFactory(mult),
  proxyPlus = createProxyFactory(plus);
alert(proxyMult(1, 2, 3, 4)); // 输出： 24
alert(proxyPlus(1, 2, 3, 4)); // 输出： 10
