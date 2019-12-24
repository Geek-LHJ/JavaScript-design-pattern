/**
 * 1. 代理模式：图片预加载示例，增加虚拟代理的方式，把预加载图片的职责放到代理对象中，
 * 而本体仅仅负责往页面中添加 img 标签，这也是它最原始的职责；
 */
// myImage 负责往页面中添加 img 标签：
var myImage = (function() {
  var imgNode = document.createElement("img");
  document.body.appendChild(imgNode);
  return {
    setSrc: function(src) {
      imgNode.src = src;
    }
  };
})();
// proxyImage 负责预加载图片，并在预加载完成之后把请求交给本体 myImage：
var proxyImage = (function() {
  var img = new Image();
  img.onload = function() {
    myImage.setSrc(this.src);
  };
  return {
    setSrc: function(src) {
      myImage.setSrc("file:// /C:/Users/svenzeng/Desktop/loading.gif");
      img.src = src;
    }
  };
})();
proxyImage.setSrc("http:// imgcache.qq.com/music/photo/000GGDys0yA0Nk.jpg");

/**
 * 2. 迭代器模式，实例：先遍历一个集合，然后往页面中添加一些 div，
 * 这些 div 的 innerHTML 分别对应集合里的元素；
 */

// a. 基本实现
var appendDiv = function(data) {
  for (var i = 0, l = data.length; i < l; i++) {
    var div = document.createElement("div");
    div.innerHTML = data[i];
    document.body.appendChild(div);
  }
};
appendDiv([1, 2, 3, 4, 5, 6]);
// b. SRP 原则实现
var each = function(obj, callback) {
  var value,
    i = 0,
    length = obj.length,
    isArray = isArraylike(obj); // isArraylike 函数未实现，可以翻阅 jQuery 源代码
  if (isArray) {
    // 迭代类数组
    for (; i < length; i++) {
      callback.call(obj[i], i, obj[i]);
    }
  } else {
    for (i in obj) {
      // 迭代 object 对象
      value = callback.call(obj[i], i, obj[i]);
    }
  }
  return obj;
};

var appendDiv = function(data) {
  each(data, function(i, n) {
    var div = document.createElement("div");
    div.innerHTML = n;
    document.body.appendChild(div);
  });
};

appendDiv([1, 2, 3, 4, 5, 6]);
appendDiv({ a: 1, b: 2, c: 3, d: 4 });

/**
 * 3. 单例模式：惰性单例创建唯一一个登录窗 div 的示例；
 */
// a. 基本实现
var createLoginLayer = (function() {
  var div;
  return function() {
    if (!div) {
      div = document.createElement("div");
      div.innerHTML = "我是登录浮窗";
      div.style.display = "none";
      document.body.appendChild(div);
    }
    return div;
  };
})();
// b. SRP 原则实现
var getSingle = function(fn) {
  // 获取单例
  var result;
  return function() {
    return result || (result = fn.apply(this, arguments));
  };
};
var createLoginLayer = function() {
  // 创建登录浮窗
  var div = document.createElement("div");
  div.innerHTML = "我是登录浮窗";
  document.body.appendChild(div);
  return div;
};
var createSingleLoginLayer = getSingle(createLoginLayer);
var loginLayer1 = createSingleLoginLayer();
var loginLayer2 = createSingleLoginLayer();
alert(loginLayer1 === loginLayer2); // 输出： true

/**
 * 3. 装饰者模式：装饰函数实现；
 */

Function.prototype.after = function(afterfn) {
  var __self = this;
  return function() {
    var ret = __self.apply(this, arguments);
    afterfn.apply(this, arguments);
    return ret;
  };
};
