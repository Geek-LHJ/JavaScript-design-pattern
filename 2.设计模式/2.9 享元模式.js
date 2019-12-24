/** 
 * 1. 享元模式简单示例：
 * 假设目前加工好了50件男士外套和50件女士外套，需要使用塑料模特拍照，正常情况下
 * 需要 50 个男模特和 50 个女模特，然后让他们每人分别穿上一件外套来拍照；
*/
// a. 不使用享元模式的情况下代码
var Model = function( sex, underwear){
  this.sex = sex;
  this.underwear= underwear;
};
Model.prototype.takePhoto = function(){
  console.log( 'sex= ' + this.sex + ' underwear=' + this.underwear);
};
for ( var i = 1; i <= 50; i++ ){
  var maleModel = new Model( 'male', 'underwear' + i );
  maleModel.takePhoto();
};
for ( var j = 1; j <= 50; j++ ){
  var femaleModel= new Model( 'female', 'underwear' + j );
  femaleModel.takePhoto();
};
// b. 优化调整代码
var Model = function( sex ){ this.sex = sex; };
Model.prototype.takePhoto = function(){
  console.log( 'sex= ' + this.sex + ' underwear=' + this.underwear);
};
var maleModel = new Model( 'male' ), femaleModel = new Model( 'female' );
for ( var i = 1; i <= 50; i++ ){
  maleModel.underwear = 'underwear' + i;
  maleModel.takePhoto();
};
for ( var j = 1; j <= 50; j++ ){
  femaleModel.underwear = 'underwear' + j;
  femaleModel.takePhoto();
};


/** 
 * 2. 享元模式实例：文件上传
*/
// a. 文件上传基本实现代码
// 定义 Upload 构造函数，它接受 3 个参数，分别是插件类型、文件名和文件大小
var Upload = function( uploadType, fileName, fileSize ){
  this.uploadType = uploadType;
  this.fileName = fileName;
  this.fileSize = fileSize;
  this.dom= null;
};
//  upload 对象init函数
Upload.prototype.init = function( id ){
  var that = this;
  this.id = id;
  this.dom = document.createElement( 'div' );
  this.dom.innerHTML =
    '<span>文件名称:'+ this.fileName +', 文件大小: '+ this.fileSize +'</span>' +
    '<button class="delFile">删除</button>';
  this.dom.querySelector( '.delFile' ).onclick = function(){ that.delFile(); }
  document.body.appendChild( this.dom );
};
// upload 对象删除文件的功能
Upload.prototype.delFile = function(){
  if ( this.fileSize < 3000 ){
    return this.dom.parentNode.removeChild( this.dom );
  }
  if ( window.confirm( '确定要删除该文件吗? ' + this.fileName ) ){
    return this.dom.parentNode.removeChild( this.dom );
  }
};
// 当选择了文件并确认上传后，调用 Window 下的一个全局函数 startUpload，用户选择的文件列表被组合成一个数组 files 塞进该函数的参数列表里，代码如下：
var id = 0;
window.startUpload = function( uploadType, files ){ // uploadType 区分是控件还是 flash
  for ( var i = 0, file; file = files[ i++ ]; ){
  var uploadObj = new Upload( uploadType, file.fileName, file.fileSize );
    uploadObj.init( id++ ); // 给 upload 对象设置一个唯一的 id
  }
};
// 插件类型上传文件
startUpload( 'plugin', [
  { fileName: '1.txt', fileSize: 1000 },
  { fileName: '2.html', fileSize: 3000 },
  { fileName: '3.txt', fileSize: 5000 }
]);
// Flash类型上传文件
startUpload( 'flash', [
  { fileName: '4.txt', fileSize: 1000 },
  { fileName: '5.html', fileSize: 3000 },
  { fileName: '6.txt', fileSize: 5000 }
]);


// b.享元模式重构文件上传
var Upload = function( uploadType){
  this.uploadType = uploadType;
};

Upload.prototype.delFile = function( id ){
  uploadManager.setExternalState( id, this ); // 表示把当前 id 对应的对象的外部状态都组装到共享对象中
  if ( this.fileSize < 3000 ){
    return this.dom.parentNode.removeChild( this.dom );
  }
  if ( window.confirm( '确定要删除该文件吗? ' + this.fileName ) ){
  return this.dom.parentNode.removeChild( this.dom );
}

var UploadFactory = (function(){
  var createdFlyWeightObjs = {};
  return {
    create: function( uploadType){
    if ( createdFlyWeightObjs [ uploadType] ){
      return createdFlyWeightObjs [ uploadType];
    }
      return createdFlyWeightObjs [ uploadType] = new Upload( uploadType);
    }
  }
})();

var uploadManager = (function(){
  var uploadDatabase = {};
  return {
    // 创建上传文件函数
    add: function( id, uploadType, fileName, fileSize ){
      var flyWeightObj = UploadFactory.create( uploadType );
      var dom = document.createElement( 'div' );
      dom.innerHTML =
      '<span>文件名称:'+ fileName +', 文件大小: '+ fileSize +'</span>' +
      '<button class="delFile">删除</button>';
      dom.querySelector( '.delFile' ).onclick = function(){ flyWeightObj.delFile( id ); }
      document.body.appendChild( dom );
      uploadDatabase[ id ] = { fileName: fileName, fileSize: fileSize, dom: dom };
      return flyWeightObj ;
    },
    setExternalState: function( id, flyWeightObj ){
      var uploadData = uploadDatabase[ id ];
      for ( var i in uploadData ){ flyWeightObj[ i ] = uploadData[ i ]; }
    }
  }
})();

var id = 0;
window.startUpload = function( uploadType, files ){
  for ( var i = 0, file; file = files[ i++ ]; ){
    var uploadObj = uploadManager.add( ++id, uploadType, file.fileName, file.fileSize );
  }
};
// 插件类型上传文件
startUpload( 'plugin', [
  { fileName: '1.txt', fileSize: 1000 },
  { fileName: '2.html', fileSize: 3000 },
  { fileName: '3.txt', fileSize: 5000 }
]);
// Flash类型上传文件
startUpload( 'flash', [
  { fileName: '4.txt', fileSize: 1000 },
  { fileName: '5.html', fileSize: 3000 },
  { fileName: '6.txt', fileSize: 5000 }
]);