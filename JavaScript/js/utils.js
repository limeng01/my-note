/** 字符串模块 */
class ModuleString {
    /**
     * 过滤只保留数字及小数点
     * @param {string} string 字符串
     */
    onlyNumber(string) {
        // 去空格
        let value = string.trim();
        // 默认返回 0
        if (value.length === 0) return 0;
        // 正则过滤剩下数字和小数点
        value = value.replace(/[^0-9.]+/g, '');
        return parseFloat(value);
    }

    /**
     * 数字带逗号分隔
     * @param {number} num
     * @example 
     * flterToThousand(10000) => "10,000"
     */
    flterToThousand(num) {
        // return num.toLocaleString('en-US');
        return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
    }

    /**
     * 首字母大写
     * @param {string} string 
     */
    firstToUpperCase(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * 带单位的数值转换
     * @param {number} value 数字
     */
    unitsNumber(value) {
        value = Math.floor(value);
        if (value === 0) return 0;
        const units = ['', 'k', 'm', 'b', 'f', 'e', 'ae', 'be', 'ce', 'de', 'ee', 'fe', 'ge', 'he', 'ie'];
        const index = Math.floor(Math.log(value) / Math.log(1000));
        let result = value / Math.pow(1000, index);
        if (index === 0) return result;
        result = result.toFixed(3);
        // 不进行四舍五入 取小数点后一位
        result = result.substring(0, result.lastIndexOf('.') + 2);
        return result + units[index];
    }

    /**
     * 获取`url?`后面参数（JSON对象）
     * @param {string} value 要格式的字段，默认`location.search`
     * @param {string} name 获取指定`key`值
     * @example 
     * searchFormat();
     * const data = '?id=12&name=hjs&age=2018/12/12';
     * searchFormat(data, 'age')
     * @returns {{}|string}
     */
    getQueryParam(value = location.search, name = null) {
        const code = decodeURIComponent(value.slice(1));
        if (!code) return null;
        const param = JSON.parse(`{"${code.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`);
        if (name) {
            return param[name] || null;
        } else {
            return param
        }
    }

    /**
     * 获取目标类型
     * @description 判定`JavaScript`中数据类型的终极解决方法
     * @param {any} target 
     */
    getTargetType(target) {
        const arrayType = Object.prototype.toString.call(target);
        // return arrayType.replace(/\[object\s(.+)\]/, '$1').toLowerCase();
        return arrayType.slice(8, arrayType.length - 1).toLowerCase();
    }

    /**
     * rgb 转 16进制 
     * @param {string} string rgb(125, 125, 125)
     */
    rgbToHex(string) {
        var rgb = string.split(',');
        var r = parseInt(rgb[0].split('(')[1]);
        var g = parseInt(rgb[1]);
        var b = parseInt(rgb[2].split(')')[0]);
        var hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        return hex;
    }

    /** 
    * hex16 进制颜色转 rgb(rgba)
    * @param {string} hex '#23ff45' 
    */
    hexToRgb(hex) {
        return 'rgb(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ',' + parseInt('0x' + hex.slice(5, 7)) + ')';
    }

    /** 随机16进制颜色 */
    randomHex() {
        return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0');
    }

    /**
     * 检测类型
     * @param {any} target 检测的目标
     * @returns {'string'|'number'|'array'|'object'|'function'|'null'|'undefined'} 只枚举一些常用的类型
     */
    checkType(target) {
        /** @type {string} */
        const value = Object.prototype.toString.call(target);
        const result = value.match(/\[object (\S*)\]/)[1];
        return result.toLocaleLowerCase();
    }
}

/** 数字模块 */
class ModuleNumber extends ModuleString {
    /**
     * 范围随机整数
     * @param {number} min 最小数
     * @param {number} max 最大数
     */
    ranInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 数字运算（主要用于小数点精度问题）
     * @param {number} a 前面的值
     * @param {'+'|'-'|'*'|'/'} type 计算方式
     * @param {number} b 后面的值
     */
    computeNumber(a, type, b) {
        /**
         * 获取数字小数点的位数
         * @param {number} n 数字
         */
        const getLenth = n => {
            const string = n.toString().split('.')[1];
            return string ? string.length : 0;
        }
        /** 倍率 */
        const value = Math.pow(10, Math.max(getLenth(a), getLenth(b)));
        let result = 0;
        switch (type) {
            case '+':
                result = a * value + b * value;
                break;
            case '-':
                result = a * value - b * value;
                break;
            case '*':
                result = (a * value) * (b * value);
                break;
            case '/':
                result = (a * value) / (b * value);
                break;
        }
        return result / value;
    }

