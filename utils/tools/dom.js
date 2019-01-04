let dom = {
  /*光标所在位置插入字符*/
  insertAtCursor: function (dom, val, sel) {
    if (document.selection) {
      dom.focus();
      sel = document.selection.createRange();
      sel.text = val;
      sel.select();
    } else if (dom.selectionStart || dom.selectionStart == '0') {
      let startPos = dom.selectionStart;
      let endPos = dom.selectionEnd;
      let restoreTop = dom.scrollTop;
      dom.value = dom.value.substring(0, startPos) + val + dom.value.substring(endPos, dom.value.length);
      if (restoreTop > 0) {
        dom.scrollTop = restoreTop;
      }
      dom.focus();
      dom.selectionStart = startPos + val.length;
      dom.selectionEnd = startPos + val.length;
    } else {
      dom.value += val;
      dom.focus();
    }
  },
  /**
   * 光标所在位置插入字符，并设置光标位置
   *
   * @param {dom} 输入框
   * @param {val} 插入的值
   * @param {posLen} 光标位置处在 插入的值的哪个位置
   */
  insertAtCursorByDistance: function (dom, val, posLen) {
    let cursorPosition = 0;
    if (dom.selectionStart) {
      cursorPosition = dom.selectionStart;
    }
    this.insertAtCursor(dom, val);
    dom.focus();
    console.log(posLen)
    dom.setSelectionRange(dom.value.length, cursorPosition + (posLen || val.length));
  },
  /*图片等比例缩放*/
  scaleImage: function (ImgD, iwidth, iheight) {
    //参数(图片,允许的宽度,允许的高度)
    let image = new Image();
    image.src = ImgD.src;
    if (image.width > 0 && image.height > 0) {
      if (image.width / image.height >= iwidth / iheight) {
        if (image.width > iwidth) {
          ImgD.width = iwidth;
          ImgD.height = (image.height * iwidth) / image.width;
        } else {
          ImgD.width = image.width;
          ImgD.height = image.height;
        }
        ImgD.alt = image.width + "×" + image.height;
      } else {
        if (image.height > iheight) {
          ImgD.height = iheight;
          ImgD.width = (image.width * iheight) / image.height;
        } else {
          ImgD.width = image.width;
          ImgD.height = image.height;
        }
        ImgD.alt = image.width + "×" + image.height;
      }
    }
  },
  /*图片加载*/
  loadImgAll: function (arr, callback) {
    let arrImg = [];
    for (let i = 0; i < arr.length; i++) {
      let img = new Image();
      img.src = arr[i].src;
      img.onload = function () {
        arrImg.push(this);
        if (arrImg.length == arr.length) {
          callback && callback();
        }
      }
    }
  },
  /*音频加载*/
  loadAudio: function (src, callback) {
    let audio = new Audio(src);
    audio.onloadedmetadata = callback;
    audio.src = src;
  },
  /**
   * 动态加载JS CSS文件
   * @param fileurl
   * @param filetype  js css
   */
  loadJsCss: function (fileurl, filetype) {
    if(filetype == "js"){
      var dom = document.createElement('script');
      dom.setAttribute("type","text/javascript");
      dom.setAttribute("src",fileurl);
    }else if(filetype == "css"){
      var dom = document.createElement('link');
      dom.setAttribute("rel","stylesheet");
      dom.setAttribute("type","text/css");
      dom.setAttribute("href",fileurl);
    }
    if(typeof dom != "undefined"){
      document.getElementsByTagName("head")[0].appendChild(dom);
    }
  }
}
export default dom
