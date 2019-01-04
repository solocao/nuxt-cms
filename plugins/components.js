import Vue from 'vue'
import AAside from '~/components/admin/a-aside'
import AHeader from '~/components/admin/a-header'
import CTop from '~/components/c-top'
import CBottom from '~/components/c-bottom'

const components = { CTop,CBottom,AAside,AHeader }

Object.keys(components).forEach(key => {Vue.component(key, components[key])})
