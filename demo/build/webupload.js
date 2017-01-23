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

	var Init = __webpack_require__(2);
	__webpack_require__(3);
	var webuploadID = 0;
	function Webupload(options) {
	    this.options = {
	        el: "",
	        url: "",
	        limit: "9",
	        ext: ["png", "jpg"],
	        data: {},
	        success: function success() {},
	        loadend: function loadend() {},
	        error: function error() {}
	    };
	    this.options = Init.extend(this.options, options);
	    this.el = document.getElementById(this.options.el);
	    this.imgList = null;
	    this.id = "";
	    if (this.el) {

	        this._init();
	    } else {
	        throw new Error("未指定el.");
	    }
	}
	Webupload.prototype = {
	    _init: function _init() {
	        this._correctExt();
	        this._generateID();
	        this._renderDOM();
	        this.el = document.getElementById(this.options.el);
	        this.imgList = document.getElementById(this.id).querySelector('.webupload-list');
	        this._watch();
	    },
	    _renderDOM: function _renderDOM() {
	        var ul = document.createElement("ul");
	        ul.className = "webupload-list";
	        this.el.outerHTML = '<div class="webupload" id="' + this.id + '">\
	            <div class="webupload-handle">' + this.el.outerHTML + '</div>' + ul.outerHTML + '</div>';
	    },
	    //生成id
	    _generateID: function _generateID() {
	        webuploadID++;
	        this.id = 'webupload' + webuploadID;
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
	    _loadend: function _loadend(result, name) {
	        var li = document.createElement("li"),
	            img = document.createElement("img");
	        img.src = result;
	        li.appendChild(img);
	        this.imgList.appendChild(li);
	        this.options.loadend(result, name);
	    },
	    _watch: function _watch() {
	        var self = this;

	        var needVerify = self.options.ext.length > 0 ? true : false;
	        this.el.addEventListener("change", function (event) {
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
	                var data = new FormData();
	                file = this.files[i];
	                if (needVerify && !self._filterType(this.files[i])) {
	                    break;
	                };
	                if (window.FileReader) {
	                    reader = new FileReader();
	                    reader.onloadend = function (e) {
	                        self._loadend(e.target.result, file.name);
	                    };
	                    reader.readAsDataURL(file);
	                }
	                data.append("images", file, file.name);
	                self._upload(data);
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
	    _upload: function _upload(data) {
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
	    _onprogress: function _onprogress(e) {
	        //var divStatus = document.getElementById("status");
	        if (event.lengthComputable) {
	            console.log(event.loaded / event.total * 100 + "%");
	        }
	    },
	    //设置额外数据
	    _setExtraData: function _setExtraData(data) {
	        var extraData = this.options.data;
	        if ((typeof extraData === "undefined" ? "undefined" : _typeof(extraData)) == "object") {
	            var key;
	            for (key in extraData) {
	                data.append(key, extraData[key]);
	            }
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