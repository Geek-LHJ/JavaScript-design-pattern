/**
 * 1. 单例模式简单示例
 */
var Singleton = function(name) {
  this.name = name;
  this.instance = null;
};
Singleton.prototype.getName = function() {
  alert(this.name);
};
Singleton.getInstance = function(name) {
  if (!this.instance) {
    this.instance = new Singleton(name);
  }
  return this.instance;
};
var a = Singleton.getInstance("sven1");
var b = Singleton.getInstance("sven2");
alert(a === b); // true

/**
 * 2. 透明的单例模式：用户从这个类中创建对象的时候，可以像使用其他任何普通类一样
 */
var CreateDiv = (function() {
  var instance;
  var CreateDiv = function(html) {
    if (instance) {
      return instance;
    }
    this.html = html;
    this.init();
    return (instance = this);
  };
  CreateDiv.prototype.init = function() {
    var div = document.createElement("div");
    div.innerHTML = this.html;
    document.body.appendChild(div);
  };
  return CreateDiv;
})();
var a = new CreateDiv("sven1");
var b = new CreateDiv("sven2");
alert(a === b); // true

/**
 * 3. 用代理实现单例模式（缓存代理的应用）
 */
var CreateDiv = function(html) {
  this.html = html;
  this.init();
};
CreateDiv.prototype.init = function() {
  var div = document.createElement("div");
  div.innerHTML = this.html;
  document.body.appendChild(div);
};
// 引入代理类 proxySingletonCreateDiv：
var ProxySingletonCreateDiv = (function() {
  var instance;
  return function(html) {
    if (!instance) {
      instance = new CreateDiv(html);
    }
    return instance;
  };
})();
var a = new ProxySingletonCreateDiv("sven1");
var b = new ProxySingletonCreateDiv("sven2");
alert(a === b);

/**
 * 4. 惰性单例：在需要的时候才创建对象实例，例如使用单例模式创建一个登陆浮窗，仅点击时创建：
 */
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
document.getElementById("loginBtn").onclick = function() {
  var loginLayer = createLoginLayer();
  loginLayer.style.display = "block";
};

// 5. 通用的惰性单例；

var getSingle = function(fn) {
  var result;
  return function() {
    return result || (result = fn.apply(this, arguments));
  };
};
var createLoginLayer = function() {
  var div = document.createElement("div");
  div.innerHTML = "登录浮窗";
  div.style.display = "none";
  document.body.appendChild(div);
  return div;
};
var createSingleLoginLayer = getSingle(createLoginLayer);
document.getElementById("loginBtn").onclick = function() {
  var loginLayer = createSingleLoginLayer();
  loginLayer.style.display = "block";
};
