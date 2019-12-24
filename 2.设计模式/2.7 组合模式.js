/**
 * 1. 组合模式基本示例
 */
// 组合对象
var MacroCommand = function() {
  return {
    commandsList: [],
    add: function(command) {
      this.commandsList.push(command);
    },
    execute: function() {
      for (var i = 0, command; (command = this.commandsList[i++]); ) {
        command.execute();
      }
    }
  };
};
// 叶对象
var openTvCommand = {
  execute: function() {
    console.log("打开电视");
  },
  add: function() {
    throw new Error("叶对象不能添加子节点");
  }
};
var macroCommand = MacroCommand();
macroCommand.add(openTvCommand);
openTvCommand.add(macroCommand); // Uncaught Error: 叶对象不能添加子节点

/**
 * 2. 组合模式的例子——扫描文件夹
 */
/******************************* Folder ******************************/
var Folder = function(name) {
  this.name = name;
  this.files = [];
};
Folder.prototype.add = function(file) {
  this.files.push(file);
};
Folder.prototype.scan = function() {
  console.log("开始扫描文件夹: " + this.name);
  for (var i = 0, file, files = this.files; (file = files[i++]); ) {
    file.scan();
  }
};
/******************************* File ******************************/
var File = function(name) {
  this.name = name;
};
File.prototype.add = function() {
  throw new Error("文件下面不能再添加文件");
};
File.prototype.scan = function() {
  console.log("开始扫描文件: " + this.name);
};
// 创建一些文件夹和文件对象， 并且让它们组合成一棵树
var folder = new Folder("测试文件夹");
var file = new File("JavaScript 设计模式与开发实践");
folder.add(file);
// 操作树的最顶端对象，进行扫描整个文件夹的操作
folder.scan();

/**
 * 3. 实例：改写扫描文件夹的代码，增加删除功能
 */
var Folder = function(name) {
  this.name = name;
  this.parent = null; // 增加 this.parent 属性
  this.files = [];
};
Folder.prototype.add = function(file) {
  file.parent = this; //设置父对象
  this.files.push(file);
};
Folder.prototype.scan = function() {
  console.log("开始扫描文件夹: " + this.name);
  for (var i = 0, file, files = this.files; (file = files[i++]); ) {
    file.scan();
  }
};
// 增加移除文件夹方法 Folder.prototype.remove
Folder.prototype.remove = function() {
  if (!this.parent) {
    // 根节点或者树外的游离节点
    return;
  }
  for (var files = this.parent.files, l = files.length - 1; l >= 0; l--) {
    var file = files[l];
    if (file === this) {
      files.splice(l, 1);
    }
  }
};

// File 类的实现基本一致：
var File = function(name) {
  this.name = name;
  this.parent = null;
};
File.prototype.add = function() {
  throw new Error("不能添加在文件下面");
};
File.prototype.scan = function() {
  console.log("开始扫描文件: " + this.name);
};
File.prototype.remove = function() {
  if (!this.parent) {
    // 根节点或者树外的游离节点
    return;
  }
  for (var files = this.parent.files, l = files.length - 1; l >= 0; l--) {
    var file = files[l];
    if (file === this) {
      files.splice(l, 1);
    }
  }
};
// 测试一下移除文件功能：
var folder = new Folder("学习资料");
var folder1 = new Folder("JavaScript");
var file1 = new Folder("深入浅出 Node.js");
folder1.add(new File("JavaScript 设计模式与开发实践"));
folder.add(folder1);
folder.add(file1);
folder1.remove(); //移除文件夹
folder.scan();
