import Vue from 'vue'
import * as filters from '~/utils/filters' //自定义过滤器

Object.keys(filters).forEach(key => Vue.filter(key, filters[key])) //注册过滤器

