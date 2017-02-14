var IW = require("./init.js");
require("./formData.js");
var webuploadID = 0;
function Webupload(options) {
    this.options = {
        el: "",
        url: "",
        limit: "9",
        ext: ["png","jpg"],
        auto: true,
        data:[],
        success: function() {},
        finish: function() {},
        loadend: function() {},
        error: function() {}
    };
    this.options = IW.extend(this.options, options);
    this.el = document.getElementById(this.options.el);
    this.imgList = null;
    this.id = "";
    this.data = [];
    if (this.el) {
        this._init();
    } else {
        throw new Error("未指定el.");
    }
}

Webupload.prototype = {
    _init: function() {
        this.data = [];
        this.count = 0;
        this._correctExt();
        this._generateID();
        this._renderDOM();
        this.el = document.getElementById(this.options.el);
        this.imgList = document.getElementById("webupload"+this.id).querySelector('.webupload-list');
        this.btn = document.getElementById("webupload"+this.id).querySelector('.webupload-btn');
        this._bindDeleteHanlde();
        this._watch();
    },
    _renderDOM: function() {
        var self = this;
        var ul = document.createElement("ul");
        ul.className = "webupload-list";
        var width = 0;
        var height = 0;
        ["width","paddingLeft","paddingRight","borderLeft","borderRight"].forEach(function(value,index,array){
            width += IW.getStyle(self.el,value)?parseFloat(IW.getStyle(self.el,value)):0
        });
        ["height","paddingTop","paddingBottom","borderTop","borderBottom"].forEach(function(value,index,array){
            height += IW.getStyle(self.el,value)?parseFloat(IW.getStyle(self.el,value)):0
        });
        width = width == 0? "auto": width+"px";
        height = height == 0? "auto": height+"px";
        this.el.outerHTML = '<div class="webupload" id="webupload'+this.id+'"><div class="webupload-handle" style="position:relative; z-index:1; width:'+width+'; height:'+height+'; overflow:hidden;">'+this.el.outerHTML+'<input class="webupload-btn" type="file" name="images" multiple="multiple" style="position:absolute;z-index:1;left:-80px;;top:0; bottom:0; right:0; opacity:0;cursor:pointer;"></div>'+ul.outerHTML+'</div>';
    },
    _bindDeleteHanlde: function(){
        var self = this;
        IW.event.addHandler(this.imgList,"click",function(e){
            var ele = IW.event.getTarget(e);
            if (ele.className == "webupload-item-delete") {
                var parent = ele.parentNode;
                var index = Array.prototype.slice.call(self.imgList.querySelectorAll("li")).indexOf(parent);
                parent.parentNode.removeChild(parent);
                self.data.splice(index,1);
            }
        });
    },
    //生成id
    _generateID:function(){
        webuploadID ++;
        this.id = webuploadID
    },
    //矫正后缀
    _correctExt: function(){
        var exts = this.options.ext,
            extsLength = exts.length;
        for (var i = 0; i < extsLength; i++) {
            if (exts[i] == "jpg") {
                exts[i] = "jpeg";
                break;
            }
        }
    },
    _loadend:function(result,name){
        var li = document.createElement("li"),
            img = document.createElement("img"),
            span = document.createElement("span"),
            deleteBtn = document.createElement("i");
        img.src = result;
        img.className = "webupload-item";
        li.style.position = "relative";
        li.appendChild(img);
        span.className = "webupload-item-progress";
        span.style.position = "absolute";
        span.style.transition = "width 0.5s";
        span.style.opacity = "0.5";
        span.style.width = "0";
        li.appendChild(span);
        deleteBtn.className = "webupload-item-delete";
        deleteBtn.style.position = "absolute";
        li.appendChild(deleteBtn);
        this.imgList.appendChild(li);
        this.options.loadend(result, name);
    },
    _watch: function() {
        var self = this;
        var needVerify = self.options.ext.length > 0 ? true : false;
        this.btn.addEventListener("change", function(event) {
            var i = 0,
                len = this.files.length,
                img, reader, file;
            if (this.files.length > self.options.limit) {
                self.options.error("最多上传" + self.options.limit + "个文件");
                return;
            }
            self.data = [];
            self.count = 0;
            for (; i < len; i++) {
                file = this.files[i];
                var data = new FormData();
                data.append("images", file, file.name);
                self.data.push(data);
                if (needVerify && !self._filterType(this.files[i])) {
                    break;
                };
                if (window.FileReader) {
                    reader = new FileReader();
                    reader.onloadend = function(e) {
                        self._loadend(e.target.result, file.name)
                    };
                    reader.readAsDataURL(file);
                }
            }
            if (self.options.auto) {
                self.upload();
            }

        }, false);
    },
    _filterType: function(file) {
        var exts = this.options.ext,
            extsLength = exts.length,
            isMatch = false;
        for (var i = 0; i < extsLength; i++) {
            if (file.type.indexOf(exts[i]) > -1) {
                isMatch = true;
                break;
            }
        }
        if (!isMatch) {
            this.options.error("文件格式不正确");
        }
        return isMatch;
    },
    _upload: function(data,index) {
        //var sBoundary = "---------------------------" + Date.now().toString(16);
        var self = this;
        this._setExtraData(data);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    self.count ++;
                    self.options.success(self.count,self.data.length);
                    if (self.count == self.data.length) {
                        self.options.finish();
                    }
                } else {
                    self.options.error(xhr.status)
                }
            }
        };
        xhr.open('POST', this.options.url, true);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        //xhr.onprogress = this._onprogress;
        xhr.upload.onprogress = function(e){
            //var divStatus = document.getElementById("status");
            console.log(index)
            if (event.lengthComputable) {
                var percentage = (event.loaded / event.total) * 100 + "%"
                self.imgList.querySelectorAll("li")[index].querySelector(".webupload-item-progress").style.width=percentage
                //console.log((event.loaded / event.total) * 100 + "%")
            }
        };
        if (data.fake) {
            xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + data.boundary);
            xhr.sendAsBinary(data.toString());
        } else {
            xhr.send(data);
        }
    },
    // _onprogress: function(e) {
    //     //var divStatus = document.getElementById("status");
    //     if (event.lengthComputable) {
    //         console.log((event.loaded / event.total) * 100 + "%")
    //     }
    // },
    //设置额外数据
    _setExtraData: function(data) {
        var extraData = this.options.data;
        if (typeof(extraData) == "object") {
            var key;
            for (key in extraData) {
                data.append(key, extraData[key])
            }
        }
    },
    upload:function(){
        var i = 0,
            len = this.data.length;
        for (; i < len; i++) {
            this._upload(this.data[i],i);
        }
    }
}
window.Webupload = Webupload;
export default Webupload;