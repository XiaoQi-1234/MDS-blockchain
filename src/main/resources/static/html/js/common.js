/**
 */

/**
 * 获取url中的参数
 * 若不填url，取当前页面的url
 *
 * @param name
 * @param url
 * @returns {*}
 */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// unit by millisecond
function unixToDateStr(t) {
    if (t == null) {
        t = 0;
    }
    let time = new Date(t);
    let dateStr = "";

    dateStr += time.getUTCFullYear() + "-";
    dateStr += (time.getUTCMonth() + 1) + "-";
    dateStr += time.getUTCDate();

    dateStr += " " + time.getUTCHours() + ":";
    dateStr += time.getUTCMinutes() + ":";
    dateStr += time.getUTCSeconds();

    return dateStr;
}

// return by millisecond
function dateStrToUnix(timeStr) {

}

/**
 * url后附加token参数
 * @param url
 * @returns {*}
 */
function getTokenUrl(url) {
    return common.getTokenUrl(url);

}

/**
 * 获取token
 * @returns {null}
 */
function getToken() {
    try {
        return window.parent.main.token;
    } catch (e) {
        return null;
    }
}


function addParameterToUrl(url, key, value) {
    if (url.indexOf('?') == -1) {
        return url + '?' + key + '=' + value;
    } else {
        return url + '&' + key + '=' + value;
    }
}

/**
 * http get方法获取数据
 * @param url url
 * @param dataCb 回调函数
 * @param errorCb 错误回调函数
 */
function httpGet(url, dataCb, errorCb) {
    httpDataGet(url, null, dataCb, errorCb);
}

/**
 * http get附加data获取数据
 * @param url url
 * @param data 附加data
 * @param dataCb 回调函数
 * @param errorCb 错误回调函数
 */
function httpDataGet(url, data, dataCb, errorCb) {
    $.ajax({
        type: "GET",
        url: url,
        data: data,
        success: function (data) {
            if (data == null) {
                if(errorCb != null){
                    errorCb();
                }
                return;
            }

            let oJson = eval('(' + data + ')');

            if (oJson['code'] !== "0x0000") {
                if(errorCb != null){
                    errorCb(oJson['msg']);
                }
                return;
            }
            if (dataCb !== null) {
                dataCb(oJson['data']);
            }
        },

        error: function (jqXHR, textStatus, error) {
            if (errorCb !== null) {
                errorCb(textStatus, error);
            }
        },
    });
}

/*
 * http post json object str
 */
function httpPost(url, jsonData, okCb, errorCb) {
    $.ajax({
        type: "POST",
        url: url,
        data: jsonData,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data) {
            if (okCb !== null) {
                okCb(data);
            }
        },
        error: function (jqXHR, textStatus, error) {
            if (errorCb !== null) {
                errorCb(textStatus, error);
            }
        },
    });
}

function httpPostJsonObject(url, jsonObject, okCb, errorCb) {
    $.ajax({
        type: "POST",
        url: url,
        data: jsonObject,
        dataType: 'json',
        success: function (data) {
            if (okCb !== null) {
                okCb(data);
            }
        },
        error: function (jqXHR, textStatus, error) {
            if (errorCb !== null) {
                errorCb(textStatus, error);
            }
        },
    });
}

function isDigital(str) {
    if (str == null || str == "") {
        return false;
    }

    if (str.trim() == '0') {
        return true;
    }

    let r = /^\+?[1-9][0-9]*$/;　　//判断是否为正整数
    return r.test(str);
}

String.format = function () {
    let s = arguments[0];
    for (let i = 0; i < arguments.length - 1; i++) {
        let reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }

    return s;
}

/**
 * 为String和Number添加padLeft字符补位函数
 * @type {Number.padLeft}
 */
String.prototype.padLeft = Number.prototype.padLeft = function (total, pad) {
    return (Array(total).join(pad || 0) + this).slice(-total);
}

/*---------------------------
    功能:停止事件冒泡
    ---------------------------*/
function stopBubble(e) {
    //如果提供了事件对象，则这是一个非IE浏览器
    if (e && e.stopPropagation)
    //因此它支持W3C的stopPropagation()方法
        e.stopPropagation();
    else
    //否则，我们需要使用IE的方式来取消事件冒泡
        window.event.cancelBubble = true;
}

//阻止浏览器的默认行为
function stopDefault(e) {
    //阻止默认浏览器动作(W3C)
    if (e && e.preventDefault)
        e.preventDefault();
    //IE中阻止函数器默认动作的方式
    else
        window.event.returnValue = false;
    return false;
}

function getrandom(minNum,total,size){
    var num = total; //定义整数
    var length= size;  //定义多个整数的数量
    var numArr = [];
    while(length > 1){
        var rnd = Math.floor(Math.random() * num); //通过JS的随机函数生成随机数
        if(rnd>10 && rnd<30){
            num -= rnd;
            numArr.push(rnd);
            length --;
        }
    }
    numArr.push(num);
    console.info(numArr);
    return numArr;
}

function noticeSuccess(text){
    new NoticeJs({
        text: text,
        position: 'topRight',
        animation: {
            open: 'animated bounceInRight',
            close: 'animated bounceOutRight'
        }
    }).show();
}

function noticeError(text){
    new NoticeJs({
        text: text,
        type: 'error',
        position: 'topRight',
        animation: {
            open: 'animated bounceInRight',
            close: 'animated bounceOutRight'
        }
    }).show();
}
String.prototype.toFixed = function (N) {
    if (this.length >= N) {
        return this.slice(0, N) + '...'
    }
    return this;
};

Date.prototype.format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    return fmt;
};

const common = new class {
    /**
     * 获取url中的参数
     * 若不填url，取当前页面的url
     *
     * @param name
     * @param url
     * @returns {*}
     */
    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    getParameter(s) {
        let sPageURL = decodeURIComponent(self.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === s) {
                return sParameterName[1];
            }
        }
    }

    tokenGet(url, callback, errorCallback) {
        this.get(this.getTokenUrl(url), callback, errorCallback);
    }

    get(url, callback, errorCallback) {
        httpGet(url, callback, errorCallback);
    }

    tokenPost(url, params, callback, errorCallback) {
        this.post(this.getTokenUrl(url), params, callback, errorCallback);
    }

    post(url, params, callback, errorCallback) {
        $.post(url, params, function (obj, status, xhr) {
            switch (xhr.status) {
                case 404:
                    common.notFound();
                    break;
            }
            if (typeof obj === 'string') {
                obj = JSON.parse(obj);
            }
            switch (obj.code) {
                case '0x0000':
                    if (callback instanceof Function) {
                        callback(obj.data);
                    }
                    break;
                default:
                    if (errorCallback instanceof Function) {
                        errorCallback(obj);
                    }
                    break;
            }
        });
    }

    getTokenUrl(url) {
        try {
            if (url.indexOf('?') == -1) {
                return url + '?token=' + window.parent.main.token;
            } else {
                return url + '&token=' + window.parent.main.token;
            }
        } catch (e) {
            return url;
        }
    }

    notFound() {
        window.location.href = this.getTokenUrl("/cms/cmsManagerController/notFound");
    }

    alert(msg) {
        console.log(msg);
    }
};
