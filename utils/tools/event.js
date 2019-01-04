let event = {
  /**
   * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 idle，action 才会执行
   * @param idle   {number}    空闲时间，单位毫秒
   * @param action {function}  请求关联函数，实际应用需要调用的函数
   * @return {function}    返回客户调用函数
   */
  debounce:function (action,idle) {
    let last
    return function(){
      let ctx = this, args = arguments
      clearTimeout(last)
      last = setTimeout(function(){
        action.apply(ctx, args)
      }, idle)
    }
  },
  /**
   * 频率控制 返回函数连续调用时，action 执行频率限定为 次 / delay
   * @param delay  {number}    延迟时间，单位毫秒
   * @param action {function}  请求关联函数，实际应用需要调用的函数
   * @return {function}    返回客户调用函数
   */
  throttle:function (action,delay) {
    let last = 0
    return function(){
      let curr = new Date()
      if (curr - last > delay){
        action.apply(this, arguments)
        last = curr
      }
    }
  },
  /**
   * 检测两个物体是否相撞
   * @param target1
   * @param target2
   * @param callback
   */
  hit:function (target1, target2, callback){
    /*检测碰撞元素上下左右的位置*/
    let target1Top = target1.offsetTop,
      target1Foot = target1.offsetTop + target1.offsetHeight,
      target1Left = target1.offsetLeft,
      target1Right = target1.offsetLeft + target1.offsetWidth;
    /*被碰撞元素的上下左右的位置*/
    let target2Top = target2.offsetTop,
      target2Foot = target2.offsetTop + target2.offsetHeight,
      target2Left = target2.offsetLeft,
      target2Right = target2.offsetLeft + target2.offsetWidth;
    if (target1Foot > target2Top && target1Right > target2Left && target1Top < target2Foot && target1Left < target2Right) callback()
  },

}

export default event
