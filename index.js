import Vue from 'vue'

import mixins from './mixins'

import VueBetterScroll from 'vue2-better-scroll'
import VueAMap from 'vue-amap'
import { lazyAMapApiLoaderInstance } from 'vue-amap'

import UtilsPlugin from './plugins/utils'
import ApiPlugin from './plugins/api'
import TemplatePlugin from './plugins/template'
import NotifierPlugin from './plugins/notifier'
import DataViewPlugin from './plugins/data-view'

// https://zh.nuxtjs.org/guide/plugins#同时注入
export default ({ store, isClient }, inject) => {
  // === 外部插件 ===
  // 滚动加载更多组件
  Vue.use(VueBetterScroll)
  // 地图插件
  Vue.use(VueAMap)
  // 初始化vue-amap
  VueAMap.initAMapApiLoader({
    // 高德的key
    key: 'ef2eab681308c797896f023a49889e2c',
    // 插件集合
    plugin: [
      'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView',
      'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor',
      'AMap.Geolocation', 'AMap.Geocoder'
    ],
    // 高德 sdk 版本，默认为 1.4.4
    v: '1.4.4'
  });

  // === 内部插件 ===
  // Vue 插件式引入：Utils模块
  Vue.use(UtilsPlugin)
  // Vue 插件式引入：Api模块
  Vue.use(ApiPlugin, { store, isClient })
  // Vue 插件式引入，传入 store 用于内部动态 registerModule 到 Vuex store
  Vue.use(NotifierPlugin, { store, isClient })
  // Vue 插件式引入：DataView
  Vue.use(DataViewPlugin)
  // Vue 插件式引入：Template
  Vue.use(TemplatePlugin)
  // 混入所有基础函数
  Vue.mixin(mixins)
}