    /**
     * `Math.hypot`兼容方法
     * @param {Array<number>} values 
     */
    hypot(...values) {
        const length = values.length;
        let result = 0;
        for (let i = 0; i < length; i++) {
            if (values[i] === Infinity || values[i] === -Infinity) {
                return Infinity;
            }
            result += values[i] * values[i];
        }
        return Math.sqrt(result);
    }

    /**
     * 获取两个坐标（二维）之间距离
     * @param {{x: number, y: number}} size1 坐标一
     * @param {{x: number, y: number}} size2 坐标二
     */
    getSizeDistance(size1, size2) {
        const dx = size2.x - size1.x;
        const dy = size2.y - size1.y;
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));  
        // return this.hypot(size2.x - size1.x, size2.y - size1.y);
    }

    /**
     * 传入角度计算圆周长上的点坐标
     * @param {number} deg 角度
     * @param {number} radius 范围半径
     */
    computeCircularPosition(deg = 0, radius = 100) {
        const x = Math.round(radius * Math.sin(deg * Math.PI / 180));
        const y = Math.round(radius * Math.cos(deg * Math.PI / 180));
        return { x, y }
    }

    /**
     * 获取两个坐标（经纬度）点距离
     * @param {object} location1 坐标1
     * @param {number} location1.lng 经度
     * @param {number} location1.lat 维度
     * @param {object} location2 坐标2
     * @param {number} location2.lng 经度
     * @param {number} location2.lat 维度
     */
    getLocationDistance(location1, location2) {
        const toRad = d => d * Math.PI / 180;
        const radLat1 = toRad(location1.lat);
        const radLat2 = toRad(location2.lat);
        const deltaLat = radLat1 - radLat2;
        const deltaLng = toRad(location1.lng) - toRad(location2.lng);
        const dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
        return dis * 6378137;
    }

    /**
     * 检测两个节点坐标是否相交
     * @param {{left: number, top: number, width: number, height: number}} a 
     * @param {{left: number, top: number, width: number, height: number}} b 
     */
    isCollision(a, b) {
        const ax = a.left;
        const ay = a.top;
        const aw = a.width;
        const ah = a.height;
        const bx = b.left;
        const by = b.top;
        const bw = b.width;
        const bh = b.height;
        return (ax + aw > bx && ax < bx + bw && ay + ah > by && ay < by + bh);
    }
}

/** 数组类处理模块 */
class ModuleArray extends ModuleNumber {
    /**
     * 从对象数组中查找匹配项 ES5 实现 ES6 array.find()
     * @param {Array<T>} array array
     * @param {(item: T, index: number) => boolean} contrast 对比函数
     */
    findItem(array, contrast) {
        if (typeof contrast !== 'function') return console.warn('findItem 传入的第二个参数类型必须为function');
        var result = null;
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if (contrast(item, i)) {
                result = item;
                break;
            }
        }
        return result;
    }

    /**
     * 随机打乱数组
     * @param {Array<T>} array
     */
    shuffleArray(array) {
        return array.sort(() => Math.random() > 0.5 ? -1 : 1);
        // 洗牌随机法（性能最优）
        for (let i = array.length - 1; i >= 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
            let itemAtIndex = array[randomIndex];
            array[randomIndex] = array[i];
            array[i] = itemAtIndex;
        }
        return array;
    }

    /**
     * 数组中随机取几个元素
     * @param {Array<T>} array 数组
     * @param {number} count 元素个数
     */
    getRandomArrayElements(array, count) {
        let length = array.length;
        let min = length - count;
        let index = 0;
        let value = '';
        while (length-- > min) {
            index = Math.floor((length + 1) * Math.random());
            value = array[index];
            array[index] = array[length];
            array[length] = value;
        }
        return array.slice(min);
    }

    /**
     * 将指定位置的元素置顶
     * @param {Array<T>} array 改数组
     * @param {number} index 元素索引
     */
    zIndexToTop(array, index) {
        if (index != 0) {
            const item = array[index];
            array.splice(index, 1);
            array.unshift(item);
        } else {
            console.log('已经处于置顶');
        }
    }

    /**
     * 将指定位置的元素置底
     * @param {Array<T>} array 改数组
     * @param {number} index 元素索引
     */
    zIndexToBottom(array, index) {
        if (index != array.length - 1) {
            const item = array[index];
            array.splice(index, 1);
            array.push(item);
        } else {
            console.log('已经处于置底');
        }
    }

}

