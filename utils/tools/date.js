let date = {
  /**
   * 格式化时间
   *
   * @param  {time} 时间
   * @param  {cFormat} 格式
   * @return {String} 字符串
   *
   * @example formatTime('2018-1-29', '{y}/{m}/{d} {h}:{i}:{s}') // -> 2018/01/29 00:00:00
   */
  formatTime: function (time, cFormat) {
    if (arguments.length === 0) return null
    if ((time + '').length === 10) {
      time = +time * 1000
    }

    let format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}', date
    if (typeof time === 'object') {
      date = time
    } else {
      date = new Date(time)
    }

    let formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    let time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key]
      if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    })
    return time_str
  },
  /**
   * 返回指定长度的月份集合
   *
   * @param  {time} 时间
   * @param  {len} 长度
   * @param  {direction} 方向：  1: 前几个月;  2: 后几个月;  3:前后几个月  默认 3
   * @return {Array} 数组
   *
   * @example   getMonths('2018-1-29', 6, 1)  // ->  ["2018-1", "2017-12", "2017-11", "2017-10", "2017-9", "2017-8", "2017-7"]
   */
  getMonths: function (time, len, direction=3) {
    let mm = new Date(time).getMonth();
    let	yy = new Date(time).getFullYear();
    // let	direction = isNaN(direction) ? 3 : direction;
    let	index = mm;
    let cutMonth = function (index) {
      if (index <= len && index >= -len) {
        return direction === 1 ? formatPre(index).concat(cutMonth(++index)) :
          direction === 2 ? formatNext(index).concat(cutMonth(++index)) : formatCurr(index).concat(cutMonth(++index))
      }
      return []
    }
    let formatNext = function (i) {
      let y = Math.floor(i / 12),
        m = i % 12
      return [yy + y + '-' + (m + 1)]
    }
    let formatPre = function (i) {
      let y = Math.ceil(i / 12),
        m = i % 12
      m = m === 0 ? 12 : m
      return [yy - y + '-' + (13 - m)]
    }
    let formatCurr = function (i) {
      let y = Math.floor(i / 12),
        yNext = Math.ceil(i / 12),
        m = i % 12,
        mNext = m === 0 ? 12 : m
      return [yy - yNext + '-' + (13 - mNext), yy + y + '-' + (m + 1)]
    }
    // 数组去重
    let unique = function (arr) {
      if (Array.hasOwnProperty('from')) {
        return Array.from(new Set(arr));
      } else {
        let n = {}, r = [];
        for (let i = 0; i < arr.length; i++) {
          if (!n[arr[i]]) {
            n[arr[i]] = true;
            r.push(arr[i]);
          }
        }
        return r;
      }
    }
    return direction !== 3 ? cutMonth(index) : unique(cutMonth(index).sort(function (t1, t2) {
      return new Date(t1).getTime() - new Date(t2).getTime()
    }))
  },
  /**
   * 返回指定长度的天数集合
   *
   * @param  {time} 时间
   * @param  {len} 长度
   * @param  {direction} 方向： 1: 前几天;  2: 后几天;  3:前后几天  默认 3
   * @return {Array} 数组
   *
   * @example date.getDays('2018-1-29', 6) // -> ["2018-1-26", "2018-1-27", "2018-1-28", "2018-1-29", "2018-1-30", "2018-1-31", "2018-2-1"]
   */
  getDays: function (time, len, direction) {
    let tt = new Date(time)
    let getDay = function (day) {
      let t = new Date(time)
      t.setDate(t.getDate() + day)
      let m = t.getMonth() + 1
      return t.getFullYear() + '-' + m + '-' + t.getDate()
    }
    let arr = []
    if (direction === 1) {
      for (let i = 1; i <= len; i++) {
        arr.unshift(getDay(-i))
      }
    } else if (direction === 2) {
      for (let i = 1; i <= len; i++) {
        arr.push(getDay(i))
      }
    } else {
      for (let i = 1; i <= len; i++) {
        arr.unshift(getDay(-i))
      }
      arr.push(tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate())
      for (let i = 1; i <= len; i++) {
        arr.push(getDay(i))
      }
    }
    return direction === 1 ? arr.concat([tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate()]) :
      direction === 2 ? [tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate()].concat(arr) : arr
  },
  /**
   * 返回时分秒
   * @param  {s} 秒数
   * @return {String} 字符串
   *
   * @example formatHMS(3610) // -> 1h0m10s
   */
  getHMS: function (s) {
    let str = ''
    if (s > 3600) {
      str = Math.floor(s / 3600) + '小时' + Math.floor(s % 3600 / 60) + '分' + s % 60 + '秒'
    } else if (s > 60) {
      str = Math.floor(s / 60) + '分' + s % 60 + '秒'
    } else {
      str = s % 60 + '秒'
    }
    return str
  },
  /*获取某月有多少天*/
  getMonthOfDay: function (time) {
    let date = new Date(time)
    let year = date.getFullYear()
    let mouth = date.getMonth() + 1
    let days

    //当月份为二月时，根据闰年还是非闰年判断天数
    if (mouth == 2) {
      days = (year % 4 == 0 && year % 100 == 0 && year % 400 == 0) || (year % 4 == 0 && year % 100 != 0) ? 28 : 29
    } else if (mouth == 1 || mouth == 3 || mouth == 5 || mouth == 7 || mouth == 8 || mouth == 10 || mouth == 12) {
      //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
      days = 31
    } else {
      //其他月份，天数为：30.
      days = 30
    }
    return days
  },
  /*获取某年有多少天*/
  getYearOfDay: function (time) {
    let firstDayYear = this.getFirstDayOfYear(time);
    let lastDayYear = this.getLastDayOfYear(time);
    let numSecond = (new Date(lastDayYear).getTime() - new Date(firstDayYear).getTime()) / 1000;
    return Math.ceil(numSecond / (24 * 3600));
  },
  /*获取某年的第一天*/
  getFirstDayOfYear: function (time) {
    let year = new Date(time).getFullYear();
    return year + "-01-01 00:00:00";
  },
  /*获取某年最后一天*/
  getLastDayOfYear: function (time) {
    let year = new Date(time).getFullYear();
    let dateString = year + "-12-01 00:00:00";
    let endDay = this.getMonthOfDay(dateString);
    return year + "-12-" + endDay + " 23:59:59";
  },
  /*获取某个日期是当年中的第几天*/
  getDayOfYear: function (time) {
    let firstDayYear = this.getFirstDayOfYear(time);
    let numSecond = (new Date(time).getTime() - new Date(firstDayYear).getTime()) / 1000;
    return Math.ceil(numSecond / (24 * 3600));
  },
  /*获取某个日期在这一年的第几周*/
  getDayOfYearWeek: function (time) {
    let numdays = this.getDayOfYear(time);
    return Math.ceil(numdays / 7);
  },
  // 获取时间戳
  timeStamp: function () {
    return new Date().getTime();
  },
  // 转换long值为日期字符串
  getFormatDateByTimeStamp: function (timeStamp, pattern) {
    return this.getFormatDate(new Date(timeStamp), pattern);
  },
  // 转换日期对象为日期字符串
  getFormatDate: function (date, pattern) {
    // 不传入date默认为当前时间
    if (date == undefined) {
      date = new Date();
    }
    // 不传入格式默认为全格式
    if (pattern == undefined) {
      pattern = "YYYY-MM-DD hh:mm:ss";
    }

    let o = {
      "M+": date.getMonth() + 1,
      "D+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
      "q+": Math.floor((date.getMonth() + 3) / 3),
      "S": date.getMilliseconds()
    };
    if (/(Y+)/.test(pattern)) {
      pattern = pattern.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (let k in o) {
      if (new RegExp("(" + k + ")").test(pattern)) {
        pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    return pattern;
  },
  /**
   * 计算时间
   * @param date
   * @param pattern year,month,day,hour,minute,seconds,week,daytime,when
   * @returns {*}
   */
  countTime: function (date, pattern) {
    let d = date
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    let hour = d.getHours();
    let minute = d.getMinutes();
    let seconds = d.getSeconds();
    if (year < 10) {
      year = "0" + year
    }
    ;
    if (day < 10) {
      day = "0" + day
    }
    ;
    if (hour < 10) {
      hour = "0" + hour
    }
    ;
    if (minute < 10) {
      minute = "0" + minute
    }
    ;
    if (seconds < 10) {
      seconds = "0" + seconds
    }
    ;

    if (pattern == "year") {
      return year;
    }
    ;
    if (pattern == "month") {
      return month;
    }
    ;
    if (pattern == "day") {
      return day;
    }
    ;
    if (pattern == "hour") {
      return hour;
    }
    ;
    if (pattern == "minute") {
      return minute;
    }
    ;
    if (pattern == "seconds") {
      return seconds;
    }
    ;

    if (pattern == "week") {
      let w_d;
      switch (d.getDay()) {
        case 0:
          w_d = "星期天";
          break;
        case 1:
          w_d = "星期一";
          break;
        case 2:
          w_d = "星期二";
          break;
        case 3:
          w_d = "星期三";
          break;
        case 4:
          w_d = "星期四";
          break;
        case 5:
          w_d = "星期五";
          break;
        case 6:
          w_d = "星期六";
          break;
      }
      return w_d;
    }

    if (pattern == "daytime") {
      if (hour < 11 && hour > 6) {
        return "早晨";
      }
      if (hour <= 14 && hour >= 11) {
        return "中午";
      }
      if (hour > 14 && hour < 19) {
        return "下午";
      }
      if (hour >= 19 && hour <= 23) {
        return "晚上";
      }
      if (hour < 6 && hour >= 0) {
        return "凌晨";
      }
    }

    if (pattern == "when") {
      let now = new Date();
      let now_year = now.getFullYear();
      let now_month = now.getMonth() + 1;
      let now_day = now.getDate();
      let now_hour = now.getHours();
      let now_minute = now.getMinutes();
      let now_seconds = now.getSeconds();

      // 比较年份
      if (now_year > year) {
        return (now_year - year) + '年前'
      } else if (now_year == year) {
        // 比较月份
        if (now_month > month) {
          return (now_month - month) + '个月前'
        } else if (now_month == month) {
          // 比较号数
          if (now_day > day) {
            return (now_day - day) + '天前'
          } else if (now_day == day) {
            // 比较小时
            if (now_hour > hour) {
              return (now_hour - hour) + '小时前'
            } else if (now_hour == hour) {
              // 比较分钟
              if (now_minute > minute) {
                return (now_minute - minute) + '分钟前'
              } else if (now_minute == minute) {
                // 比较秒
                if (now_seconds > seconds) {
                  return (now_seconds - seconds) + '秒前'
                } else if (now_seconds == seconds) {
                  return '刚刚'
                } else {
                  return (seconds - now_seconds) + '秒后'
                }
              } else {
                return (minute - now_minute) + '分钟后'
              }
            } else {
              return (hour - now_hour) + '小时后'
            }
          } else {
            return (day - now_day) + '天后'
          }
        } else {
          return (month - now_month) + '个月后'
        }
      } else {
        return (year - now_year) + '年后'
      }
    }
  },

  /*转换日期*/
  _transferDate: function (date) {
    if (typeof date == "string") {
      return new Date(date.replace(/-/ig, "/"));
    } else {
      return date;
    }
  },
  //间隔年份
  _numYear: function (date1, date2) {
    let times = this._numDay(date1, date2);
    return Math.floor(times / 365);
  },
  //间隔月份
  _numMonth: function (date1, date2) {
    let times = this._numDay(date1, date2);
    return Math.floor(times / 30);
  },
  //间隔天数
  _numDay: function (date1, date2) {
    let d = {
      hour: 24,
      second: 60,
      mills: 3600,
      format: "yyyy-MM-dd",
      dateFormat: "yyyy-MM-dd HH:mm:ss"
    };
    let times = this._numSecond(date1, date2);
    let hour = d.hour;
    let mills = d.mills;
    return Math.ceil(times / (mills * hour));
  },
  //间隔时
  _numHour: function (date1, date2) {
    return Math.floor(this._numMillSecond(date1, date2) / (1000 * 60 * 60));
  },
  //间隔分
  _numMinute: function (date1, date2) {
    return Math.floor(this._numMillSecond(date1, date2) / (1000 * 60));
  },
  //间隔秒数
  _numSecond: function (date1, date2) {
    return Math.floor(this._numMillSecond(date1, date2) / 1000);
  },
  //间隔毫秒
  _numMillSecond: function (date1, date2) {
    let stimes = this._getTime(this._transferDate(date1));
    let etimes = this._getTime(this._transferDate(date2));
    return etimes - stimes;
  },

  /*某个日期加上多少毫秒*/
  _plusMillisSeconds: function (date, millisSeconds) {
    let dateTime = this._getTime(date);
    let mintimes = millisSeconds;
    let rdate = dateTime * 1 + mintimes * 1;
    return this._format(new Date(rdate));
  },
  /*某个日期加上多少秒*/
  _plusSeconds: function (date, seconds) {
    let dateTime = this._getTime(date);
    let mintimes = seconds * 1000;
    let rdate = dateTime * 1 + mintimes * 1;
    return this._format(new Date(rdate));
  },
  /*某个日期加上多少分钟*/
  _plusMinutes: function (date, minutes) {
    let dateTime = this._getTime(date);
    let mintimes = minutes * 60 * 1000;
    let rdate = dateTime * 1 + mintimes * 1;
    return this._format(new Date(rdate));
  },
  /*某个日期加上小时数*/
  _plusHours: function (date, hours) {
    let dateTime = this._getTime(date);
    let mintimes = hours * 60 * 60 * 1000;
    let rdate = dateTime + mintimes;
    return this._format(new Date(rdate));
  },
  /*某个日期加上天数*/
  _plusDays: function (date, days) {
    let dateTime = this._getTime(date);
    let mintimes = days * 60 * 60 * 1000 * 24;
    let rdate = dateTime * 1 + mintimes * 1;
    return this._format(new Date(rdate));
  },
  /*某个日期加上多少个月,这里是按照一个月30天来计算天数的*/
  _plusMonths: function (date, months) {
    let dateTime = this._getTime(date);
    let mintimes = months * 30 * 60 * 60 * 1000 * 24;
    let rdate = dateTime + mintimes * 1;
    return this._format(new Date(rdate));
  },
  /*某个日期加上多少个年,这里是按照一个月365天来计算天数的，如果loop为true则按闰年计算*/
  _plusYears: function (date, years, isLoop) {
    let dateTime = this._getTime(date);
    let day = 365;
    if (isLoop) day = 366;
    let mintimes = years * day * 60 * 60 * 1000 * 24;
    let rdate = dateTime + mintimes;
    return this._format(new Date(rdate));
  },
  /*某个日期加上某个日期，这样的操作视乎没什么意义*/
  _plusDate: function (date1, date2) {
    let dateTime = this._getTime(date1);
    let dateTime2 = this._getTime(date2);
    ;
    let rdate = dateTime + dateTime2;
    return this._format(new Date(rdate));
  },
  /*某个日期减去多少毫秒秒*/
  _minusMillisSeconds: function (date, millisSeconds) {
    let dateTime = this._getTime(date);
    let mintimes = millisSeconds * 1;
    let rdate = dateTime - mintimes;
    return this._format(new Date(rdate));
  },
  /*某个日期减去多少秒*/
  _minusSeconds: function (date, seconds) {
    let dateTime = this._getTime(date);
    let mintimes = seconds * 1000;
    let rdate = dateTime - mintimes;
    return this._format(new Date(rdate));
  },
  /*某个日期减去多少分钟*/
  _minusMinutes: function (date, minutes) {
    let dateTime = this._getTime(date);
    let mintimes = minutes * 60 * 1000;
    let rdate = dateTime - mintimes;
    return this._format(new Date(rdate));
  },
  /*某个日期减去小时数*/
  _minusHours: function (date, hours) {
    let dateTime = this._getTime(date);
    let mintimes = hours * 60 * 60 * 1000;
    let rdate = dateTime - mintimes;
    return this._format(new Date(rdate));
  },
  /*某个日期减去天数*/
  _minusDays: function (date, days) {
    let dateTime = this._getTime(date);
    let mintimes = days * 60 * 60 * 1000 * 24;
    let rdate = dateTime - mintimes;
    return this._format(new Date(rdate));
  },
  /*某个日期减去多少个月,这里是按照一个月30天来计算天数的*/
  _minusMonths: function (date, months) {
    let dateTime = this._getTime(date);
    let mintimes = months * 30 * 60 * 60 * 1000 * 24;
    let rdate = dateTime - mintimes;
    return this._format(new Date(rdate));
  },
  /*某个日期减去多少个年,这里是按照一个月365天来计算天数的*/
  _minusYears: function (date, years, isLoop) {
    let dateTime = this._getTime(date);
    let day = 365;
    if (isLoop) day = 366;
    let mintimes = years * day * 60 * 60 * 1000 * 24;
    let rdate = dateTime - mintimes;
    return this._format(new Date(rdate));
  },
  /*某个日期减去某个日期，这样的操作视乎没什么意义*/
  _minusDate: function (date1, date2) {
    let dateTime = this._getTime(date1);
    let dateTime2 = this._getTime(date2);
    ;
    let rdate = dateTime - dateTime2;
    return this._format(new Date(rdate));
  },

  /*获取一个月有多少天*/
  _getMonthOfDay: function (date1) {
    let currentMonth = this._getFirstDayOfMonth(date1);
    let nextMonth = this._getNextDayOfMonth(date1);
    return this._numDay(currentMonth, nextMonth);
  },
  /*获取一年又多少天*/
  _getYearOfDay: function (date) {
    let firstDayYear = this._getFirstDayOfYear(date);
    let lastDayYear = this._getLastDayOfYear(date);
    return Math.ceil(this._numDay(firstDayYear, lastDayYear));
  },
  /*某个日期是当年中的第几天*/
  _getDayOfYear: function (date1) {
    return Math.ceil(this._numDay(this._getFirstDayOfYear(date1), date1));
  },
  /*某个日期是在当月中的第几天*/
  _getDayOfMonth: function (date1) {
    return Math.ceil(this._numDay(this._getFirstDayOfMonth(date1), date1));
  },
  /*获取某个日期在这一年的第几周*/
  _getDayOfYearWeek: function (date) {
    let numdays = this._getDayOfYear(date);
    return Math.ceil(numdays / 7);
  },
  /*某个日期是在当月中的星期几*/
  _getDayOfWeek: function (date1) {
    return this._getWeek(date1);
  },
  /*获取在当前日期中的时间*/
  _getHourOfDay: function (date) {
    return this._getHour(date);
  },

  /*判断两个时间是否一样*/
  _eq: function (date1, date2) {
    let stime = this._getTime(this._transferDate(date1));
    let etime = this._getTime(this._transferDate(date2));
    return stime == etime ? true : false;
  },
  /*判断两个时间是否晚于某个日期*/
  _after: function (date1, date2) {
    let stime = this._getTime(this._transferDate(date1));
    let etime = this._getTime(this._transferDate(date2));
    return stime < etime ? true : false;
  },
  /*某个日期是否早于某个日期*/
  _before: function (date1, date2) {
    let stime = this._getTime(this._transferDate(date1));
    let etime = this._getTime(this._transferDate(date2));
    return stime > etime ? true : false;
  },
  /*获取某年的第一天*/
  _getFirstDayOfYear: function (date) {
    let year = this._getYear(date);
    let dateString = year + "-01-01 00:00:00";
    return dateString;
  },
  /*获取某年的最后一天*/
  _getLastDayOfYear: function (date) {
    let year = this._getYear(date);
    let dateString = year + "-12-01 00:00:00";
    let endDay = this._getMonthOfDay(dateString);
    return year + "-12-" + endDay + " 23:59:59";
  },
  /*获取某月的第一天*/
  _getFirstDayOfMonth: function (date) {
    let year = this._getYear(date);
    let month = this._getMonth(date);
    let dateString = year + "-" + month + "-01 00:00:00";
    return dateString;
  },
  /*获取某月最后一天*/
  _getLastDayOfMonth: function (date) {
    let endDay = this._getMonthOfDay(date);
    let year = this._getYear(date);
    let month = this._getMonth(date);
    return year + "-" + month + "-" + endDay + " 23:59:59";
  },
  /*一天的开始时间*/
  _getFirstOfDay: function (date) {
    let year = this._getYear(date);
    let month = this._getMonth(date);
    let dates = this._getDay(date);
    return year + "-" + month + "-" + dates + " 00:00:00";
  },
  /*一天的结束时间*/
  _getLastOfDay: function (date) {
    let year = this._getYear(date);
    let month = this._getMonth(date);
    let dates = this._getDay(date);
    return year + "-" + month + "-" + dates + " 23:59:59";
  },
  /*获取下个月的第一天*/
  _getNextDayOfMonth: function (date) {
    let year = this._getYear(date);
    let month = this._getMonth(date);
    month = month * 1 + 1;
    if (month > 12) {
      year = year + 1;
      month = month - 12;
    }
    month = month > 9 ? month : "0" + month;
    let dateString = year + "-" + month + "-01 00:00:00";
    return dateString;
  },
  /*获取这周的第一天*/
  _getFirstOfWeek: function (date1) {
    let week = this._getWeek(date1);
    let date = this._minusDays(date1, week);
    let year = this._getYear(date);
    let month = this._getMonth(date);
    let dates = this._getDay(date);
    return year + "-" + month + "-" + dates + " 00:00:00";
  },
  /*获取这周的最后一天*/
  _getLastOfWeek: function (date1) {
    let week = 6 - this._getWeek(date1);
    let date = this._minusDays(date1, week);
    let year = this._getYear(date);
    let month = this._getMonth(date);
    let dates = this._getDay(date);
    return year + "-" + month + "-" + dates + " 23:59:59";
  },

  /*时间格式化*/
  _format: function (date) {
    return this._getYear(date) + "-" + this._getMonth(date) + "-" + this._getDay(date) + " " + this._getHour(date) + ":" + this._getMinute(date) + ":" + this._getSecond(date);
  },
  /*年*/
  _getYear: function (date) {
    return this._transferDate(date).getFullYear();
  },
  /*月*/
  _getMonth: function (date) {
    let month = this._transferDate(date).getMonth() + 1;
    return month > 9 ? month : "0" + month;
  },
  /*日*/
  _getDay: function (date) {
    let day = this._transferDate(date).getDate();
    return day > 9 ? day : "0" + day;
  },
  /*获取今天星期几,如果为0代表星期日*/
  _getWeek: function (date) {
    return this._transferDate(date).getDay();
  },
  /*时*/
  _getHour: function (date) {
    let hour = this._transferDate(date).getHours();
    return hour > 9 ? hour : "0" + hour;
  },
  /*12小时制时*/
  _getHour12: function (date) {
    let hour = this._transferDate(date).getHours();
    return hour % 12 == 0 ? 12 : hour % 12;
  },
  /*分*/
  _getMinute: function (date) {
    let minutes = this._transferDate(date).getMinutes();
    return minutes > 9 ? minutes : "0" + minutes;
  },
  /*秒*/
  _getSecond: function (date) {
    let seconds = this._transferDate(date).getSeconds();
    return seconds > 9 ? seconds : "0" + seconds;
  },
  /*毫秒*/
  _getMillisecond: function (date) {
    return this._transferDate(date).getMilliseconds();
  },

  /*获取今天在当年是第几季度*/
  _getPeriod: function (date) {
    let month = this._getMonth(date) * 1;
    return Math.floor((month + 3) / 3);
  },
  /*获取星期的中文字*/
  _nowWeekChinies: function (date) {
    let nowWeek = this._getWeek(date);
    let day = "";
    switch (nowWeek) {
      case 0:
        day = "日";
        break;
        break;
      case 1:
        day = "一";
        break;
        break;
      case 2:
        day = "二";
        break;
        break;
      case 3:
        day = "三";
        break;
        break;
      case 4:
        day = "四";
        break;
        break;
      case 5:
        day = "五";
        break;
        break;
      case 6:
        day = "六";
        break;
    }
    return day;
  },
  /*返回 1970 年 1 月 1 日至今的毫秒数。*/
  _getTime: function (date) {
    return this._transferDate(date).getTime();
  }
}
export default date
