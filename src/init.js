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
    options.error = options.error | function() {}
    // var params = [];
    // if (typeof options.data === "object") {
    //     for (key in options.data) {
    //         params.push(key + '=' + options.data[key])
    //     }
    //     options.data = params.join("&");
    // }
    var headers = {},
            setHeader = function(name, value) {
                headers[name.toLowerCase()] = [name, value]
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
            throw new Error("NO XHR object available.")
        }
    }
    var xhr = createXHR();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                options.success(xhr.responseText)
            } else {
                options.error(xhr.status)
            }
        }
    };


    xhr.open(options.type, options.url, true);
    for (name in headers) xhr.setRequestHeader.apply(xhr, headers[name]);
    if (options.type == "post") {
        xhr.send(options.data);
    } else {
        xhr.send(null);
    }
}