class ModuleDate extends ModuleArray {
    /**
     * 时间日期类型日期模块
     * @example
     * new Date().toLocaleDateString();         => `2020/12/12`
     * new Date().toTimeString().slice(0, 8);   => `12:12:12`
     * new Date().toLocaleTimeString();         => `上/下午12:12:12` 
     * new Date().toLocaleString();             => `2020/12/12 上/下午12:12:12`
     */
    constructor() {
        super();
    }

    /** 日期列表生成 */
    dateJson() {
        /**
         * 日历数组
         * @type {Array<{name: string, sub: Array<{name: string, sub: Array<{name: string}>}>}>}
         */
        const calendar = [];
        const date = new Date();
        const minYear = date.getFullYear();
        const maxYear = date.getFullYear() + 10;
        let dayCount = 1;
        for (let i = minYear; i <= maxYear; i++) {
            const year = {
                name: i.toString(),
                sub: []
            }
            for (let j = 1; j <= 12; j++) {
                const month = {
                    name: ('0' + j.toString()).slice(-2),
                    sub: []
                };
                year.sub.push(month);
                dayCount = new Date(i, j, 0).getDate();
                for (let k = 1; k <= dayCount; k++) {
                    month.sub.push({
                        name: ('0' + k.toString()).slice(-2)
                    });
                }
            }
            calendar.push(year);
        }
        // 这里是限制不能选小于之前的日期
        calendar[0].sub.splice(0, date.getMonth());
        calendar[0].sub[0].sub.splice(0, date.getDate());
        return calendar;
    }

    /**
     * 时间生成器
     * @param {number} minInterval 时间间隔(分钟)
     */
    timeInterval(minInterval) {
        let arr = [];
        let minTotal = 0;
        while (minTotal < 1440) {
            let hour = Math.floor(minTotal / 60);
            let minute = Math.floor(minTotal % 60);
            hour = ('0' + hour).slice(-2);
            minute = ('0' + minute).slice(-2);
            minTotal += minInterval;
            arr.push(hour + ':' + minute);
            return arr;
        }
    }

    /**
     * 时间戳生成 
     * @param {number} num 1时为明天，-1为昨天天，以此类推
     * @return {'yyyy/mm/dd hh:mm:ss'}
     */
    getDateFormat(num = 0) {
        const date = new Date(Date.now() + (num * 24 * 3600 * 1000));
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        const hour = `0${date.getHours()}`.slice(-2);
        const minute = `0${date.getMinutes()}`.slice(-2);
        const second = `0${date.getSeconds()}`.slice(-2);
        return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
    }

    /**
     * 获取日期周几
     * @param {string} date 日期 '2019/04/28' & '2019/04/28 12:12:12'
     */
    getDateDayString(date) {
        return '周' + '日一二三四五六'.charAt(new Date(date).getDay());
    }

    /**
     * 获取两个时间段的秒数
     * @param {Date} now 现在时间
     * @param {Date} before 之前的时间
     */
    getDateSlotSecond(now, before) {
        return (now.getTime() - before.getTime()) / 1000;
    }

    /**
     * 获取两个日期之间的天数
     * @param {Date} now 现在时间
     * @param {Date} before 之前时间
     */
    getDateSlotDays(now, before) {
        return Math.floor((now.getTime() - before.getTime()) / 86400000);
    }

    /**
     * 将秒数换成时分秒格式
     * @param {number} value 秒数
     * @returns {{day: string, hour: string, minute: string, second: string}}
     */
    secondFormat(value) {
        let day = 0, hour = 0, minute = 0, second = 0;
        day = Math.floor(value / (24 * 3600));
        hour = Math.floor(value / 3600) - (day * 24);
        minute = Math.floor(value / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(value) - (day * 24 * 3600) - (hour * 3600) - (minute * 60);
        // 格式化
        day = ('0' + day).slice(-2);
        hour = ('0' + hour).slice(-2);
        minute = ('0' + minute).slice(-2);
        second = ('0' + second).slice(-2);
        return { day, hour, minute, second };
    }

}

class ModuleBom extends ModuleDate {
    /** 浏览器模块 */
    constructor() {
        super();
        /** 缓存类型 */
        this.cache = window.sessionStorage;
    }

