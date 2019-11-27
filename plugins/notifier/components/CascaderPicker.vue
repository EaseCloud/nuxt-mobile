<template>
  <div class="cascader">
    <cascader-picker-item
      v-if="toggleLevel!==i" ref="pickerItems"
      class="cascader-level" v-for="(opt, i) in opts" @input="update(i, $event)"
      :key="i" :listData="opt.choices||[]"
      type="cycle" :value="values[i]"></cascader-picker-item>
  </div>
</template>

<script>
import CascaderPickerItem from '@/nuxt-mobile/plugins/notifier/components/CascaderPickerItem'

export default {
  components: { CascaderPickerItem },
  data () {
    const vm = this
    return {
      toggleLevel: -1,
      // 固化传入的值
      // values: Array.from({ length: vm.opts.length }, () => 0)
      values: vm.opts.map((c, i) => !vm.value || vm.value[i] === void 0 ? c.default : vm.value[i])
    }
  },
  props: {
    value: { type: Array, default: () => [] },
    opts: { type: Array }
  },
  computed: {
    levels () {
      return this.opts.length
    }
  },
  async mounted () {
    const vm = this
    await vm.init()
  },
  methods: {
    async init () {
      const vm = this
      await vm.update(
        0,
        vm.value && vm.value[0] || vm.opts[0].default ||
        vm.opts[0].choices[0] && vm.opts[0].choices[0].value
      )
    },
    async reloadPickerItem (level) {
      const vm = this
      return new Promise((resolve, reject) => {
        vm.toggleLevel = level
        vm.$nextTick(() => {
          vm.toggleLevel = -1
          resolve()
        })
      })
    },
    async update (level, value) {
      const vm = this
      // 先设置当前值
      vm.values.splice(level, 1, value)
      // 后续级联处理
      if (level === vm.levels - 1) {
        // 如果已经是最后一级，返回所选值
        vm.$emit('input', vm.values)
      } else {
        // 如果还有下一级，要传导下去
        const nextOpt = vm.opts[level + 1]
        // 如果下一级有指定的处理
        if (vm.opts[level].next) {
          const nextOptions = await vm.opts[level].next(vm.values)
          if (nextOptions) {
            // 更新下一级的选项
            Object.assign(nextOpt, nextOptions)
            // 如果 next 函数计算出来需要刷新下一级的 choices，重新加载下一级的组件
            if (nextOptions.choices) await vm.reloadPickerItem(level + 1)
          }
        }
        let nextValue = vm.values[level + 1]
        // 更新下一级，如果选项脱钩，设置为默认值
        if (vm._.find(nextOpt.choices, { value: nextValue }) === void 0) {
          nextValue = nextOpt.default === void 0 ?
            nextOpt.choices[0] && nextOpt.choices[0].value : vm.opts[level + 1].default
        }
        await vm.update(level + 1, nextValue)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/styles/defines';

.cascader {
  display: flex;
  //height: 750*@px;
}
</style>
