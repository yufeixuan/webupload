/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Webupload = undefined;

	var _webupload = __webpack_require__(1);

	var _webupload2 = _interopRequireDefault(_webupload);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.Webupload = _webupload2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var IW = __webpack_require__(2);
	__webpack_require__(3);
	var webuploadID = 0;
	function Webupload(options) {
	    this.options = {
	        el: "",
	        url: "",
	        limit: "9",
	        //kb
	        maxSize: "1024",
	        ext: ["png", "jpg"],
	        auto: true,
	        data: [],
	        showSize: false,
	        showName: false,
	        startUpload: function startUpload() {},
	        success: function success() {},
	        finishUpload: function finishUpload() {},
	        loadend: function loadend() {},
	        change: function change() {},
	        error: function error() {}
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
	    _init: function _init() {
	        this.data = [];
	        this.count = 0;
	        this._correctExt();
	        this._generateID();
	        this._renderDOM();
	        this.el = document.getElementById(this.options.el);
	        this.imgList = document.getElementById("webupload" + this.id).querySelector('.webupload-list');
	        this.btn = document.getElementById("webupload" + this.id).querySelector('.webupload-btn');
	        this._bindDeleteHanlde();
	        this._watch();
	    },
	    _renderDOM: function _renderDOM() {
	        var self = this;
	        var ul = document.createElement("ul");
	        ul.className = "webupload-list";
	        var width = 0;
	        var height = 0;
	        ["width", "paddingLeft", "paddingRight", "borderLeft", "borderRight"].forEach(function (value, index, array) {
	            width += IW.getStyle(self.el, value) ? parseFloat(IW.getStyle(self.el, value)) : 0;
	        });
	        ["height", "paddingTop", "paddingBottom", "borderTop", "borderBottom"].forEach(function (value, index, array) {
	            height += IW.getStyle(self.el, value) ? parseFloat(IW.getStyle(self.el, value)) : 0;
	        });
	        width = width == 0 ? "auto" : width + "px";
	        height = height == 0 ? "auto" : height + "px";
	        this.el.outerHTML = '<div class="webupload" id="webupload' + this.id + '"><div class="webupload-handle" style="position:relative; z-index:1; width:' + width + '; height:' + height + '; overflow:hidden;">' + this.el.outerHTML + '<input class="webupload-btn" type="file" name="images" multiple="multiple" style="position:absolute;z-index:1;left:-80px;;top:0; bottom:0; right:0; opacity:0;"></div>' + ul.outerHTML + '</div>';
	    },
	    _bindDeleteHanlde: function _bindDeleteHanlde() {
	        var self = this;
	        IW.event.addHandler(this.imgList, "click", function (e) {
	            var ele = IW.event.getTarget(e);
	            if (ele.className == "webupload-item-delete") {
	                var parent = ele.parentNode;
	                var index = Array.prototype.slice.call(self.imgList.querySelectorAll("li")).indexOf(parent);
	                parent.parentNode.removeChild(parent);
	                self.data.splice(index, 1);
	            }
	        });
	    },
	    //生成id
	    _generateID: function _generateID() {
	        webuploadID++;
	        this.id = webuploadID;
	    },
	    //矫正后缀
	    _correctExt: function _correctExt() {
	        var exts = this.options.ext,
	            extsLength = exts.length;
	        for (var i = 0; i < extsLength; i++) {
	            if (exts[i] == "jpg") {
	                exts[i] = "jpeg";
	                break;
	            }
	        }
	    },
	    _loadend: function _loadend(result, file) {
	        var li = document.createElement("li"),
	            img = document.createElement("img"),
	            progress = document.createElement("span"),
	            error = document.createElement("p"),
	            deleteBtn = document.createElement("i");
	        img.src = result;
	        img.className = "webupload-item";
	        li.style.position = "relative";
	        li.appendChild(img);
	        progress.className = "webupload-item-progress";
	        progress.style.position = "absolute";
	        progress.style.transition = "width 0.5s";
	        progress.style.opacity = "0.5";
	        progress.style.width = "0";
	        li.appendChild(progress);
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
	        // error
	        error.className = "webupload-item-error";
	        li.appendChild(error);
	        //delete
	        deleteBtn.className = "webupload-item-delete";
	        deleteBtn.style.position = "absolute";
	        li.appendChild(deleteBtn);
	        this.imgList.appendChild(li);
	        this.options.loadend(result, file);
	    },
	    _watch: function _watch() {
	        var self = this;
	        var needVerify = self.options.ext.length > 0 ? true : false;
	        this.btn.addEventListener("change", function (event) {
	            self.options.change();
	            var i = 0,
	                len = this.files.length,
	                img,
	                reader,
	                file;
	            if (this.files.length > self.options.limit) {
	                self.options.error("最多上传" + self.options.limit + "个文件");
	                return;
	            }
	            for (; i < len; i++) {
	                file = this.files[i];

	                if (needVerify && !self._filterType(file)) {
	                    self.options.error("文件" + file.name + "类型错误");
	                    break;
	                };
	                if (file.size / 1000 > self.options.maxSize) {
	                    self.options.error("文件" + file.name + "超过" + self.options.maxSize + "kb");
	                    break;
	                }
	                var data = new FormData();
	                data.append("images", file, file.name);
	                self.data.push(data);
	                if (window.FileReader && (file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif")) {
	                    reader = new FileReader();
	                    reader.onloadend = function (e) {
	                        self._loadend(e.target.result, file);
	                    };
	                    reader.readAsDataURL(file);
	                }
	            }
	            if (self.options.auto) {
	                self.upload();
	            }
	        }, false);
	    },
	    _filterType: function _filterType(file) {
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
	    _uploadStop: function _uploadStop() {
	        this.data = [];
	        this.count = 0;
	        this.btn.disabled = false;
	        this.el.classList.remove("disabled");
	    },
	    _upload: function _upload(data, index) {
	        //var sBoundary = "---------------------------" + Date.now().toString(16);
	        var self = this;
	        this._setExtraData(data);
	        var xhr = new XMLHttpRequest();
	        xhr.onreadystatechange = function () {
	            if (xhr.readyState == 4) {
	                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
	                    self.count++;
	                    self.options.success(self.count, self.data.length);
	                    if (self.count == self.data.length) {
	                        self._uploadStop();
	                        self.options.finishUpload();
	                    }
	                } else {
	                    self._uploadStop();
	                    self.imgList.querySelectorAll("li")[index].querySelector(".webupload-item-error").innerHTML = "上传失败，xhr.status" + xhr.status;
	                    //self.options.error(xhr.status)
	                }
	            }
	        };
	        xhr.open('POST', this.options.url, true);
	        xhr.setRequestHeader("Cache-Control", "no-cache");
	        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	        //xhr.onprogress = this._onprogress;
	        xhr.upload.onprogress = function (e) {
	            //var divStatus = document.getElementById("status");
	            if (event.lengthComputable) {
	                var percentage = event.loaded / event.total * 100 + "%";
	                self.imgList.querySelectorAll("li")[index].querySelector(".webupload-item-progress").style.width = percentage;
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
	    _setExtraData: function _setExtraData(data) {
	        var extraData = this.options.data;
	        if ((typeof extraData === "undefined" ? "undefined" : _typeof(extraData)) == "object") {
	            var key;
	            for (key in extraData) {
	                data.append(key, extraData[key]);
	            }
	        }
	    },
	    upload: function upload() {
	        var i = 0,
	            len = this.data.length;
	        if (len = 0) {
	            return;
	        };
	        this.options.startUpload();
	        this.btn.disabled = true;
	        this.el.classList.add("disabled");
	        for (; i < len; i++) {
	            this._upload(this.data[i], i);
	        }
	    }
	};
	window.Webupload = Webupload;
	exports.default = Webupload;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	exports.extend = function extend(object) {
	    // Takes an unlimited number of extenders.
	    var args = Array.prototype.slice.call(arguments, 1);

	    // For each extender, copy their properties on our object.
	    for (var i = 0, source; source = args[i]; i++) {
	        if (!source) continue;
	        for (var property in source) {
	            object[property] = source[property];
	        }
	    }

	    return object;
	};

	exports.ajax = function ajax(options) {
	    options.error = options.error | function () {};
	    // var params = [];
	    // if (typeof options.data === "object") {
	    //     for (key in options.data) {
	    //         params.push(key + '=' + options.data[key])
	    //     }
	    //     options.data = params.join("&");
	    // }
	    var headers = {},
	        setHeader = function setHeader(name, value) {
	        headers[name.toLowerCase()] = [name, value];
	    };
	    setHeader('Content-Type', options.contentType || 'application/x-www-form-urlencoded; charset=UTF-8');

	    function createXHR() {
	        if (typeof XMLHttpRequest != "undefined") {
	            return new XMLHttpRequest();
	        } else if (typeof ActiveXObject != "undefined") {
	            if (typeof arguments.callee.activeXString != "string") {
	                var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"];
	                for (var i = 0, len = versions.length; i < len; i++) {
	                    try {
	                        var xhr = new ActiveXObject(versions[i]);
	                        arguments.callee.activeXString = versions[i];
	                        return xhr;
	                    } catch (ex) {
	                        //跳过
	                    }
	                }
	            }
	            return new ActiveXObject(arguments.callee.activeXString);
	        } else {
	            throw new Error("NO XHR object available.");
	        }
	    }
	    var xhr = createXHR();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
	                options.success(xhr.responseText);
	            } else {
	                options.error(xhr.status);
	            }
	        }
	    };

	    xhr.open(options.type, options.url, true);
	    for (name in headers) {
	        xhr.setRequestHeader.apply(xhr, headers[name]);
	    }if (options.type == "post") {
	        xhr.send(options.data);
	    } else {
	        xhr.send(null);
	    }
	};
	exports.getStyle = function (elem, style) {
	    // 主流浏览器
	    if (window.getComputedStyle) {
	        return window.getComputedStyle(elem, null)[style];
	    } else {
	        return elem.currentStyle[style];
	    }
	};

	exports.event = {
	    getEvent: function getEvent(event) {
	        return event ? event : window.event;
	    },
	    getTarget: function getTarget(event) {
	        return event.target || event.srcElement;
	    },
	    preventDefault: function preventDefault(event) {
	        if (event.preventDefault) {
	            event.preventDefault();
	        } else {
	            event.returnValue = false;
	        }
	    },
	    stopPropagation: function stopPropagation(event) {
	        if (event.stopPropagation) {
	            event.stopPropagation();
	        } else {
	            event.cancelBubble = true;
	        }
	    },
	    addHandler: function addHandler(element, type, handler) {
	        if (element.addEventListener) {
	            element.addEventListener(type, handler, false);
	        } else if (element.attachEvent) {
	            element.attachEvent("on" + type, handler);
	        } else {
	            element["on" + type] = handler;
	        }
	    },
	    removeHandler: function removeHandler(element, type, handler) {
	        if (element.removeEventListener) {
	            element.removeEventListener(type, handler, false);
	        } else if (element.detachEvent) {
	            element.detachEvent("on" + type, handler);
	        } else {
	            element["on" + type] = null;
	        }
	    }
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Emulate FormData for some browsers
	 * MIT License
	 * (c) 2010 François de Metz
	 */
	(function (w) {
	    if (w.FormData) return;
	    function FormData() {
	        this.fake = true;
	        this.boundary = "--------FormData" + Math.random();
	        this._fields = [];
	    }
	    FormData.prototype.append = function (key, value) {
	        this._fields.push([key, value]);
	    };
	    FormData.prototype.toString = function () {
	        var boundary = this.boundary;
	        var body = "";
	        this._fields.forEach(function (field) {
	            body += "--" + boundary + "\r\n";
	            // file upload
	            if (field[1].name) {
	                var file = field[1];
	                body += "Content-Disposition: form-data; name=\"" + field[0] + "\"; filename=\"" + file.name + "\"\r\n";
	                body += "Content-Type: " + file.type + "\r\n\r\n";
	                body += file.getAsBinary() + "\r\n";
	            } else {
	                body += "Content-Disposition: form-data; name=\"" + field[0] + "\";\r\n\r\n";
	                body += field[1] + "\r\n";
	            }
	        });
	        body += "--" + boundary + "--";
	        return body;
	    };
	    w.FormData = FormData;
	})(window);

/***/ }
/******/ ]);