    /**
     * 本地储存数据
     * @param {string} key 对应的 key 值
     * @param {object} data 对应的数据
     */
    saveData(key, data) {
        this.cache.setItem(key, JSON.stringify(data));
    }

    /**
     * 获取本地数据
     * @param {string} key 对应的 key 值
     */
    fetchData(key) {
        let data = this.cache.getItem(key) ? JSON.parse(this.cache.getItem(key)) : null;
        return data;
    }

    /** 清除本地数据 */
    removeData() {
        this.cache.clear();
        // this.cache.removeItem('key');　// 删除键值对
    }

    /** 长震动 */
    vibrateLong() {
        if ('vibrate' in window.navigator) {
            window.navigator.vibrate(400);
        } else if (window['wx'] && wx.vibrateLong) {
            wx.vibrateLong();
        }
    }

    /** 短震动 */
    vibrateShort() {
        if ('vibrate' in window.navigator) {
            window.navigator.vibrate(15);
        } else if (window['wx'] && wx.vibrateShort) {
            wx.vibrateShort();
        }
    }

    /** 检查是否移动端 */
    isMobile() {
        const pattern = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i;
        return pattern.test(navigator.userAgent); //  ? 'Mobile' : 'Desktop';
    }

    /**
     * 创建浏览器指纹
     * @param {string} domain window.location.host
     */
    createFingerprint(domain) {
        /**
         * @param {string} string 
         */
        function bin2hex(string) {
            let result = '';
            for (let i = 0; i < string.length; i++) {
                const n = string.charCodeAt(i).toString(16);
                result += n.length < 2 ? '0' + n : n;
            }
            return result;
        }
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const txt = domain || 'hjs.com';
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.textBaseline = 'tencent';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText(txt, 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText(txt, 4, 17);
        let b64 = canvas.toDataURL().replace('data:image/png;base64,', '');
        let bin = atob(b64);
        return bin2hex(bin.slice(-16, -12));
    }

    /**
     * 写入并下载文件（只支持Chrome && Firefox）
     * @param {string} filename 文件名 xxx.text | xxx.js | xxx.[type]
     * @param {string} content 文件内容
     */
    download(filename, content) {
        const label = document.createElement('a');
        label.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        label.setAttribute('download', filename);
        if (document.createEvent) {
            const event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            label.dispatchEvent(event);
        } else {
            label.click();
        }
    }

    /**
     * 复制文本
     * @param {string} text 复制的内容
     * @param {function(): void} success 成功回调
     * @param {(error: string) => void} fail 出错回调
     */
    copyText(text, success = null, fail = null) {
        text = text.replace(/(^\s*)|(\s*$)/g, '');
        if (!text) {
            typeof fail === 'function' && fail('复制的内容不能为空！');
            return;
        }
        const id = 'the-clipboard';
        let clipboard = document.getElementById(id);
        if (!clipboard) {
            clipboard = document.createElement('textarea');
            clipboard.id = id;
            clipboard.style.cssText = 'font-size: 15px; position: fixed; top: -1000%; left: -1000%;';
            document.body.appendChild(clipboard);
        }
        clipboard.value = text;
        clipboard.select();
        clipboard.setSelectionRange(0, clipboard.value.length);
        document.execCommand('copy');
        typeof success === 'function' && success();
    }
}

/** dom 模块 */
class ModuleDom extends ModuleBom {
    /**
     * 单个元素查找
     * @param {string} name class | id | label <div> <p>
     * @returns {HTMLElement}
     */
    find(name) {
        return document.querySelector(name);
    }

    /**
     * 多个元素查找
     * @param {string} name class | id | label <div> <p>
     * @returns {Array<HTMLElement>}
     */
    findAll(name) {
        let nodes = document.querySelectorAll(name);
        if (Array.from) {
            nodes = Array.from(nodes);
        } else {
            nodes = [].slice.call(nodes);
        }
        return nodes;
    }

    /**
     * 设置样式
     * @param {HTMLElement} el 设置样式的元素
     * @param {CSSStyleDeclaration} styles 样式 
     */
    setStyle(el, styles) {
        for (const key in styles) {
            el.style[key] = styles[key];
        }
    }

