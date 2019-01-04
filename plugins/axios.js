import Vue from 'vue'

var vm = new Vue({})    //获取vue实例

export default function ({ $axios, redirect }) {
  if(process.browser){
    $axios.onRequest(config => {
      vm.$loading()
    })

    $axios.onResponse(response=>{
      let load = vm.$loading()
      load.close()
    })

    $axios.onError(error => {
      const code = parseInt(error.response && error.response.status)
      if (code === 400) {
        redirect('/400')
      }
    })
  }
}
