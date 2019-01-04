let time = {
  //获取毫秒数
  getMillisecond: function (num, type) {
    switch (type) {
      case 'day':
        return num * 24 * 60 * 60 * 1000
        break
      case 'hour':
        return num * 60 * 60 * 1000
        break
      case 'minute':
        return num * 60 * 1000
        break
      case 'second':
        return num * 1000
        break
    }
  },
  //转换毫秒数
  formatMillisecond: function (num, to) {
    switch (to) {
      case 'day':
        return num / 24 / 60 / 60 / 1000
        break
      case 'hour':
        return num / 60 / 60 / 1000
        break
      case 'minute':
        return num / 60 / 1000
        break
      case 'second':
        return num / 1000
        break
    }
  },
  //随机间歇执行
  nextTime: 0,
  frequency: function (callback,speed) {
    return setInterval(() => {
      let now = new Date().getTime();
      if (now >= this.nextTime) {
        callback()
        this.nextTime = now + Math.random()*speed
      }
    }, 300)
  },
  //倒计时
  countDown(seconds,callback) {
    let timer = null;
    timer = setInterval(function () {
      let day = 0,
        hour = 0,
        minute = 0,
        second = 0;
      if (seconds > 0) {
        day = Math.floor(seconds / (60 * 60 * 24));
        hour = Math.floor(seconds / (60 * 60)) - (day * 24);
        minute = Math.floor(seconds / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(seconds) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
      }
      if (day <= 9) day = '0' + day;
      if (hour <= 9) hour = '0' + hour;
      if (minute <= 9) minute = '0' + minute;
      if (second <= 9) second = '0' + second;

      callback({day,hour,minute,second})
      seconds--

      if (seconds < 0) clearInterval(timer)
    }, 1000);
  }
}

export default time