    /**
     * 检测元素是否存在指定 calss
     * @param {HTMLElement} el 当前元素
     * @param {string} className class name
     */
    hasClass(el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
        }
    }

    /**
     * 给元素添加 calss
     * @param {HTMLElement} el 当前元素
     * @param {string} className class name
     */
    addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            if (!this.hasClass(el, className)) {
                let name = el.className.charAt(el.className.length - 1) === ' ' ? className : ' ' + className;
                el.className += name;
            }
        }
    }

    /**
     * 给元素移除指定 calss
     * @param {HTMLElement} el 当前元素
     * @param {string} className class name
     */
    removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            if (this.hasClass(el, className)) {
                let reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                el.className = el.className.replace(reg, ' ');
            }
        }
    }

    /**
     * 切换 calss name
     * @param {HTMLElement} el 当前元素
     * @param {string} className class name
     */
    toggleClass(el, className) {
        if (el.classList) {
            el.classList.toggle(className);
        } else {
            if (this.hasClass(el, className)) {
                this.removeClass(el, className);
            } else {
                this.addClass(el, className);
            }
        }
    }

    /**
     * 获取元素的的矩阵坐标
     * @param {HTMLElement} el 当前元素
     */
    getRect(el) {
        return el.getBoundingClientRect();
    }

    /**
     * 动画帧更新
     * @param {Function} callback 动画帧函数
     */
    update(callback = null) {
        if (typeof callback !== 'function') return console.log('缺少动画函数');
        /** 动画帧 */
        const AnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        /** 动画开始 */
        function move() {
            callback();
            AnimationFrame(move);
        }
        move();
    }

    /**
     * rem 适配
     * @param {HTMLElement} el 指定元素
     */
    remSetting(el) {
        const html = document.documentElement; // 注意这里不能使用 document.body
        /** 比例值 */
        const value = 375 / 50;
        /** 视口宽度 */
        let width = el.clientWidth;
        // 首次适配
        html.style.fontSize = width / value + 'px';
        // 窗口变动时更新适配
        window.addEventListener('resize', function () {
            width = el.clientWidth;
            html.style.fontSize = width / value + 'px';
        });
    }

    /**
     * 设置节点数字动画
     * @param {object} options 配置参数
     * @param {HTMLElement} options.el 目标节点
     * @param {number} options.number 最终显示的数字
     * @param {number} options.time （可选）多少毫秒内完成，默认1秒
     * @param {Function} options.callback （可选）完成回调
     */
    setNumberAnimation(options) {
        const an = requestAnimationFrame;
        const el = options.el;
        const result = options.number || 188.88;
        const time = (options.time || 1000) / 1000;
        const step = result / (time * 60);
        let count = 0;
        function move() {
            count += step;
            if (count >= result) {
                count = result;
                el.textContent = count.toFixed(2);
                if (typeof options.callback === 'function') options.callback();
            } else {
                el.textContent = count.toFixed(2);
                an(move);
            }
        }
        el.textContent = count.toFixed(2);
        move();
    }
    /** 
     * 获取`body`标签中的所有内容 
     * @param {string} value 
    */
    getBodyLabelContent(value) {
        // value = value.replace(/\n/g, '');
        const rule = /<[^>]*?body[^>]*?>([\s\S]*)<\/\s*body\s*>/;
        // console.log(rule.exec(value));
        const result = rule.exec(value);
        if(result && result.length === 2) {
            return result[1];
        }
        return value;
    }

    /**
     * 获取所有`script`标签的内容
     * @param {string} value 
     */
    getAllScriptContent(value) {
        const rule = /<[^>]*?script[^>]*?>[\s\S]*<\/\s*script\s*>/i;  // /<script id="main">([\s\S]*)<\/script>/;
        const start = /<script[^>]*?>/g; // <[^>]*?script[^>]*?>
        const end = /<\/\s*script\s*>/g;
        const code = rule.exec(value);
        let result = '';
        // console.log(code);
        if(code && code.length === 1) {
            result = code[0];
        } 
        // console.log(result.replace(start, ''));
        return result.replace(start, '').replace(end, ';');
    }

    /** 自定义 log */
    log() {
        const args = [].slice.call(arguments);
        args.unshift('%c the-log >>', 'color: #4fc08d');
        console.log.apply(console, args);
    }
}

const utils = new ModuleDom();