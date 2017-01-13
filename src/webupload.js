var Init = require("./init.js");
require("./formData.js");

function Webupload(options) {
    this.options = {
        el: "",
        url: "",
        limit: "9",
        ext: [],
        success: function() {},
        loadend: function() {},
        error: function() {}
    };
    this.options = Init.extend(this.options, options);
    this.el = document.getElementById(this.options.el);
    if (this.el) {
        this._init();
    }
}
Webupload.prototype = {
    _init: function() {
        this._watch();
    },
    _renderDOM: function() {
        //
    },
    _watch: function() {
        var self = this;
        var data = new FormData();
        var needVerify = self.options.ext.length > 0 ? true : false;
        this.el.addEventListener("change", function(event) {
            var i = 0,
                len = this.files.length,
                img, reader, file;
            if (this.files.length > self.options.limit) {
                self.options.error("最多上传" + self.options.limit + "个文件");
                return;
            }
            for (; i < len; i++) {
                file = this.files[i];
                if (needVerify && !self._filterType(this.files[i])) {
                    break;
                };
                if (window.FileReader) {
                    reader = new FileReader();
                    reader.onloadend = function(e) {
                        self.options.loadend(e.target.result, file.name);
                    };
                    reader.readAsDataURL(file);
                }
                data.append("images", file, file.name);
            }
            self._upload(data);

        }, false);
    },
    _filterType: function(file) {
        var exts = this.options.ext,
            extsLength = exts.length,
            isMatch = false;
        for (var i = 0; i < extsLength; i++) {
            if (file.type.indexOf(exts[j]) > -1) {
                isMatch = true;
                break;
            }
        }
        if (!isMatch) {
            self.options.error("文件格式不正确");
        }
        return isMatch;
    },
    _upload: function(data) {
        //var sBoundary = "---------------------------" + Date.now().toString(16);
        this._setExtraData(data);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', this.options.url, true);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        //xhr.onprogress = this._onprogress;
        xhr.upload.onprogress = this._onprogress;
        if (data.fake) {
            xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + data.boundary);
            xhr.sendAsBinary(data.toString());
        } else {
            xhr.send(data);
        }
    },
    _onprogress: function(e) {
        //var divStatus = document.getElementById("status");
        if (event.lengthComputable) {
            console.log((event.loaded / event.total) * event.loaded / event.total * 100 + "%")
        }
    },
    _setExtraData: function(data) {
        var extraData = this.options.data;
        if (typeof(extraData) == "object") {
            for (key in extraData) {
                data.append(key, extraData[key])
            }
        }
    }
}
window.Webupload = Webupload;