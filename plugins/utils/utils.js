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
   * @param action
   * @param args
   * @returns {Promise<*>}
   */
  async doAction (action, args) {
    const vm = this
    return action.apply(vm, args)
  },
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
      return this.finalize(term.apply(this, args))
    }
    if (term.then instanceof Function) return term
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
}
