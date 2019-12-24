/**
 * 1. 多态的基本使用：
 */
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

var Dog = function() {};
Dog.prototype.sound = function() {
  console.log("汪汪汪");
};

makeSound(new Dog()); // 汪汪汪

/**
 * 2. 多态的使用：地图应用
 */
var googleMap = {
  show: function() {
    console.log("开始渲染谷歌地图");
  }
};
var baiduMap = {
  show: function() {
    console.log("开始渲染百度地图");
  }
};
var renderMap = function(map) {
  if (map.show instanceof Function) {
    map.show();
  }
};
renderMap(googleMap); // 输出：开始渲染谷歌地图
renderMap(baiduMap); // 输出：开始渲染百度地图
