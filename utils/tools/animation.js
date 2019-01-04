let animation = {
  /**
   * @param delay setInterval 第二个参数,帧之间的间隔
   * @param duration 整个动画的用时
   * @param delta 这是一个函数，代表时间进度（progress）和动画进度的关系。如：delta = function(p){ return p; }：代表动画是线性的
   * @param move 真正执行动画（操作elem.style）的函数。它接受当前动画进度，然后应用到element上。
   */
  core: function (opts) {
    let start = new Date; //动画开始时间
    let id = setInterval(function () {
      let timePassed = new Date - start; //动画已经消耗的时间
      let progress = timePassed / opts.duration; //动画的时间进度（currentTime/duration）0~1
      if (progress > 1) progress = 1;
      let delta = opts.delta(progress);
      opts.animate(delta);
      if (progress == 1) clearInterval(id);
    }, opts.rate);
  },
  moveLeft: function (element,opts) {
    let step = opts.step || 100
    this.core({
      rate: opts.rate || 10,
      duration: opts.duration || 1000,
      animate: function(delta) {
        element.style.left = step*delta + "px"
      },
      delta: function (p) {
        return p;
      }
    })
  }
}

export default animation
