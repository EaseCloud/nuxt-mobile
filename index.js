import Vue from 'vue'

import mixins from './mixins'

import VueBetterScroll from 'vue2-better-scroll'

import UtilsPlugin from './plugins/utils'
import ApiPlugin from './plugins/api'
import TemplatePlugin from './plugins/template'
import NotifierPlugin from './plugins/notifier'
import DataViewPlugin from './plugins/data-view'

// https://zh.nuxtjs.org/guide/plugins#同时注入
export default ({ store }, inject) => {
  // 引入外部插件
  Vue.use(VueBetterScroll)
  // Vue 插件式引入：Utils模块
  Vue.use(UtilsPlugin)
  // Vue 插件式引入：Api模块
  Vue.use(ApiPlugin)
  // Vue 插件式引入，传入 store 用于内部动态 registerModule 到 Vuex store
  Vue.use(NotifierPlugin, { store })
  // Vue 插件式引入：DataView
  Vue.use(DataViewPlugin)
  // Vue 插件式引入：Template
  Vue.use(TemplatePlugin)
  // 混入所有基础函数
  Vue.mixin(mixins)
}
