/**
 * 1. Each 函数简单实现
 */
var each = function(ary, callback) {
  for (var i = 0, l = ary.length; i < l; i++) {
    callback.call(ary[i], i, ary[i]); // 把下标和元素当作参数传给 callback 函数
  }
};
each([1, 2, 3], function(i, n) {
  alert([i, n]);
});

/**
 * 2. 实例：判断 2 个数组里元素的值是否完全相等，分别使用内部迭代器和外部迭代器实现
 */

// a. 内部迭代器实现
var compare = function(ary1, ary2) {
  if (ary1.length !== ary2.length) {
    throw new Error("ary1 和 ary2 不相等");
  }
  each(ary1, function(i, n) {
    if (n !== ary2[i]) {
      throw new Error("ary1 和 ary2 不相等");
    }
  });
  alert("ary1 和 ary2 相等");
};
compare([1, 2, 3], [1, 2, 4]); // throw new Error ( 'ary1 和 ary2 不相等' );

// b.外部迭代器实现
var Iterator = function(obj) {
  var current = 0;
  var next = function() {
    current += 1;
  };
  var isDone = function() {
    return current >= obj.length;
  };
  var getCurrItem = function() {
    return obj[current];
  };
  return {
    next: next,
    isDone: isDone,
    getCurrItem: getCurrItem
  };
};
var compare = function(iterator1, iterator2) {
  while (!iterator1.isDone() && !iterator2.isDone()) {
    if (iterator1.getCurrItem() !== iterator2.getCurrItem()) {
      throw new Error("iterator1 和 iterator2 不相等");
    }
    iterator1.next();
    iterator2.next();
  }
  alert("iterator1 和 iterator2 相等");
};
var iterator1 = Iterator([1, 2, 3]);
var iterator2 = Iterator([1, 2, 3]);
compare(iterator1, iterator2); // 输出： iterator1 和 iterator2 相等

/**
 * 3. 实例：在文件上传模块中，实现根据不同的浏览器获取相应的上传组件对象
 */

// a. 使用 if-else 进行简单判断
var getUploadObj = function() {
  try {
    return new ActiveXObject("TXFTNActiveX.FTNUpload"); // IE 上传控件
  } catch (e) {
    if (supportFlash()) {
      // supportFlash 函数未提供
      var str = '<object type="application/x-shockwave-flash"></object>';
      return $(str).appendTo($("body"));
    } else {
      var str = '<input name="file" type="file"/>'; // 表单上传
      return $(str).appendTo($("body"));
    }
  }
};
// b. 迭代器：每种获取 upload 对象的方法都封装在各自的函数，使用一个迭代器，迭代获取这些 upload 对象，直到获取到一个可用的为止；每种 upload 对象约定若该函数里面的 upload 对象是可用的，则让函数返回该对象，反之返回 false，提示迭代器继续往后面进行迭代；
var getActiveUploadObj = function() {
  try {
    return new ActiveXObject("TXFTNActiveX.FTNUpload"); // IE 上传控件
  } catch (e) {
    return false;
  }
};
var getFlashUploadObj = function() {
  if (supportFlash()) {
    // supportFlash 函数未提供
    var str = '<object type="application/x-shockwave-flash"></object>';
    return $(str).appendTo($("body"));
  }
  return false;
};
var getFormUpladObj = function() {
  var str = '<input name="file" type="file" class="ui-file"/>'; // 表单上传
  return $(str).appendTo($("body"));
};
// 迭代器代码
var iteratorUploadObj = function() {
  for (var i = 0, fn; (fn = arguments[i++]); ) {
    var uploadObj = fn();
    if (uploadObj !== false) {
      return uploadObj;
    }
  }
};
var uploadObj = iteratorUploadObj(
  getActiveUploadObj,
  getFlashUploadObj,
  getFormUpladObj
);
