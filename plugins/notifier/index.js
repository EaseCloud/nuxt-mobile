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
        async pickLocation (title, lng = 0, lat = 0, label = '') {
          // TODO: 拾取地理位置
          const vm = this
          const currentLocation = await vm.getCurrentLocation()
          const [oldLng, oldLat, oldLabel] = lat && lng ? [lng, lat, label]
            : [currentLocation.lng, currentLocation.lat, currentLocation.label]
          return new Promise(async (resolve, reject) => {
            let data = { lng: oldLng, lat: oldLat, label: oldLabel }
            const dialog = vm.openDialog(new DialogOptions({
              mode: 'full',
              render (h) {
                const $marker = h('el-amap-marker', { props: { position: [oldLng, oldLat] } })
                const $map = h('el-amap', {
                  props: {
                    zoom: 14,
                    center: [oldLng, oldLat],
                    plugin: [{ pName: 'Scale' }, { pName: 'ToolBar' }, { pName: 'Geolocation' }],
                    events: {
                      moveend () {
                        const map = $map.componentInstance.$$getInstance()
                        const center = map.getCenter()
                        const marker = $marker.componentInstance.$$getInstance()
                        marker.setPosition(center)
                        data.lng = center.lng
                        data.lat = center.lat
                        // 移动之后立即反解位置信息
                        if (window.AMap.Geocoder) {
                          const geocoder = new window.AMap.Geocoder({ radius: 1000, extensions: 'all' })
                          geocoder.getAddress([center.lng, center.lat], function (status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                              if (result && result.regeocode) {
                                // TODO: 将中间的地址信息显示到界面上
                                // console.log(result.regeocode)
                                data.adcode = result.regeocode.addressComponent.adcode
                                data.label = result.regeocode.formattedAddress
                              }
                            }
                          })
                        }
                      }
                    }
                  }
                }, [$marker])
                return h('div', {
                  style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                  }
                }, [$map, h('div', {
                  style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    background: 'white',
                    borderBottom: '1px solid grey',
                    padding: vm.px(20),
                    fontSize: vm.px(28),
                    lineHeight: vm.px(64)
                  }
                }, [h('div'), h('a', {
                  style: {
                    float: 'right',
                    color: 'white',
                    background: 'grey',
                    textAlign: 'center',
                    width: vm.px(100),
                    marginLeft: vm.px(10),
                    borderRadius: vm.px(10),
                  },
                  on: {
                    click () {
                      vm.$store.dispatch('notifier/closeDialog', dialog)
                      // console.log('reject')
                      reject()
                    }
                  }
                }, '取消'), h('a', {
                  style: {
                    float: 'right',
                    color: 'white',
                    background: 'blue',
                    textAlign: 'center',
                    width: vm.px(100),
                    marginLeft: vm.px(10),
                    borderRadius: vm.px(10),
                  },
                  on: {
                    click () {
                      vm.$store.dispatch('notifier/closeDialog', dialog)
                      // console.log('resolve', data)
                      resolve(data)
                    }
                  }
                }, '确定')])])
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


