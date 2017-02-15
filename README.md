# webupload

只是一个粗糙的版本，目前尚不成熟。

## Browser support
IE 9 +

## 功能

* 多选
* 无刷新
* 自定义请求数据
* 上传预览
* 上传进度
* 文件类型限制
* 文件大小限制
* 可选自动上传
* 是否显示文件大小
* 是否显示文件名称
* 错误处理
* 删除
* <del>清空已选择的文件</del>
* <del>拖放上传(不可删除)</del>
* <del>裁剪</del>
* 跨域
* <del>断点续传</del>
* <del>向前兼容</del>

### 安装

    npm install webupload

## 使用方法：

```html
<div id="upload" class="upload">上传</div>
```

在支持本地打包的环境使用：

```js
import {Webupload} form "webupload";
new Webupload({
    //触发上传的元素
    el: "upload",
    //上传地址
    url: "/api/upload",
    //自定义数据（例如token,可选）
    data: {
        token: Date.now().toString(16)
    },
    //限制上传个数（可选，默认最多上传9个文件）
    limit: 2,
    //限制文件尺寸（单位kb，可选）
    maxSize:10,
    //限制上传类型（可选）
    ext: ["png"],
    //是否自动上传？默认自动（可选）
    auto: true,
    //显示文件名（可选）
    showName: true,
    //显示文件大小（可选）
    showSize: true,
    //单个文件装载完成（可选）
    loadend: function(source, b) {
        //console.log(source)
        console.log(b)
    },
    //单个文件上传成功触发（可选）
    success:function(i,len){
        console.log("成功"+(i/len*100).toFixed(0)+'%');
    },
});
```
### 手动触发上传,例如实现连续上传

```html
<div id="upload" class="upload">选择图片</div>
<button id="btn">上传</button>
```

```js
var btn = document.getElementById("btn");
var demo = new Webupload({
    el: "upload",
    url: "/api/upload",
    auto: false,
    //上传开始（可选）
    startUpload:function(){
        btn.disabled = true;
    },
    //完成上传动作（可选）
    finishUpload:function(){
        btn.disabled = false;
    }
});
//手动触发上传
btn.onclick = function(){
    demo.upload();
}
```

### 错误处理

```html
<div id="error" style="color:red;"></div>
```

```js
new Webupload({
    //触发上传的元素
    el: "upload",
    //上传地址
    url: "/api/upload",
    auto: false,
    maxSize:30,
    //选择文件按钮发生change时（可选）
    change:function(){
        document.getElementById("error").innerHTML="";
    },
    //错误处理消息（可选）
    error:function(msg){
        document.getElementById("error").innerHTML=msg;
    }
});

```

### 跨域 

需要让接口开发人员增加http头，其原理可参考我之前的文章：<a href="https://www.w3cmm.com/ajax/cors.html">CORS跨源资源共享</a>

    Access-Control-Allow-Origin: *

## demo
查看demo，需要先运行一个服务来接受上传图片

    npm run server

在浏览器中打开`http://localhost:3000 `
