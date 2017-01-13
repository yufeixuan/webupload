# webupload

只是一个粗糙的版本，目前尚不成熟，仅支持现代浏览器

## 支持

* 多选
* 无刷新
* 上传预览
* <del>上传进度</del>
* <del>文件限制</del>
* <del>裁剪</del>
* <del>跨域</del>
* <del>向前兼容</del>

## 使用方法：

### 方法一：

#### 安装

    npm install webupload

在支持本地打包的环境使用：

    require("webupload");
    new Webupload({
        //触发上传的元素
        el: "upload",
        //上传地址
        url: "/api/upload",
        //单个文件装载完成
        loadend: function(source, b) {
            console.log(source)
            console.log(b)
            var list = document.getElementById("image-list"),
                li = document.createElement("li"),
                img = document.createElement("img");
            img.src = source;
            li.appendChild(img);
            list.appendChild(li);
        }
    });
   

### 方法二：

在html中引入：

    <input id="upload" type="file" name="images" multiple="multiple">
    <div class="image-list" id="image-list"></div>

    <script src="build/webupload.js"></script>
    <script>
    new Webupload({
        //触发上传的元素
        el: "upload",
        //上传地址
        url: "/api/upload",
        //单个文件装载完成
        loadend: function(source, b) {
            console.log(source)
            console.log(b)
            var list = document.getElementById("image-list"),
                li = document.createElement("li"),
                img = document.createElement("img");
            img.src = source;
            li.appendChild(img);
            list.appendChild(li);
        }
    });
    </script>


查看demo，需要先运行一个服务来接受上传图片

    npm run server

