/**
 * Parse the time to string
 * @param {( Object | string | number )} time
 * @param {string} cFormat
 * @returns {string | null}
 */
import axios from "axios";
export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null;
    }
    const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
    let date;
    if (typeof time === "object") {
        date = time;
    } else {
        if (typeof time === "string" && /^[0-9]+$/.test(time)) {
            time = parseInt(time);
        }
        if (typeof time === "number" && time.toString().length === 10) {
            time = time * 1000;
        }
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === "a") {
            return ["日", "一", "二", "三", "四", "五", "六"][value];
        }
        return value.toString().padStart(2, "0");
    });
    return time_str;
}

// 获取url中主机名称
export function getHostFromUrl(url) {
    return url.replace(/https?:\/\/([^?#/]+).*/g, (match, p1) => p1);
}

// 根据规则筛选数组中较大图标
function getBiggerIcon(iconArr) {
    let finalIcon = "";
    // 返回size信息，直接根据sizes进行匹配
    if (iconArr[0].sizes && iconArr[0].sizes !== "any") {
        // 降序排序后返回第一位
        iconArr.sort((icon1, icon2) => {
            let size1 = icon1.sizes.split("x")[0];
            let size2 = icon2.sizes.split("x")[0];
            return size2 - size1;
        });
        finalIcon = iconArr[0].src;
    } else {
        // 根据src中大小进行匹配
        let size = 0;
        iconArr.forEach(icon => {
            const src = icon.src;
            let reg = /\d+/gm;
            // 从后向前匹配数字，分两种情况
            // 如果存在多个图标，从后面匹配是图标正确大小
            // 如果只有一个图标，匹配的数字也不会影响结果
            let matchUrl = [...src.matchAll(reg)];
            if (matchUrl.length > 0) {
                let sizeStr = Number(matchUrl[matchUrl.length - 1][0]);
                if (sizeStr > size) {
                    size = sizeStr;
                    finalIcon = src;
                }
            }
        });
    }
    // 异常情况的默认值
    if (!finalIcon) finalIcon = iconArr[0].src;
    return finalIcon;
}

/**
 * 获取站点favicon
 * @param {*} url
 * @returns
 */
export function getFaviconByUrl(url) {
    return new Promise((resolve, reject) => {
        axios(`http://82.156.8.154/favicon/api/grab/${url}`)
            .then(res => {
                if (res.data.icons.length > 0)
                    resolve(getBiggerIcon(res.data.icons));
                else resolve("");
            })
            .catch(err => {
                reject(err);
            });
    });
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
    if (("" + time).length === 10) {
        time = parseInt(time) * 1000;
    } else {
        time = +time;
    }
    const d = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;

    if (diff < 30) {
        return "刚刚";
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + "分钟前";
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + "小时前";
    } else if (diff < 3600 * 24 * 2) {
        return "1天前";
    }
    if (option) {
        return parseTime(time, option);
    } else {
        return (
            d.getMonth() +
            1 +
            "月" +
            d.getDate() +
            "日" +
            d.getHours() +
            "时" +
            d.getMinutes() +
            "分"
        );
    }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
    const search = url.split("?")[1];
    if (!search) {
        return {};
    }
    return JSON.parse(
        '{"' +
            decodeURIComponent(search)
                .replace(/"/g, '\\"')
                .replace(/&/g, '","')
                .replace(/=/g, '":"')
                .replace(/\+/g, " ") +
            '"}'
    );
}

/**
 * @param {Object} data
 * 将2019-04-18T00:08:30.000 0000转化为正常格式
 */
export function timeFormat(date) {
    var dateee = new Date(date).toJSON();
    return new Date(+new Date(dateee) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
}

/**
 * 平滑滚动到顶部
 * @param offsetTop 滚动到距离顶部距离(单位px)
 */
export function scrollToTop(offsetTop) {
    window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
    });
}

/**
 * generate a random num between min and max
 * @param {Object} min
 * @param {Object} max
 */
export function randomNum(min, max) {
    return parseInt(Math.random() * (max - min + 1) + min);
}

export function message(message) {
    let dom = document.createElement("div");
    dom.classList = "rambler-message animated bounceIn";
    dom.innerHTML = message;
    document.body.appendChild(dom);
    setTimeout(function() {
        dom.style = "";
        document.body.removeChild(dom);
    }, 2000);
}

/**
 * 批量导出
 * @see https://webpack.docschina.org/guides/dependency-management/#context-module-api
 * @param {Object} req
 */
export function batchImport(req) {
    req.keys().forEach(req);
}

// get localstorage data
export function getCachedData(key) {
    if (!key) return undefined;
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
        return JSON.parse(cachedData);
    }
    return undefined;
}
