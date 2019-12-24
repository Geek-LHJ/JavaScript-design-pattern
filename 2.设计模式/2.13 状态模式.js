/**
 * 1. 状态模式基础示例：电灯控制程序
 */
// a. 基本实现
var Light = function() {
  this.state = "off"; // 给电灯设置初始状态 off
  this.button = null; // 电灯开关按钮
};
// 定义 Light.prototype.init 方法
Light.prototype.init = function() {
  var button = document.createElement("button"),
    self = this;
  button.innerHTML = "开关";
  this.button = document.body.appendChild(button);
  this.button.onclick = function() {
    self.buttonWasPressed();
  };
};
// 开关按下操作
Light.prototype.buttonWasPressed = function() {
  if (this.state === "off") {
    console.log("开灯");
    this.state = "on";
  } else if (this.state === "on") {
    console.log("关灯");
    this.state = "off";
  }
};
var light = new Light();
light.init();

// b. 使用状态模式改进
// 首先将定义 3 个状态类，分别是 offLightState(关灯状态)、WeakLightState(弱光状态)、 strongLightState(强光状态) ,每个类都有一个原型方法 buttonWasPressed，代表在各自状态下点击按钮发送的行为；
var OffLightState = function(light) {
  this.light = light;
};
OffLightState.prototype.buttonWasPressed = function() {
  console.log("弱光"); // offLightState 对应的行为
  this.light.setState(this.light.weakLightState); // 切换状态到 weakLightState
};
var WeakLightState = function(light) {
  this.light = light;
};
WeakLightState.prototype.buttonWasPressed = function() {
  console.log("强光"); // weakLightState 对应的行为
  this.light.setState(this.light.strongLightState); // 切换状态到 strongLightState
};
var StrongLightState = function(light) {
  this.light = light;
};
StrongLightState.prototype.buttonWasPressed = function() {
  console.log("关灯"); // strongLightState 对应的行为
  this.light.setState(this.light.offLightState); // 切换状态到 offLightState
};
// Light 类：在构造函数里为每个状态类都创建一个状态对象
var Light = function() {
  this.offLightState = new OffLightState(this);
  this.weakLightState = new WeakLightState(this);
  this.strongLightState = new StrongLightState(this);
  this.button = null;
};
// Light 初始化方法
Light.prototype.init = function() {
  var button = document.createElement("button"),
    self = this;
  this.button = document.body.appendChild(button);
  this.button.innerHTML = "开关";
  this.currState = this.offLightState; // 设置当前电灯状态为关灯
  this.button.onclick = function() {
    self.currState.buttonWasPressed(); // 按钮被按下的事件请求委托给当前持有的状态对象去执行
  };
};
// 实现 Light.prototype.setState 方法：状态对象可以通过这个方法来切换 light 对象的状态，状态的切换规律事先被完好定义在各个状态类中；
Light.prototype.setState = function(newState) {
  this.currState = newState;
};
// 测试效果
var light = new Light();
light.init();

/**
 * 2. 状态模式的通用结构
 */

var Light = function() {
  this.offLightState = new OffLightState(this); // 持有状态对象的引用
  // ...
  this.button = null;
};
Light.prototype.init = function() {
  var button = document.createElement("button"),
    self = this;
  this.button = document.body.appendChild(button);
  this.button.innerHTML = "开关";
  this.currState = this.offLightState; // 设置默认初始状态
  this.button.onclick = function() {
    // 定义用户的请求动作
    self.currState.buttonWasPressed();
  };
};
// 各种状态类函数
var OffLightState = function(light) {
  this.light = light;
};
OffLightState.prototype.buttonWasPressed = function() {
  console.log("弱光");
  this.light.setState(this.light.weakLightState);
};
// ... 其他类

/**
 * 3. 状态模式示例：文件上传
 */

