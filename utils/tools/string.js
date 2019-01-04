let str = {
  // 生成uuid
  uuid: function () {
    let S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
  },
  randomCode:function (len) {
    var code = ''
    const random = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R', 'S','T','U','V','W','X','Y','Z']
    for(let i = 0; i < len; i++){
      //设置随机数范围,这设置为0 ~ 36
      let index = Math.floor(Math.random()*36);
      code += random[index];
    }
    return code
  },
  // 编码
  encrypt: function(str, k) {
    let string = "";
    for(let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i);
      if(c >= 97 && c <= 122) {
        c += k % 26;
        if(c < 97) {
          c += 26;
        }
        if(c > 122) {
          c -= 26;
        }
      } else if(c >= 65 && c <= 90) {
        c += k % 26;
        if(c < 65) {
          c += 26;
        }
        if(c > 122) {
          c -= 26;
        }
      }
      string += String.fromCharCode(c);
    }
    return string;
  },
  // 解码
  decrypt: function(str, n) {
    let string = "";
    let k = parseInt("-" + n);
    for(let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i);
      if(c >= 97 && c <= 122) {
        c += k % 26;
        if(c < 97) {
          c += 26;
        }
        if(c > 122) {
          c -= 26;
        }
      } else if(c >= 65 && c <= 90) {
        c += k % 26;
        if(c < 65) {
          c += 26;
        }
        if(c > 122) {
          c -= 26;
        }
      }
      string += String.fromCharCode(c);
    }
    return string;
  },
  // 检测密码强度
  checkPwd: function (str) {
    let Lv = 0;
    if (str.length < 6) {
      return Lv
    }
    if (/[0-9]/.test(str)) {
      Lv++
    }
    if (/[a-z]/.test(str)) {
      Lv++
    }
    if (/[A-Z]/.test(str)) {
      Lv++
    }
    if (/[\.|-|_]/.test(str)) {
      Lv++
    }
    return Lv;
  },
  // 移除字符
  remove: function (str, character) {
    return str.replace(character, '');
  },
  // 替换字符
  replace: function (str, character, replacement) {
    return str.replace(character, replacement);
  },
  // 省略号
  ellipsis: function (str, len) {
    if(str){
      if (str.length > len) return str.substring(0, len) + "...";
      return str
    }
    return
  },
  // 过滤html代码(把<>转换)
  filterTag: function (str) {
    str = str.replace(/&/ig, "&amp;");
    str = str.replace(/</ig, "&lt;");
    str = str.replace(/>/ig, "&gt;");
    str = str.replace(/\//ig, "&#x2F;");
    str = str.replace(/\s/ig, "&nbsp;");
    return str;
  },
  // 过滤<script></script>转换
  filterScript: function (str) {
    return str.replace(/(<script)/ig, "&lt;script").replace(/(<script>)/ig, "&lt;script&gt;").replace(/(<\/script>)/ig, "&lt;/script&gt;");
  },
  // 获取十六进制随机颜色
  getRandomColor: function () {
    return '#' + ((h) => {
      return new Array(7 - h.length).join("0") + h;
    })((Math.random() * 0x1000000 << 0).toString(16));
  },
  // DOM转字符串
  domToStirng: function (htmlDOM) {
    let div = document.createElement("div");
    div.appendChild(htmlDOM);
    return div.innerHTML
  },
  // 字符串转DOM
  stringToDom: function (htmlString) {
    let div = document.createElement("div");
    div.innerHTML = htmlString;
    return div.children[0];
  },
  // 打散字符串成数组
  stringToArray: function (str, tag) {
    if (str.indexOf(tag) != -1) {
      return str.split(tag);
    }else {
      if (str != '') {
        return [str.toString()];
      }else {
        return [];
      }
    }
  }
}
export default str
