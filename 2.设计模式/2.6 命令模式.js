/**
 * 1. JavaScript 中的命令模式
 */
var bindClick = function(button, func) {
  button.onclick = func;
};
var MenuBar = {
  refresh: function() {
    console.log("刷新菜单界面");
  }
};
var SubMenu = {
  add: function() {
    console.log("增加子菜单");
  },
  del: function() {
    console.log("删除子菜单");
  }
};
bindClick(button1, MenuBar.refresh);
bindClick(button2, SubMenu.add);
bindClick(button3, SubMenu.del);

/**
 * 2. 撤消命令：实例小球运动的撤销操作
 */
var ball = document.getElementById("ball");
var pos = document.getElementById("pos");
var moveBtn = document.getElementById("moveBtn");
var cancelBtn = document.getElementById("cancelBtn");
var MoveCommand = function(receiver, pos) {
  this.receiver = receiver;
  this.pos = pos;
  this.oldPos = null;
};
MoveCommand.prototype.execute = function() {
  this.receiver.start("left", this.pos, 1000, "strongEaseOut");
  this.oldPos = this.receiver.dom.getBoundingClientRect()[
    this.receiver.propertyName
  ];
  // 记录小球开始移动前的位置
};
MoveCommand.prototype.undo = function() {
  this.receiver.start("left", this.oldPos, 1000, "strongEaseOut");
  // 回到小球移动前记录的位置
};
var moveCommand;
moveBtn.onclick = function() {
  var animate = new Animate(ball);
  moveCommand = new MoveCommand(animate, pos.value);
  moveCommand.execute();
};
cancelBtn.onclick = function() {
  moveCommand.undo(); // 撤销命令
};
