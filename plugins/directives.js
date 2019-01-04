import Vue from 'vue'
import * as directives from '~/utils/directives'
Object.keys(directives).forEach(key => {Vue.directive(key, directives[key])})
