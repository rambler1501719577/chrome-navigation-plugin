export default {
    /**
     * 时间格式化
     * @param {*} time
     * @param {*} cFormat 格式为{y}-{m}-{d} {h}:{i}:{s}
     * @returns 格式化后的时间字符串
     */
    timeFormat: (time, cFormat) => {
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
            a: date.getDay(),
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
    },
    upper: (words) => {
        if (!words) return "";
        return words.toUpperCase();
    },
};
