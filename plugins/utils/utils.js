import Vue from 'vue'
import _ from 'lodash'

export default {
  /** 向控制台输出脚本，主要用在 template 中调用，方便调试编写
   * @param msg
   * @param method
   */
  echo (msg, method = 'log') {
    console[method](msg)
  },
  /**
   * 执行一个 action，主要用在 template 中调用，可以将 this 指针替换成当前 vm
   * 是否返回 async 结果仅取决于 action 本身是否 async
   * @param action
   * @param args
   * @returns {Promise<*>}
   */
  doAction (action, args) {
    const vm = this
    return action.apply(vm, args)
  },
  // /** TODO: 然而测试过并不存在能够阻塞返回的 async 函数
  //  * 执行一个 action，主要用在 template 中调用，可以将 this 指针替换成当前 vm
  //  * action 可以为一个 async 函数，但是如果 async 是阻塞返回结果的，那么这个函数
  //  * 就能直接同步返回这个返回值，反之无效
  //  * @param action
  //  * @param args
  //  * @returns {Promise<*>}
  //  */
  // doActionSync (action, args) {
  //   const vm = this
  //   let returnValue
  //   (async () => {
  //     console.log('fuck 3', returnValue)
  //     returnValue = await action.apply(vm, args)
  //     console.log('fuck 2', returnValue)
  //   })()
  //   console.log('fuck 1')
  //   return returnValue
  // },
  /**
   * 通过反复执行，直到返回值为真的方式异步获取一个待设置的值
   * 例如：item[key] 正在被写入，其他的程序片段要调取它的值，但是不确定什么时候才写入完毕
   * 那就可以使用 await vm.waitFor(item, key) 的方式获取
   * @param item
   * @param key
   * @param timeout
   * @param interval
   * @returns {Promise<any>}
   */
  async waitFor (item, key, timeout = 5000, interval = 50) {
    const vm = this
    const deadline = Date.now() + timeout
    return new Promise((resolve, reject) => {
      const check = () => {
        let value = vm.evaluate(item, key)
        if (value) resolve(value)
        if (Date.now() > deadline) reject(new Error('waitFor timed out'))
        setTimeout(check, interval)
      }
      check()
    })
  },
  /**
   * 将一个 map 转换成 [{text: <map.value>, value: <map.key>}, ...] 的数组形式
   * 具备幂等性，多次包裹最终的结果一样
   * @param choices
   * @returns {*}
   */
  wrapChoices (choices) {
    if (choices instanceof Array || !(choices instanceof Object)) return choices
    return _.map(choices, (value, key) => ({ value: key, text: value }))
  },
  /**
   * 对一个对象级联求值
   * 例如：
   *   evaluate({
     *     a { b: 'BINGO' }
     *   }, 'a.b')
   * 返回：'BINGO'
   * @param item Object
   * @param key String
   * @param defaultValue 默认值，如果求值结果是 undefined，返回这个值
   */
  evaluate (item, key, defaultValue = void 0) {
    // 缺省 key 的时候直接返回 item
    if (!key) return item
    // 执行级联求值
    let value = item
    key.split('.').forEach(k => {
      if (!k) return
      try {
        if (value === void 0) value = void 0
        value = value && value[k]
      } catch (e) {
        console.error('evaluate 求值错误', e)
      }
    })
    return value === void 0 ? defaultValue : value
  },
  /**
   * 级联写入一个属性值，使用 vm.$set
   * TODO: 将递归改成循环
   * 例如
   * @param item
   * @param key
   * @param value
   * @returns {*}
   */
  setProperty (item, key, value) {
    const vm = this
    // 缺省 keyStr 的时候直接返回 item
    if (!key) return item
    const index = key.indexOf('.')
    if (index > -1) {
      const k = key.substr(0, index)
      if (!item[k]) {
        if (vm.$set) {
          vm.$set(item, k, {})
        } else {
          Vue.set(item, k, {})
        }
      }
      vm.setProperty(item[k], key.substr(index + 1), value)
    } else {
      if (vm.$set) {
        vm.$set(item, key, value)
      } else {
        Vue.set(item, k, {})
      }
    }
    return item
  },
  /**
   * 终结计算一个项的值，接受可变参数 arguments 的传入
   * 1. 如果 term 为函数，调用函数（传入 arguments 的后续变量），然后递归调用 finalize
   * 2. 如果 term 为一个 Promise，直接返回
   * 3. 否则，返回 Promise.resolve(term)
   * @param term
   * @param args
   * @returns Promise<Any> 获取最终结果的 Promise，不保证同步
   */
  async finalize (term, ...args) {
    if (!term) return term
    if (term instanceof Function) {
      return this.finalize(await term.apply(this, args))
    }
    if (term.then instanceof Function) return this.finalize(await term)
    return term
  },
  /**
   * [同步调用版本，不支持 Promise]
   * 终结计算一个项的值，接受可变参数 arguments 的传入
   * 1. 如果 term 为函数，调用函数（传入 arguments 的后续变量），然后递归调用 finalize
   * 2. 否则，返回 Promise.resolve(term)
   * @param term
   * @param args
   * @returns Promise<Any> 获取最终结果的 Promise，不保证同步
   */
  finalizeSync (term, ...args) {
    return term instanceof Function ? this.finalizeSync(term.apply(this, args)) : term
  },
  /**
   * 执行返回或者（当已经返回到第一个页面的时候）跳转到指定的路由
   * @param route
   */
  backOrRedirect (route) {
    const vm = this
    const originRoute = { ...vm.$route }
    vm.$router.back()
    vm.$nextTick(() => {
      // 如果路由并没有发生改变，则认为已经返回失败了
      if (vm._.isEqual(originRoute, vm.$route)) {
        // 这个时候，替换页面到指定的路由，默认值为根路径
        vm.$router.replace(route || '/')
      }
    })
  },
  isWechat () {
    return process.browser && /MicroMessenger/.test(navigator.userAgent)
  },
  async getWxJssdk () {
    const vm = this
    return new Promise((resolve, reject) => {
      if (!vm.isWechat() || !window.wx) {
        return reject()
      }
      window.wx.ready(() => {
        // alert('微信环境加载成功');
        resolve(window.wx)
      }, () => {
        reject()
      })
    })
  },
  async wxScan (desc = '') {
    const vm = this
    const wx = await vm.getWxJssdk()
    return new Promise((resolve, reject) => {
      wx.scanQRCode({
        desc,
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        // scanType: ['qrCode'], // 可以指定扫二维码还是一维码，默认二者都有
        async success (res) {
          resolve(res.resultStr);
        }
      })
    })
  },
  /**
   * 前端页面跳转到 qq 地图的相应界面
   * @param name 地点名称
   * @param geo_lat 纬度坐标
   * @param geo_lng 经度坐标
   * @param geo_label 详细地址文本
   */
  async redirectLocation ({ name, geo_lat, geo_lng, geo_label }) {
    const vm = this
    const wx = await vm.getWxJssdk().catch(() => null)
    if (wx) {
      wx.openLocation({
        latitude: geo_lat,
        longitude: geo_lng,
        name: name,
        address: geo_label,
        scale: 17,
        infoUrl: ''
      })
    } else {
      const url =
        `https://3gimg.qq.com/lightmap/v1/marker/index.html?type=0` +
        `&marker=coord%3A${geo_lat}%2C${geo_lng}%3Btitle%3A${name}%3Baddr%3A${geo_label}` +
        `&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp`
      // console.log(url)
      location.href = url
    }
  },
  /**
   * 获取当前的 GPS 定位坐标
   */
  async getCurrentLocation () {
    const vm = this
    const Geolocation = await vm.waitFor(window, 'AMap.Geolocation')
    const geolocation = new Geolocation({
      enableHighAccuracy: true,//是否使用高精度定位，默认:true
      timeout: 3000,          //超过10秒后停止定位，默认：无穷大
      maximumAge: 0,           //定位结果缓存0毫秒，默认：0
      convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
      // showButton: true,        //显示定位按钮，默认：true
      // buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
      // buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
      // showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
      // showCircle: false,       //定位成功后用圆圈表示定位精度范围，默认：true
      // panToLocation: false,    //定位成功后将定位到的位置作为地图中心点，默认：true
      // zoomToAccuracy: false     //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    })
    return new Promise((resolve, reject) => {
      geolocation.getCurrentPosition(async (status, result) => {
        if (status === 'complete') {
          // console.log(status, result)
          // alert(JSON.stringify(result))
          return resolve({
            lng: result.position.lng,
            lat: result.position.lat,
            adcode: result.addressComponent.adcode,
            province: result.privince,
            city: result.privince,
          })
        }
        // 如果取不到的话，取 localStorage 里面的缓存
        if (process.browser && localStorage.getItem('last_location')) {
          const [lng, lat] = localStorage.getItem('last_location').split(',')
          const Geocoder = await vm.waitFor(window, 'AMap.Geocoder')
          const geocoder = new Geocoder()
          return geocoder.getAddress([lng, lat], function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                const address = result.regeocode.addressComponent
                const data = {
                  lng,
                  lat,
                  adcode: address.adcode,
                  province: address.province,
                  city: address.city,
                  label: result.regeocode.formattedAddress
                }
                // console.log(data)
                resolve(data)
              }
            }
          })
        }
        // 以上取不到的时候才返回城市数据
        geolocation.getCityInfo((status, result) => {
          if (status !== 'complete') return reject()
          // console.log(status, result)
          resolve({
            lng: result.center[0],
            lat: result.center[1],
            adcode: result.adcode,
            province: result.province,
            city: result.city,
          })
        })
      })
    })
  },
  px (pixel) {
    return `${pixel / 750 * 20}rem`
  },
  async django_upload_image (file) {
    const vm = this
    const formData = new FormData()
    formData.append('image', file)
    const resp = await vm.api('image').post(formData)
    return resp.data
  }
}
