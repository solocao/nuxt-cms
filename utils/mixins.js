import E from "~/utils/tools/event"
export const scrollMoreData = {
  mounted(){
    this.throttleLoad = E.throttle(()=>{
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      let containerHeight = $('.masonry').height() || $('.comment-wrapper').height()

      console.log('scrollTop %o',scrollTop)
      console.log('containerHeight %o',containerHeight)
      if(scrollTop + 200 > containerHeight) this.loadMore()
    },200)

    window.addEventListener('scroll',this.throttleLoad)
  },
  destroyed(){
    window.removeEventListener('scroll',this.throttleLoad)
  }
}
