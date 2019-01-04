let file = {
  /*格式文件大小单位*/
  formatSize: function (num) {
    let fsize = parseFloat(num, 2);
    let fileSizeString;
    if (fsize < 1024) {
      fileSizeString = fsize.toFixed(2) + "B";
    } else if (fsize < 1048576) {
      fileSizeString = (fsize / 1024).toFixed(2) + "KB";
    } else if (fsize < 1073741824) {
      fileSizeString = (fsize / 1024 / 1024).toFixed(2) + "MB";
    } else if (fsize < 1024 * 1024 * 1024) {
      fileSizeString = (fsize / 1024 / 1024 / 1024).toFixed(2) + "GB";
    } else {
      fileSizeString = "0B";
    }
    return fileSizeString;
  },
  /*获取文件的后缀名*/
  getExt: function (fileName) {
    if (fileName.lastIndexOf(".") == -1)
      return fileName;
    let pos = fileName.lastIndexOf(".") + 1;
    return fileName.substring(pos, fileName.length).toLowerCase();
  },
  /*获取文件名称*/
  getName: function (fileName) {
    let pos = fileName.lastIndexOf(".");
    if (pos == -1) {
      return fileName;
    } else {
      return fileName.substring(0, pos);
    }
  },
  /*根据路径获取文件全名*/
  getFileName: function (path) {
    let fileFormat = path.split("/")
    return fileFormat[fileFormat.length - 1]
  },
  isImageFileName: function (fileName) {
    return /(gif|jpg|jpeg|png|GIF|JPG|PNG)$/ig.test(fileName);
  },
  isVideoFileName: function (fileName) {
    return /(mp4|mp3|flv|wav)$/ig.test(fileName);
  },
  isDocumentFileName: function (fileName) {
    return /(doc|docx|xls|xlsx|pdf|txt|ppt|pptx|rar|zip|html|jsp|sql|htm|shtml|xml)$/ig.test(fileName);
  },
  isOfficeFileName: function (fileName) {
    return /(doc|docx|xls|xlsx|pdf|txt|ppt|pptx)$/ig.test(fileName);
  }
}
export default file
