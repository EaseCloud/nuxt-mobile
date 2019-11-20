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
        openDialog (dialog) {
          const vm = this
          vm.$store.dispatch('notifier/openDialog', dialog)
          return dialog
        },
        async notify (message, delay = 3000, closable = false) {
          const vm = this
          return vm.$store.dispatch('notifier/addNotify', message, delay, closable)
        },
        async pickFile (accept = false, multiple = false) {
          // TODO: 这里还有一个 BUG，如果你去 await 一个 pickFile，但是它取消的话
          // 这个 promise 会一直 hold 住，直到路由跳转导致页面被销毁才能 await 到一个 reject
          const vm = this
          return new Promise((resolve, reject) => {
            const filePicker = {
              accept,
              multiple,
              resolve,
              reject,
              callback (files) {
                vm.$store.dispatch('notifier/dismissFilePicker', filePicker)
                if (files.length) resolve(multiple ? files : files[0])
                else reject()
              }
            }
            vm.$store.dispatch('notifier/pickFile', filePicker)
          })
        },
        async pickImage () {
          const vm = this
          return vm.pickFile('image/*')
        },
        async confirm (message, title = '操作确认') {
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
                      padding: `0 ${vm.px(30)}`
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
        async pickChoice (title, choices, default_value = '') {
          const vm = this
          return new Promise(async (resolve, reject) => {
            const dialog = vm.openDialog(new DialogOptions({
              title,
              mode: 'modal',
              okText: '',
              cancelText: '取消',
              onCancel () {
                vm.$store.dispatch('notifier/closeDialog', dialog)
                reject('')
              },
              render (h) {
                return h('ul', {
                  style: {
                    position: 'relative',
                    padding: `${vm.px(30)} 0`,
                    lineHeight: vm.px(64),
                    maxHeight: '100vw',
                    overflow: 'auto'
                  }
                }, vm.wrapChoices(choices).map((choice, i) => {
                  return h('li', {
                    style: {
                      lineHeight: vm.px(64),
                      border: 0,
                      boxSizing: 'border-box',
                      color: choice.value === default_value ? '#2196F3' : 'inherit',
                      padding: `0 ${vm.px(30)}`
                    },
                    on: {
                      click () {
                        vm.$store.dispatch('notifier/closeDialog', dialog)
                        resolve(choice.value)
                      }
                    }
                  }, choice.text)
                }))
              }
            }))
          })
        },
      }
    })
  }
}


