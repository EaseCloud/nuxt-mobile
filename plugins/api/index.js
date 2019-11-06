import axios from 'axios'
import api from './api'
import config from '~/config'

export default {
  install (Vue, options) {
    Vue.mixin({
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

