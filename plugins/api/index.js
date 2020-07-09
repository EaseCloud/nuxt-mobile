import axios from 'axios'
import api from './api'
import config from '~/config'
import store from './store'
import components from './components'

export default {
  install (Vue, options) {
    // console.log('options', options)
    if (options && options.store) {
      options.store.registerModule('api', store, { preserveState: !!options.isClient })
    }
    Vue.mixin({
      components,
      computed: {
        // 动态生成实例，使得动态配置 config.axios_options 修改可以动态生效
        // axios: () => axios.create(config.axios_options)
        axios () {
          const vm = this
          // Axios instance
          const index = axios.create(config.axios_options)
          index.interceptors.response.use(response => {
            notifyResponseMessage(vm, response)
            return response
          }, error => {
            notifyResponseMessage(vm, error.response)
            return Promise.reject(error)
          })
          return index
        }
      },
      methods: {
        api
      }
    })
  }
}

