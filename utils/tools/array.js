let arr = {
  // 是否包含元素
  contains: function (arr, val) {
    return arr.indexOf(val) != -1 ? true : false;
  },
  // 移除元素
  remove: function (arr, ele) {
    let index = arr.indexOf(ele);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  },
  each: function (arr, fn) {
    fn = fn || Function;
    let a = [];
    let args = Array.prototype.slice.call(arguments, 1);
    for (let i = 0; i < arr.length; i++) {
      let res = fn.apply(arr, [arr[i], i].concat(args));
      if (res != null) a.push(res);
    }
  },
  map: function (arr, fn, thisObj) {
    let scope = thisObj || window;
    let a = [];
    for (let i = 0, j = arr.length; i < j; ++i) {
      let res = fn.call(scope, arr[i], i, this);
      if (res != null) a.push(res);
    }
    return a;
  },
  // 排序
  sort: function (arr, type = 1) {
    return arr.sort((a, b) => {
      switch (type) {
        case 1:
          return a - b;
        case 2:
          return b - a;
        case 3:
          return Math.random() - 0.5;
        default:
          return arr;
      }
    })
  },
  // 去重
  unique: function (arr) {
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
  },
  // 并集
  union: function (a, b) {
    let newArr = a.concat(b);
    return this.unique(newArr);
  },
  // 交集
  intersect: function (a, b) {
    let _this = this;
    a = this.unique(a);
    return this.map(a, function (o) {
      return _this.contains(b, o) ? o : null;
    });
  },
  // 补集
  complement: function (arr1, arr2) {
    return this.minus(this.union(arr1, arr2), this.intersect(arr1, arr2));
  },
  // 差集
  minus: function (arr1, arr2) {
    arr1 = this.unique(arr1);
    return this.map(arr1, function (o) {
      return arr2.includes(o) ? null : o;
    });
  },
  // 将类数组转换为数组的方法
  formArray: function (ary) {
    let arr = [];
    if (Array.isArray(ary)) {
      arr = ary;
    } else {
      arr = Array.prototype.slice.call(ary);
    }
    ;
    return arr;
  },
  // 最大值
  max: function (arr) {
    return Math.max.apply(null, arr);
  },
  // 最小值
  min: function (arr) {
    return Math.min.apply(null, arr);
  },
  // 求和
  sum: function (arr) {
    return arr.reduce((pre, cur) => {
      return pre + cur
    })
  },
  // 平均值
  average: function (arr) {
    return this.sum(arr) / arr.length
  },
  // 判断数组是否有重复的项
  isRepeat: function (arr) {
    let hash = {};
    for (let i in arr) {
      if (hash[arr[i]]) return true;
      hash[arr[i]] = true;
    }
    return false;
  },
  // 随机返回数组中一个元素
  getItemByRandom: function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  // 获取下标
  getIndexByItem: function (arr, item) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == item) {
        return i;
      }
    }
    return -1;
  },
  // 通过下标获取元素
  getItemByIndex: function (arr, index) {
    return arr[index]
  },
  // 通过下标设置元素
  setItemByIndex: function (arr, index, item) {
    arr[index] = item
    return arr
  },
  // 删除指定元素
  removeByItem: function (arr, item) {
    let uniqueArr = this.unique(arr)
    let index = this.getIndexByItem(uniqueArr, item);
    if (index > -1) {
      uniqueArr.splice(index, 1);
    }
    return uniqueArr;
  },
  // 通过下标删除元素
  removeByIndex: function (arr, index) {
    arr.splice(index, 1)
    return arr
  }
}
export default arr