// a. 基本实现
// 上传是一个异步的过程，定义全局函数 window.external.upload 来通知上传进度，把当前的文件状态作为参数state 传入函数中
window.external.upload = function(state) {
  console.log(state); // 可能为 sign、 uploading、 done、 error
};
// 上传的插件对象
var plugin = (function() {
  var plugin = document.createElement("embed");
  plugin.style.display = "none";
  plugin.type = "application/txftn-webkit";
  plugin.sign = function() {
    console.log("开始文件扫描");
  };
  plugin.pause = function() {
    console.log("暂停文件上传");
  };
  plugin.uploading = function() {
    console.log("开始文件上传");
  };
  plugin.del = function() {
    console.log("删除文件上传");
  };
  plugin.done = function() {
    console.log("文件上传完成");
  };
  document.body.appendChild(plugin);
  return plugin;
})();
// 定义控制上传过程的对象 Upload 类
var Upload = function(fileName) {
  this.plugin = plugin;
  this.fileName = fileName;
  this.button1 = null;
  this.button2 = null;
  this.state = "sign"; // 设置初始状态为 waiting
};
// 初始化 Upload 类函数
Upload.prototype.init = function() {
  var that = this;
  this.dom = document.createElement("div");
  this.dom.innerHTML =
    "<span>文件名称:" +
    this.fileName +
    '</span>\
    <button data-action="button1">扫描中</button>\
    <button data-action="button2">删除</button>';
  document.body.appendChild(this.dom);
  this.button1 = this.dom.querySelector('[data-action="button1"]'); // 第一个按钮
  this.button2 = this.dom.querySelector('[data-action="button2"]'); // 第二个按钮
  this.bindEvent();
};
// 两个按钮分别绑定点击事件
Upload.prototype.bindEvent = function() {
  var self = this;
  this.button1.onclick = function() {
    if (self.state === "sign") {
      // 扫描状态下，任何操作无效
      console.log("扫描中，点击无效...");
    } else if (self.state === "uploading") {
      // 上传中，点击切换到暂停
      self.changeState("pause");
    } else if (self.state === "pause") {
      // 暂停中，点击切换到上传中
      self.changeState("uploading");
    } else if (self.state === "done") {
      console.log("文件已完成上传, 点击无效");
    } else if (self.state === "error") {
      console.log("文件上传失败, 点击无效");
    }
  };
  this.button2.onclick = function() {
    if (
      self.state === "done" ||
      self.state === "error" ||
      self.state === "pause"
    ) {
      // 上传完成、上传失败和暂停状态下可以删除
      self.changeState("del");
    } else if (self.state === "sign") {
      console.log("文件正在扫描中，不能删除");
    } else if (self.state === "uploading") {
      console.log("文件正在上传中，不能删除");
    }
  };
};
// Upload.prototype.changeState 方法，负责切换状态之后的具体行为：
Upload.prototype.changeState = function(state) {
  switch (state) {
    case "sign":
      this.plugin.sign();
      this.button1.innerHTML = "扫描中，任何操作无效";
      break;
    case "uploading":
      this.plugin.uploading();
      this.button1.innerHTML = "正在上传，点击暂停";
      break;
    case "pause":
      this.plugin.pause();
      this.button1.innerHTML = "已暂停，点击继续上传";
      break;
    case "done":
      this.plugin.done();
      this.button1.innerHTML = "上传完成";
      break;
    case "error":
      this.button1.innerHTML = "上传失败";
      break;
    case "del":
      this.plugin.del();
      this.dom.parentNode.removeChild(this.dom);
      console.log("删除完成");
      break;
  }
  this.state = state;
};
// 测试上传文件
var uploadObj = new Upload("JavaScript 设计模式与开发实践");
uploadObj.init();
window.external.upload = function(state) {
  // 插件调用 JavaScript 的方法
  uploadObj.changeState(state);
};
window.external.upload("sign"); // 文件开始扫描
setTimeout(function() {
  window.external.upload("uploading"); // 1 秒后开始上传
}, 1000);
setTimeout(function() {
  window.external.upload("done"); // 5 秒后上传完成
}, 5000);

// b. 使用状态模式重构文件上传

