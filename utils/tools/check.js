let check = {
  isBrowser: function(){
    let userAgent = navigator.userAgent,
      isOpera = userAgent.indexOf("Opera") > -1,
      isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera,
      isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1,
      isEdge = userAgent.indexOf("Edge") > -1 && !isIE,
      isFF = userAgent.indexOf("Firefox") > -1,
      isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1,
      isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1;

    // console.log(userAgent)
    if (isIE) {
      let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
      reIE.test(userAgent);
      let fIEVersion = parseFloat(RegExp["$1"]);
      return {name: 'IE', version: fIEVersion}
    }
    if (isIE11) return {name: 'IE11', version: 11};
    if (isEdge) return {name: 'Edge', version:0};
    if (isFF) return {name: 'Firefox', version: 0};
    if (isOpera) return {name: 'Opera', version: 0};
    if (isSafari) return {name: 'Safari', version: 0};
    if (isChrome) return {name: 'Chrome', version: 0};
  },
  isString: function (o) {
    return Object.prototype.toString.call(o).slice(8, -1) === 'String'
  },
  isNumber: function (o) {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Number'
  },
  isBoolean: function (o) {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Boolean'
  },
  isFunction: function (o) {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Function'
  },
  isNull: function (o) {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Null'
  },
  isUndefined: function (o) {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Undefined'
  },
  isObj: function (o) {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Object'
  },
  isArray: function (o) {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Array'
  },
  isDate: function (o) {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Date'
  },
  isError: function (o) {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Error'
  },
  isSymbol: function (o) {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Symbol'
  },
  isPromise: function (o) {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Promise'
  },
  isSet: function (o) {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Set'
  },
  isEmpty: function (o) {
    if(JSON.stringify(o) === "{}" || JSON.stringify(o) === "[]") return true
    return false
  },
  isFalse: function (o) {
    if (!o || o === 'null' || o === 'undefined' || o === 'false' || o === 'NaN') return true;
    return false
  },
  isInt: function(str){
    return /^-?\d+$/.test(str);
  },
  isPhone: function(str){
    return /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(str);
  },
  isTel: function(str){
    return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
  },
  isUser: function(str){
    return /^[a-zA-Z]\w{1,17}$/.test(str);//用户名以字母开头，长度在1~18之间，只能包含字母、数字和下划线
  },
  isPassword: function(str){
    return /^[a-zA-Z]\w{5,17}$/.test(str);//密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
  },
  isPostal: function(str){
    return /[1-9]\d{5}(?!\d)/.test(str);//邮政编码
  },
  isQQ: function(str){
    return /^[1-9][0-9]{4,9}$/.test(str);
  },
  isEmail: function(str){
    return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
  },
  isMoney: function(str){
    return /^\d*(?:\.\d{0,2})?$/.test(str);//金额(小数点2位)
  },
  isURL: function(str){
    return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(str);
  },
  isIP: function(str){
    return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(str);
  },
  isEnglish: function(str){
    return /^[a-zA-Z]+$/.test(str);
  },
  isChinese: function(str){
    return /^[\u4E00-\u9FA5]+$/.test(str);
  },
  isLower: function(str){
    return /^[a-z]+$/.test(str);
  },
  isUpper: function(str){
    return /^[A-Z]+$/.test(str);
  },
  isHTML: function(str){
    return /<("[^"]*"|'[^']*'|[^'">])*>/.test(str);
  },
  isSpace: function(str){
    return /\s/.test(str);
  },
  isIdCard: function(str){
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
  },
  isBankCard: function(str){
    return /^\d{16}|\d{19}$/.test(str);
  },
  isIos: function () {
    let u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
      // return "Android";
      return false
    } else if (u.indexOf('iPhone') > -1) {//苹果手机
      // return "iPhone";
      return true
    } else if (u.indexOf('iPad') > -1) {//iPad
      // return "iPad";
      return false
    } else if (u.indexOf('Windows Phone') > -1) {//winphone手机
      // return "Windows Phone";
      return false
    } else {
      return false
    }
  },
  isPC: function () {
    let userAgentInfo = navigator.userAgent;
    let Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    let flag = true;
    for (let v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  },
  isCardID: function (sId) {
    if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(sId)) {
      alert('你输入的身份证长度或格式错误');
      return false
    }
    //身份证城市
    let aCity = {
      11: "北京",
      12: "天津",
      13: "河北",
      14: "山西",
      15: "内蒙古",
      21: "辽宁",
      22: "吉林",
      23: "黑龙江",
      31: "上海",
      32: "江苏",
      33: "浙江",
      34: "安徽",
      35: "福建",
      36: "江西",
      37: "山东",
      41: "河南",
      42: "湖北",
      43: "湖南",
      44: "广东",
      45: "广西",
      46: "海南",
      50: "重庆",
      51: "四川",
      52: "贵州",
      53: "云南",
      54: "西藏",
      61: "陕西",
      62: "甘肃",
      63: "青海",
      64: "宁夏",
      65: "新疆",
      71: "台湾",
      81: "香港",
      82: "澳门",
      91: "国外"
    };
    if (!aCity[parseInt(sId.substr(0, 2))]) {
      alert('你的身份证地区非法')
      return false
    }

    // 出生日期验证
    let sBirthday = (sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2))).replace(/-/g, "/"),
      d = new Date(sBirthday)
    if (sBirthday != (d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate())) {
      alert('身份证上的出生日期非法')
      return false
    }

    // 身份证号码校验
    let sum = 0,
      weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
      codes = "10X98765432"
    for (let i = 0; i < sId.length - 1; i++) {
      sum += sId[i] * weights[i];
    }
    let last = codes[sum % 11]; //计算出来的最后一位身份证号码
    if (sId[sId.length - 1] != last) {
      alert('你输入的身份证号非法')
      return false
    }
    return true
  },
}
export default check
