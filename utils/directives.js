export const scroll = {
  bind(el, binding) {
    window.addEventListener('scroll', () => {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
        binding.value()
      }
    }, false)
  }
}
