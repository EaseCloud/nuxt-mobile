// import NotifierRegistry from './components/NotifierRegistry'
// import MapPicker from './components/MapPicker'
// import DatePicker from './components/DatePicker'
// import CascaderPicker from './components/CascaderPicker'
// import DistrictPicker from './components/DistrictPicker'
import { DialogOptions } from './models'
import components from './components'
import store from './store'

export default {
  install (Vue, options) {
    // console.log('options', options)
    if (options && options.store) {
      options.store.registerModule('notifier', store, { preserveState: !!options.isClient })
    }
    Vue.mixin({
      components,
      // components: {
      //   NotifierRegistry,
      //   MapPicker,
      //   DatePicker,
      //   CascaderPicker,
      //   DistrictPicker
      // },
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
        async pickImage (source = 'all', multiple = false) {
          const vm = this
          if (vm.isWechat()) {
            const wx = await vm.getWxJssdk()
            return new Promise((resolve, reject) => {
              wx.chooseImage({
                count: 1,
                sourceType: source === 'all' ? ['album', 'camera'] : [source],
                async success (res) {
                  const localIds = res.localIds;
                  const data = []
                  await Promise.all(res.localIds.map((localId, i) => new Promise((rs, rj) => {
                    wx.getLocalImgData({
                      localId,
                      success (res) {
                        data[i] = res.localData
                        rs()
                      },
                      async fail (res) {
                        vm.notify(res)
                        rj()
                      },
                      async cancel (res) {
                        vm.notify('用户取消操作')
                        // vm.notify(res)
                        rj()
                      }
                    })
                  })))
                  resolve(multiple ? data : data[0])
                },
                async fail (res) {
                  vm.notify(res)
                  reject()
                },
                async cancel (res) {
                  vm.notify('用户取消操作')
                  // vm.notify(res)
                  reject()
                }
              })
            })
          } else {
            return vm.pickFile('image/*', multiple)
          }
        },
        async previewImage (image) {
          const vm = this
          return vm.previewImages([image], image)
        },
        async previewImages (images, current = '') {
          const vm = this
          const wx = await vm.getWxJssdk()
          wx.previewImage({ current, urls: images })
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
        async prompt (message, default_value, placeholder = '', rows = 1, htmlType = 'input') {
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
                  h(htmlType === 'textarea' ? 'textarea' : 'input', {
                    attrs: {
                      rows: htmlType === 'textarea' && rows ? rows : false,
                      placeholder,
                      type: htmlType === 'textarea' ? false : htmlType
                    },
                    style: {
                      fontSize: vm.px(32),
                      lineHeight: vm.px(44),
                      border: 0,
                      // borderBottom: '1px solid #CCC',
                      background: 'rgba(0, 0, 0, 0.02)',
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: `${vm.px(22)} ${vm.px(30)}`,
                      resize: 'none'
                    },
                    on: {
                      input (e) {
                        value = e.target.value
                      }
                    }
                  }, default_value)
                ])
              }
            }))
          })
        },
        async pickLocation (title, lng = 0, lat = 0, label = '') {
          // 拾取地理位置
          const vm = this
          const currentLocation = await vm.getCurrentLocation()
          const [oldLng, oldLat, oldLabel] = lat && lng ? [lng, lat, label]
            : [currentLocation.lng, currentLocation.lat, currentLocation.label]
          return new Promise(async (resolve, reject) => {
            const dialog = vm.openDialog(new DialogOptions({
              mode: 'full',
              render (h) {
                return h('map-picker', {
                  props: { lng: oldLng, lat: oldLat, label: oldLabel },
                  on: {
                    input (item) {
                      vm.$store.dispatch('notifier/closeDialog', dialog)
                      if (!item) return reject() // 取消
                      resolve(item)
                    }
                  }
                })
              }
            }))
          })
        },
        async pickChoice (title, choices, default_value = '',
                          { multiple, align } = { multiple: false, align: 'center' }) {
          const vm = this
          let value = default_value
          return new Promise(async (resolve, reject) => {
            const dialog = vm.openDialog(new DialogOptions({
              title,
              mode: 'modal',
              okText: multiple ? '确定' : '',
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
                return h('choice-picker', {
                  props: {
                    choiceList: vm.wrapChoices(choices),
                    multiple,
                    value,
                    align: align || 'center'
                  },
                  on: {
                    input (val) {
                      if (multiple) {
                        value = val
                      } else {
                        vm.$store.dispatch('notifier/closeDialog', dialog)
                        resolve(val)
                      }
                    }
                  }
                })
              }
            }))
          })
        },
        async pickCascader (title, opts, defaultValue = null) {
          const vm = this
          return new Promise(async (resolve, reject) => {
            let value = defaultValue
            const dialog = vm.openDialog(new DialogOptions({
              title,
              onOk () {
                vm.$store.dispatch('notifier/closeDialog', dialog)
                resolve(value)
              },
              onCancel () {
                vm.$store.dispatch('notifier/closeDialog', dialog)
                reject('')
              },
              render (h) {
                return h('cascader-picker', {
                  props: { opts, value },
                  on: {
                    input (val) {
                      value = val
                    }
                  }
                })
              }
            }))
          })
        },
        async pickDate (title = '选择日期', defaultValue = new Date()) {
          const vm = this
          return new Promise(async (resolve, reject) => {
            let value = defaultValue
            const dialog = vm.openDialog(new DialogOptions({
              title,
              onOk () {
                vm.$store.dispatch('notifier/closeDialog', dialog)
                resolve(value)
              },
              onCancel () {
                vm.$store.dispatch('notifier/closeDialog', dialog)
                reject('')
              },
              render (h) {
                return h('date-picker', {
                  props: { value },
                  on: {
                    input (date) {
                      value = date
                    }
                  }
                })
              }
            }))
          })
        },
        async pickDistrict (title = '选择地区', defaultValue = null) {
          const vm = this
          return new Promise(async (resolve, reject) => {
            let value = defaultValue || await vm.getCurrentDistrict()
            const dialog = vm.openDialog(new DialogOptions({
              title,
              onOk () {
                vm.$store.dispatch('notifier/closeDialog', dialog)
                resolve(value)
              },
              onCancel () {
                vm.$store.dispatch('notifier/closeDialog', dialog)
                reject('')
              },
              render (h) {
                return h('district-picker', {
                  props: { value },
                  on: {
                    input (val) {
                      value = val
                    }
                  }
                })
              }
            }))
          })
        }
      }
    })
  }
}


