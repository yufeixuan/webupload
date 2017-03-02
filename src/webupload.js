const IW = require("./init.js");
require("./formData.js");
let webuploadID = 0;

function Webupload(options) {
    this.options = {
        el: "",
        url: "",
        limit: "9",
        //kb
        maxSize: "2048",
        ext: ["png", "jpg"],
        auto: true,
        data: [],
        showSize: false,
        showName: false,
        startUpload: function() {},
        success: function() {},
        finishUpload: function() {},
        loadend: function() {},
        change: function() {},
        error: function() {}
    };
    this.options = IW.extend(this.options, options);
    this.el = document.getElementById(this.options.el);
    this.imgList = null;
    this.id = "";
    this.data = [];
    this.count = 0;
    if (this.el) {
        this._init();
    } else {
        throw new Error("未指定el.");
    }
}

Webupload.prototype = {
    _init: function() {
        this.crop = typeof this.options.crop == "object";
        this._correctExt();
        this._generateID();
        this._renderDOM();
        this.el = document.getElementById(this.options.el);
        this.imgList = document.getElementById("webupload" + this.id).querySelector('.webupload-list');
        this.btn = document.getElementById("webupload" + this.id).querySelector('.webupload-btn');
        this._bindHanlde();
        this._watch();
    },
    _renderDOM: function() {
        var self = this;
        var ul = document.createElement("ul");
        ul.className = "webupload-list";
        var width = self.el.offsetWidth + "px";
        var height = self.el.offsetHeight + "px";
        var fileInput = "";
        if (this.crop) {
            fileInput = '<input class="webupload-btn" type="file" name="images" style="position:absolute;z-index:1;left:-80px;;top:0; bottom:0; right:0; opacity:0;">';
        } else {
            fileInput = '<input class="webupload-btn" type="file" name="images" multiple="multiple" style="position:absolute;z-index:1;left:-80px;;top:0; bottom:0; right:0; opacity:0;">';
        }
        this.el.outerHTML = '<div class="webupload" id="webupload' + this.id + '"><div class="webupload-handle" style="position:relative; z-index:1; width:' + width + '; height:' + height + '; overflow:hidden;">' + this.el.outerHTML + fileInput + '</div>' + ul.outerHTML + '</div>';
    },
    _bindHanlde: function() {
        var self = this;
        if (this.crop) {
            //

        } else {
            IW.event.on(this.imgList, "click", function(e) {
                var ele = IW.event.getTarget(e);
                if (ele.className == "webupload-item-delete") {
                    var parent = ele.parentNode;
                    var index = Array.prototype.slice.call(self.imgList.querySelectorAll("li")).indexOf(parent);
                    parent.parentNode.removeChild(parent);
                    self.data.splice(index, 1);
                }
            });
        }

    },
    //生成id
    _generateID: function() {
        webuploadID++;
        this.id = webuploadID
    },
    //矫正后缀
    _correctExt: function() {
        var exts = this.options.ext,
            extsLength = exts.length;
        for (var i = 0; i < extsLength; i++) {
            if (exts[i] == "jpg") {
                exts[i] = "jpeg";
                break;
            }
        }
    },
    _loadend: function(result, file) {
        var li = document.createElement("li");
        li.className = "webupload-item";
        li.style.position = "relative";

        var img = document.createElement("img");
        img.src = result;

        //delete
        if (this.crop) {
            var crop = document.createElement("div");
            crop.className = "webupload-item-crop";
            crop.style.position = "relative";
            crop.style.width = img.width + "px";
            crop.style.height = img.height + "px";
            crop.appendChild(img);

            var mask = document.createElement("div");
            mask.className = "webupload-item-crop-mask";
            mask.style.cssText = 'position:absolute;left:0;top:0;z-index:1;width:' + img.width + 'px;height:' + img.height + 'px;background:rgba(0,0,0,0.5);';
            //cursor:crosshair;
            crop.appendChild(mask);

            var area = document.createElement("div");
            area.className = "webupload-item-crop-area";
            area.style.position = "absolute";
            area.style.width = this.options.crop.width?(this.options.crop.width-2)+"px":"98px";
            area.style.height = this.options.crop.height?(this.options.crop.height-2)+"px":"98px";
            area.style.border = "solid 1px #39f";
            area.style.background = "#fff";
            var imgClone = img.cloneNode(true);
            // imgClone.cssText = 'position:absolute;left:-50px;top:-50px;';
            var areaImg = document.createElement("div");
            areaImg.className = "webupload-item-crop-area-move";
            areaImg.style.position = "relative";
            imgClone.className = "webupload-item-crop-area-img";
            imgClone.style.position = "absolute";
            areaImg.appendChild(imgClone);
            area.appendChild(areaImg);
            //line
            var line1 = document.createElement("i");
            line1.className = "webupload-item-crop-line webupload-item-crop-line1";
            
            var line2 = document.createElement("i");
            line2.className = "webupload-item-crop-line webupload-item-crop-line2";

            var line3 = document.createElement("i");
            line3.className = "webupload-item-crop-line webupload-item-crop-line3";
            var line4 = document.createElement("i");
            line4.className = "webupload-item-crop-line webupload-item-crop-line4";
            if (this.options.crop.zoom) {
                line1.style.cursor = "n-resize";
                line2.style.cursor = "e-resize";
                line3.style.cursor = "s-resize";
                line4.style.cursor = "w-resize";
                area.appendChild(line1);
                area.appendChild(line2);
                area.appendChild(line3);
                area.appendChild(line4);
                var point1 = document.createElement("i");
                point1.className = "webupload-item-crop-point webupload-item-crop-point1";
                area.appendChild(point1);
                var point2 = document.createElement("i");
                point2.className = "webupload-item-crop-point webupload-item-crop-point2";
                area.appendChild(point2);
                var point3 = document.createElement("i");
                point3.className = "webupload-item-crop-point webupload-item-crop-point3";
                area.appendChild(point3);
                var point4 = document.createElement("i");
                point4.className = "webupload-item-crop-point webupload-item-crop-point4";
                area.appendChild(point4);
                var point5 = document.createElement("i");
                point5.className = "webupload-item-crop-point webupload-item-crop-point5";
                area.appendChild(point5);
                var point6 = document.createElement("i");
                point6.className = "webupload-item-crop-point webupload-item-crop-point6";
                area.appendChild(point6);
                var point7 = document.createElement("i");
                point7.className = "webupload-item-crop-point webupload-item-crop-point7";
                area.appendChild(point7);
                var point8 = document.createElement("i");
                point8.className = "webupload-item-crop-point webupload-item-crop-point8";
                area.appendChild(point8);
            } else {
                area.appendChild(line1);
                area.appendChild(line2);
                area.appendChild(line3);
                area.appendChild(line4);
            }
            
            crop.appendChild(area);

            li.appendChild(crop);
        } else {
            li.appendChild(img);
            //name
            if (this.options.showName) {
                var name = document.createElement("p");
                name.className = "webupload-item-name";
                name.innerHTML = file.name;
                li.appendChild(name);
            }
            //size
            if (this.options.showSize) {
                var size = document.createElement("p");
                size.className = "webupload-item-size";
                size.innerHTML = (file.size / 1000).toFixed(2) + "kb";
                li.appendChild(size);
            }
            //delete
            var deleteBtn = document.createElement("i");
            deleteBtn.className = "webupload-item-delete";
            deleteBtn.style.position = "absolute";
            li.appendChild(deleteBtn);
            //progress
            var progress = document.createElement("span");
            progress.className = "webupload-item-progress";
            progress.style.position = "absolute";
            progress.style.transition = "width 0.5s";
            progress.style.opacity = "0.5";
            progress.style.width = "0";
            li.appendChild(progress);
            
        }
        // error
        var error = document.createElement("p");
        error.className = "webupload-item-error";
        li.appendChild(error);
        //document.querySelector(".webupload-list").childNodes.length
        if (this.crop) {
            while (this.imgList.childNodes.length) {
                this.imgList.removeChild(this.imgList.childNodes[this.imgList.childNodes.length - 1]);
            }
        }
        this.imgList.appendChild(li);
        if (this.crop) {
            this._handleCrop(img);
        }
        //this.options.loadend(result, file);
    },
    _handleCrop: function(img) {
        var self = this;
        var area = this.imgList.querySelector(".webupload-item-crop-area");
        var areaImg = area.querySelector(".webupload-item-crop-area-img");
        var line1 = area.querySelector(".webupload-item-crop-line1");
        var line2 = area.querySelector(".webupload-item-crop-line2");
        var line3 = area.querySelector(".webupload-item-crop-line3");
        var line4 = area.querySelector(".webupload-item-crop-line4");
        var point1 = area.querySelector(".webupload-item-crop-point1");
        var point3 = area.querySelector(".webupload-item-crop-point3");
        var point5 = area.querySelector(".webupload-item-crop-point5");
        var point7 = area.querySelector(".webupload-item-crop-point7");
        var startLeft = 0;
        var startTop = 0;
        var point = {
            x: 0,
            y: 0
        }
        
        var direction = "";
        var areaWidth = area.offsetWidth;
        var areaHeight = area.offsetHeight;
        this.thumb = {};
        this.thumb.thumb_width = areaWidth;
        this.thumb.thumb_height = areaHeight;
        this.thumb.thumb_x = point.x;
        this.thumb.thumb_y = point.y;
        var aspectRatio = areaWidth/areaHeight;
        // var diffTop = parseFloat(IW.getStyle(area, "border-top-width"));
        // var diffLeft = parseFloat(IW.getStyle(area, "border-left-width")
        var cropResult = document.getElementById(this.options.crop.cropResult);
        var cropResultImg = null;
        if (cropResult) {
            cropResult.style.width = this.options.crop.width?this.options.crop.width+"px":"100px";
            cropResult.style.height = this.options.crop.height ?this.options.crop.height+"px" :"100px";
            cropResult.style.overflow = "hidden";
            cropResult.style.position = "relative";
            
            cropResult.innerHTML = '<img src="' + img.src + '" style="position:absolute;"/>'
            cropResultImg = cropResult.querySelector("img");
        }
        var mouseMoveHandle = function(event) {
            var event = IW.event.getEvent(event);
            var moveDistanceX = IW.event.getPointerPositionInDocument(event).x - point.x;
            var moveDistanceY = IW.event.getPointerPositionInDocument(event).y - point.y;
            
            if (direction == "s" || direction == "se") {
                var width = areaWidth + Math.round(moveDistanceY*aspectRatio) -2;
                var height = areaHeight + moveDistanceY -2;
                if (startLeft + width > img.width) {
                    width = img.width-startLeft;
                    height = width/aspectRatio;
                }
                area.style.width = width + "px";
                area.style.height = height + "px";
            } else if (direction == "w" || direction == "sw") {
                area.style.width = areaWidth + (-moveDistanceX) -2 + "px";
                area.style.height = areaHeight + (-Math.round(moveDistanceX*aspectRatio)) -2 + "px";
            }  else if (direction == "e" || direction == "ne") {
                area.style.width = areaWidth + moveDistanceX -2 + "px";
                area.style.height = areaHeight + Math.round(moveDistanceX*aspectRatio) -2 + "px";
            } else if (direction == "n" || direction == "nw") {
                area.style.width = areaWidth + (-Math.round(moveDistanceY*aspectRatio)) -2 + "px";
                area.style.height = areaHeight + (-moveDistanceY) -2 + "px";
            } else {
                var left = moveDistanceX + startLeft;
                var top = moveDistanceY + startTop;
                var maxLeft = img.width - area.offsetWidth;
                var maxTop = img.height - area.offsetHeight;
                //console.log("mouseMoveHandle-left",left)
                if (left < 0) {
                    left = 0;
                }
                if (left > maxLeft) {
                    left = maxLeft;
                }
                if (top < 0) {
                    top = 0;
                }
                if (top > maxTop) {
                    top = maxTop;
                }
                area.style.left = left + "px";
                area.style.top = top + "px";
                areaImg.style.left = -left + "px";
                areaImg.style.top = -top + "px";
                if (cropResultImg) {
                    cropResultImg.style.left = -left-1 + "px";
                    cropResultImg.style.top = -top-1 + "px";
                }
            }
            self.thumb.thumb_width = area.offsetWidth;
            self.thumb.thumb_height = area.offsetWidth;
            self.thumb.thumb_x = left;
            self.thumb.thumb_y = top;
        };
        var mouseUpHande = function(event) {
            IW.event.off(document, "mousemove", mouseMoveHandle);
        };
        function mouseDownHande(e,s) {
            var event = IW.event.getEvent(e);
            IW.event.preventDefault(event);
            IW.event.stopPropagation(event);
            direction = s;

            startLeft = parseFloat(IW.getStyle(area, "left"));
            startTop = parseFloat(IW.getStyle(area, "top"));
            areaWidth = area.offsetWidth;
            areaHeight = area.offsetHeight;
            point.x = IW.event.getPointerPositionInDocument(event).x;
            point.y = IW.event.getPointerPositionInDocument(event).y;
            IW.event.on(document, "mousemove", mouseMoveHandle);
        }
        IW.event.on(area, "mousedown", function(e) {
            mouseDownHande(e,"move")
        });
        IW.event.on(document, "mouseup", mouseUpHande);
        if (this.options.crop.zoom) {
            IW.event.on(line1, "mousedown", function(e) {
                mouseDownHande(e,"n")
            });
            IW.event.on(line2, "mousedown", function(e) {
                mouseDownHande(e,"e");
            });
            IW.event.on(line3, "mousedown", function(e) {
                mouseDownHande(e,"s");
            });
            IW.event.on(line4, "mousedown", function(e) {
                mouseDownHande(e,"w");
            });
            IW.event.on(point1, "mousedown", function(e) {
                mouseDownHande(e,"nw");
            });
            IW.event.on(point3, "mousedown", function(e) {
                mouseDownHande(e,"ne");
            });
            IW.event.on(point5, "mousedown", function(e) {
                mouseDownHande(e,"se");
            });
            IW.event.on(point7, "mousedown", function(e) {
                mouseDownHande(e,"sw");
            });
            IW.event.on(line1, "mouseup", mouseUpHande);
            IW.event.on(line2, "mouseup", mouseUpHande);
            IW.event.on(line3, "mouseup", mouseUpHande);
            IW.event.on(line4, "mouseup", mouseUpHande);
            IW.event.on(point1, "mouseup", mouseUpHande);
            IW.event.on(point3, "mouseup", mouseUpHande);
            IW.event.on(point5, "mouseup", mouseUpHande);
            IW.event.on(point7, "mouseup", mouseUpHande);
        }
    },
    _watch: function() {
        var self = this;
        var needVerify = self.options.ext.length > 0 ? true : false;
        this.btn.addEventListener("change", function(event) {
            self.options.change();
            var i = 0,
                len = this.files.length,
                img, file;

            if (this.files.length > self.options.limit) {
                self.options.error("最多上传" + self.options.limit + "个文件");
                return;
            }
            for (; i < len; i++) {
                file = this.files[i];
                if (self.data.length >= self.options.limit) {
                    self.options.error("最多上传" + self.options.limit + "个文件");
                    break;
                }
                if (needVerify && !self._filterType(file)) {
                    self.options.error("文件" + file.name + "类型错误");
                    break;
                };
                if (file.size / 1000 > self.options.maxSize) {
                    self.options.error("文件" + file.name + "超过" + self.options.maxSize + "kb");
                    break;
                }
                
                if (window.FileReader && (file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif")) {
                    
                    (function(file){
                        var reader = new FileReader();
                        reader.onloadend = function(e) {
                            var data = new FormData();
                            data.append("images", file, file.name);
                            self.data.push(data);
                            self._loadend(e.target.result, file)
                        };
                        reader.readAsDataURL(file);
                    })(file)
                } else {
                    var data = new FormData();
                    data.append("images", file, file.name);
                    self.data.push(data);
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
    _uploadStop: function() {
        this.data = [];
        this.count = 0;
        this.btn.disabled = false;
        this.el.classList.remove("disabled");
    },
    _upload: function(data, index) {
        //var sBoundary = "---------------------------" + Date.now().toString(16);
        var self = this;
        this._setExtraData(data);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    self.count++;
                    self.options.success(self.count, self.data.length);
                    if (self.count == self.data.length) {
                        self._uploadStop();
                        self.options.finishUpload();
                    }
                } else {
                    self._uploadStop();
                    self.imgList.querySelectorAll("li")[index].querySelector(".webupload-item-error").innerHTML = "上传失败，xhr.status" + xhr.status
                        //self.options.error(xhr.status)
                }
            }
        };
        xhr.open('POST', this.options.url, true);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        //xhr.onprogress = this._onprogress;
        xhr.upload.onprogress = function(e) {
            //var divStatus = document.getElementById("status");
            if (event.lengthComputable && !self.crop) {
                var percentage = (event.loaded / event.total) * 100 + "%";
                self.imgList.querySelectorAll("li")[index].querySelector(".webupload-item-progress").style.width = percentage
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
        if (this.crop) {
            for (key in this.thumb){
                data.append(key, this.thumb[key])
            }
        }
    },
    upload: function() {
        var i = 0,
            len = this.data.length;
        if (len == 0) {
            return
        };
        this.options.startUpload();
        this.btn.disabled = true;
        this.el.classList.add("disabled");
        for (; i < len; i++) {
            this._upload(this.data[i], i);
        }
    }
}
window.Webupload = Webupload;
export default Webupload;
