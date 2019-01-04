let ui = {
  hashToTop:function (documentId) {
    location.hash = ''
    location.hash = documentId
  },
  backToTop:function () {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }
}

export default ui