// 第一步：提供 window.external.upload 函数
window.external.upload = function(state) {
  console.log(state); // 可能为 sign、 uploading、 done、 error
};
var plugin = (function() {
  var plugin = document.createElement("embed");
  plugin.style.display = "none";
  plugin.type = "application/txftn-webkit";
  plugin.sign = function() {
    console.log("开始文件扫描");
  };
  plugin.pause = function() {
    console.log("暂停文件上传");
  };
  plugin.uploading = function() {
    console.log("开始文件上传");
  };
  plugin.del = function() {
    console.log("删除文件上传");
  };
  plugin.done = function() {
    console.log("文件上传完成");
  };
  document.body.appendChild(plugin);
  return plugin;
})();
// 第二步：改造 Upload 构造函数，在构造函数中为每种状态子类都创建一个实例对象
var Upload = function(fileName) {
  this.plugin = plugin;
  this.fileName = fileName;
  this.button1 = null;
  this.button2 = null;
  this.signState = new SignState(this); // 设置初始状态为 waiting
  this.uploadingState = new UploadingState(this);
  this.pauseState = new PauseState(this);
  this.doneState = new DoneState(this);
  this.errorState = new ErrorState(this);
  this.currState = this.signState; // 设置当前状态
};
// 第三步：实现 Upload.prototype.init 方法
Upload.prototype.init = function() {
  var that = this;
  this.dom = document.createElement("div");
  this.dom.innerHTML =
    "<span>文件名称:" +
    this.fileName +
    '</span>\
    <button data-action="button1">扫描中</button>\
    <button data-action="button2">删除</button>';
  document.body.appendChild(this.dom);
  this.button1 = this.dom.querySelector('[data-action="button1"]');
  this.button2 = this.dom.querySelector('[data-action="button2"]');
  this.bindEvent();
};
// 第四步：负责具体的按钮事件实现
Upload.prototype.bindEvent = function() {
  var self = this;
  this.button1.onclick = function() {
    self.currState.clickHandler1();
  };
  this.button2.onclick = function() {
    self.currState.clickHandler2();
  };
};
Upload.prototype.sign = function() {
  this.plugin.sign();
  this.currState = this.signState;
};
Upload.prototype.uploading = function() {
  this.button1.innerHTML = "正在上传，点击暂停";
  this.plugin.uploading();
  this.currState = this.uploadingState;
};
Upload.prototype.pause = function() {
  this.button1.innerHTML = "已暂停，点击继续上传";
  this.plugin.pause();
  this.currState = this.pauseState;
};
Upload.prototype.done = function() {
  this.button1.innerHTML = "上传完成";
  this.plugin.done();
  this.currState = this.doneState;
};
Upload.prototype.error = function() {
  this.button1.innerHTML = "上传失败";
  this.currState = this.errorState;
};
Upload.prototype.del = function() {
  this.plugin.del();
  this.dom.parentNode.removeChild(this.dom);
};
// 第五步：编写各个状态类的实现
var StateFactory = (function() {
  var State = function() {};
  State.prototype.clickHandler1 = function() {
    throw new Error("子类必须重写父类的 clickHandler1 方法");
  };
  State.prototype.clickHandler2 = function() {
    throw new Error("子类必须重写父类的 clickHandler2 方法");
  };
  return function(param) {
    var F = function(uploadObj) {
      this.uploadObj = uploadObj;
    };
    F.prototype = new State();
    for (var i in param) {
      F.prototype[i] = param[i];
    }
    return F;
  };
})();
var SignState = StateFactory({
  clickHandler1: function() {
    console.log("扫描中，点击无效...");
  },
  clickHandler2: function() {
    console.log("文件正在上传中，不能删除");
  }
});
var UploadingState = StateFactory({
  clickHandler1: function() {
    this.uploadObj.pause();
  },
  clickHandler2: function() {
    console.log("文件正在上传中，不能删除");
  }
});
var PauseState = StateFactory({
  clickHandler1: function() {
    this.uploadObj.uploading();
  },
  clickHandler2: function() {
    this.uploadObj.del();
  }
});
var DoneState = StateFactory({
  clickHandler1: function() {
    console.log("文件已完成上传, 点击无效");
  },
  clickHandler2: function() {
    this.uploadObj.del();
  }
});
var ErrorState = StateFactory({
  clickHandler1: function() {
    console.log("文件上传失败, 点击无效");
  },
  clickHandler2: function() {
    this.uploadObj.del();
  }
});
// 最后测试
var uploadObj = new Upload("JavaScript 设计模式与开发实践");
uploadObj.init();
window.external.upload = function(state) {
  uploadObj[state]();
};
window.external.upload("sign");
setTimeout(function() {
  window.external.upload("uploading"); // 1 秒后开始上传
}, 1000);
setTimeout(function() {
  window.external.upload("done"); // 5 秒后上传完成
}, 5000);
