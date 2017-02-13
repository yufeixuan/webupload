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
* 可选自动上传
* <del>删除</del>
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
    //限制上传类型（可选）
    ext: ["png"],
    //单个文件装载完成（可选）
    loadend: function(source, b) {
        //console.log(source)
        console.log(b)
    },
    //文件上传成功触发（可选）
    success:function(i,len){
        console.log("成功"+(i/len*100).toFixed(0)+'%');
    },
    //所有文件上传成功触发（可选）
    finish:function(){
        console.log("over")
    },
    //错误处理消息（可选）
    error:function(msg){
        console.log(msg);
    }
});
```
### 手动触发上传

```html
<div id="upload" class="upload">选择图片</div>
<button id="btn">上传</button>
```

```js
var demo = new Webupload({
    el: "upload",
    url: "/api/upload",
    auto: false,
    error:function(msg){
        console.log(msg);
    }
});
//手动触发上传
var btn = document.getElementById("btn");
btn.onclick = function(){
    demo.upload();
}
```

### 跨域 

需要让接口开发人员增加http头，其原理可参考我之前的文章：<a href="https://www.w3cmm.com/ajax/cors.html">CORS跨源资源共享</a>

    Access-Control-Allow-Origin: *

## demo
查看demo，需要先运行一个服务来接受上传图片

    npm run server

