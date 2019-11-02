import Vue from 'vue'

import ApiPlugin from './api'
import NotifierPlugin from './notifier'

import Page from '../components/Page'

// https://zh.nuxtjs.org/guide/plugins#同时注入
export default ({ store }, inject) => {
  // Vue 插件式引入：Api模块
  Vue.use(ApiPlugin)
  // Vue 插件式引入，传入 store 用于内部动态 registerModule 到 Vuex store
  Vue.use(NotifierPlugin, { store })
  // 注册全功能支持 SSR 的 Page 组件
  Vue.mixin({ components: { Page } })
}
