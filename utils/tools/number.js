let num = {
  // 随机数范围
  random: function (min, max) {
    if (arguments.length === 2) {
      return Math.floor(min + Math.random() * ((max + 1) - min))
    } else {
      return null;
    }
  },
  /**
   * 抽奖概率
   * @param goods 奖品池，如：['一等奖'，'二等奖']
   * @param odds 概率数组，如：[0.1.0.9]
   * @returns {*}
   */
  randomGoods: function(goods,odds){
    let sum = 0,
      factor = 0,
      random = Math.random();

    for(let i = odds.length - 1; i >= 0; i--) {
      sum += odds[i]; // 统计概率总和
    };
    random *= sum; // 生成概率随机数
    for(let i = odds.length - 1; i >= 0; i--) {
      factor += odds[i];
      if(random <= factor) return goods[i];
    };
    return null;
  },
  //随机验证码
  randomCode:function (len) {
    var code = ''
    const random = [0,1,2,3,4,5,6,7,8,9]
    for(let i = 0; i < len; i++){
      let index = Math.floor(Math.random()*10);
      code += random[index];
    }
    return code
  },
  // 将数字转换成对应的中文小写
  formatSmallChinese: function (num) {
    let AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十");
    let BB = new Array("", "十", "百", "仟", "萬", "億", "点", "");
    let a = ("" + num).replace(/(^0*)/g, "").split("."),
      k = 0,
      re = "";
    for (let i = a[0].length - 1; i >= 0; i--) {
      switch (k) {
        case 0:
          re = BB[7] + re;
          break;
        case 4:
          if (!new RegExp("0{4}//d{" + (a[0].length - i - 1) + "}$")
            .test(a[0]))
            re = BB[4] + re;
          break;
        case 8:
          re = BB[5] + re;
          BB[7] = BB[5];
          k = 0;
          break;
      }
      if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0)
        re = AA[0] + re;
      if (a[0].charAt(i) != 0)
        re = AA[a[0].charAt(i)] + BB[k % 4] + re;
      k++;
    }

    if (a.length > 1) // 加上小数部分(如果有小数部分)
    {
      re += BB[6];
      for (let i = 0; i < a[1].length; i++)
        re += AA[a[1].charAt(i)];
    }
    if (re == '一十')
      re = "十";
    if (re.match(/^一/) && re.length == 3)
      re = re.replace("一", "");
    return re;
  },
  // 数字金钱表示
  formatMoney: function (num) {
    let str = num.toString()
    let newStr = "";
    let count = 0;

    if (str.indexOf(".") == -1) {
      for (let i = str.length - 1; i >= 0; i--) {
        if (count % 3 == 0 && count != 0) {
          newStr = str.charAt(i) + "," + newStr;
        } else {
          newStr = str.charAt(i) + newStr;
        }
        count++;
      }
      str = newStr + ".00"; //自动补小数点后两位
      return str
    } else {
      for (let i = str.indexOf(".") - 1; i >= 0; i--) {
        if (count % 3 == 0 && count != 0) {
          newStr = str.charAt(i) + "," + newStr; //碰到3的倍数则加上“,”号
        } else {
          newStr = str.charAt(i) + newStr; //逐个字符相接起来
        }
        count++;
      }
      str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
      return str
    }
  },
  // 中文大写金钱表示
  formatBigMoney: function (money) {
    //汉字的数字
    var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
    //基本单位
    var cnIntRadice = new Array('', '拾', '佰', '仟');
    //对应整数部分扩展单位
    var cnIntUnits = new Array('', '万', '亿', '兆');
    //对应小数部分单位
    var cnDecUnits = new Array('角', '分', '毫', '厘');
    //整数金额时后面跟的字符
    var cnInteger = '整';
    //整型完以后的单位
    var cnIntLast = '元';
    //最大处理的数字
    var maxNum = 999999999999999.9999;
    //金额整数部分
    var integerNum;
    //金额小数部分
    var decimalNum;
    //输出的中文金额字符串
    var chineseStr = '';
    //分离金额后用的数组，预定义
    var parts;
    if (money == '') { return ''; }
    money = parseFloat(money);
    if (money >= maxNum) {
      //超出最大处理数字
      return '';
    }
    if (money == 0) {
      chineseStr = cnNums[0] + cnIntLast + cnInteger;
      return chineseStr;
    }
    //转换为字符串
    money = money.toString();
    if (money.indexOf('.') == -1) {
      integerNum = money;
      decimalNum = '';
    } else {
      parts = money.split('.');
      integerNum = parts[0];
      decimalNum = parts[1].substr(0, 4);
    }
    //获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
      var zeroCount = 0;
      var IntLen = integerNum.length;
      for (var i = 0; i < IntLen; i++) {
        var n = integerNum.substr(i, 1);
        var p = IntLen - i - 1;
        var q = p / 4;
        var m = p % 4;
        if (n == '0') {
          zeroCount++;
        } else {
          if (zeroCount > 0) {
            chineseStr += cnNums[0];
          }
          //归零
          zeroCount = 0;
          chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
        }
        if (m == 0 && zeroCount < 4) {
          chineseStr += cnIntUnits[q];
        }
      }
      chineseStr += cnIntLast;
    }
    //小数部分
    if (decimalNum != '') {
      var decLen = decimalNum.length;
      for (var i = 0; i < decLen; i++) {
        var n = decimalNum.substr(i, 1);
        if (n != '0') {
          chineseStr += cnNums[Number(n)] + cnDecUnits[i];
        }
      }
    }
    if (chineseStr == '') {
      chineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (decimalNum == '') {
      chineseStr += cnInteger;
    }
    return chineseStr;
  },
  //数字单位
  numberUnit: function (num) {
    switch (true) {
      case num > 999999999:
        return `${(num/1000000000).toFixed(2)} 十亿`
        break
      case num > 99999999:
        return `${(num/100000000).toFixed(2)} 亿`
        break
      case num > 9999999:
        return `${(num/10000000).toFixed(2)} 千万`
        break
      case num > 999999:
        return `${(num/1000000).toFixed(2)} 百万`
        break
      case num > 99999:
        return `${(num/100000).toFixed(2)} 十万`
        break
      case num > 9999:
        return `${(num/10000).toFixed(2)} 万`
        break
      default:
        return num
    }
  }
}
export default num
