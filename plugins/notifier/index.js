import NotifierRegistry from './components/NotifierRegistry'
import { DialogOptions } from './models'
import store from './store'

export default {
  install (Vue, options) {
    // console.log('options', options)
    if (options && options.store) {
      options.store.registerModule('notifier', store, { preserveState: !!options.isClient })
    }
    Vue.mixin({
      components: {
        NotifierRegistry
      },
      methods: {
        async prompt (message, default_value, placeholder = '') {
          const vm = this
          // 苟且实现
          // const value = window.prompt(message, default_value)
          // return value === null ? Promise.reject() : value
          // 正规实现
          return new Promise(async (resolve, reject) => {
            let value = default_value
            const dialog = vm.openDialog(new DialogOptions({
              title: message,
              mode: 'modal',
              okText: '确定',
              cancelText: '取消',
              onOk () {
                vm.$store.dispatch('notifier/closeDialog', dialog)
                resolve(value)
              },
              onCancel () {
                vm.$store.dispatch('notifier/closeDialog', dialog)
                reject('')
              },
              render (h) {
                return h('div', {
                  style: {
                    position: 'relative',
                    padding: vm.px(30),
                    lineHeight: vm.px(64)
                  }
                }, [
                  h('input', {
                    attrs: { type: 'text', value: default_value, placeholder },
                    style: {
                      lineHeight: vm.px(64),
                      border: 0,
                      // borderBottom: '1px solid #CCC',
                      background: 'rgba(0, 0, 0, 0.02)',
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: `0 ${vm.px(20)}`
                    },
                    on: {
                      input (e) {
                        value = e.target.value
                      }
                    }
                  })
                ])
              }
            }))
          })
        },
        async notify (message, delay = 3000, closable = false) {
          const vm = this
          return vm.$store.dispatch('notifier/addNotify', message, delay, closable)
        },
        async confirm (message, title='操作确认') {
          const vm = this
          // 苟且实现
          // return window.confirm(message) ? Promise.resolve() : Promise.reject()
          // 正式实现
          return new Promise(async (resolve, reject) => {
            const dialog = vm.openDialog(new DialogOptions({
              title,
              mode: 'modal',
              okText: '确定',
              cancelText: '取消',
              onOk () {
                vm.$store.dispatch('notifier/closeDialog', dialog)
                resolve()
              },
              onCancel () {
                vm.$store.dispatch('notifier/closeDialog', dialog)
                reject('')
              },
              render (h) {
                return h('div', {
                  style: {
                    position: 'relative',
                    padding: vm.px(30),
                    lineHeight: vm.px(45)
                  }
                }, message)
              }
            }))
          })
        },
        openDialog (dialog) {
          const vm = this
          vm.$store.dispatch('notifier/openDialog', dialog)
          return dialog
        },
      }
    })
  }
}


