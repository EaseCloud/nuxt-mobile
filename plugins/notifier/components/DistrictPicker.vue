<template>
  <cascader-picker v-bind="cascaderOptions" @input="onInput"></cascader-picker>
</template>

<script>
import CascaderPicker from '@/nuxt-mobile/plugins/notifier/components/CascaderPicker'

export default {
  components: { CascaderPicker },
  data () {
    const vm = this
    const gb = vm.__gb__()
    let defaultDivision
    try {
      defaultDivision = gb.get(vm.value || '110101')
    } catch (e) {
      defaultDivision = gb.get('110101')
    }
    return {
      cascaderOptions: {
        value: [
          defaultDivision.province && defaultDivision.province.code || '110000',
          defaultDivision.prefecture && defaultDivision.prefecture.code || defaultDivision.code,
          vm.value || '110101'
        ],
        opts: [{
          choices: gb.provinces().map(division => ({
            text: division.name,
            value: division.code
          })),
          async next (values) {
            return {
              choices: values[0] ? gb.prefectures(values[0]).map(division => ({
                text: division.name,
                value: division.code
              })) : []
            }
          }
        }, {
          async next (values) {
            return {
              choices: values[1] ? gb.counties(values[1]).map(division => ({
                text: division.name,
                value: division.code
              })) : []
            }
          }
        }, {}]
      }
    }
  },
  props: {
    value: {},
  },
  methods: {
    onInput (values) {
      const vm = this
      vm.$emit('input', values[2] || values[1] || values[0])
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../assets/styles/defines";

.page {
  background: @color-bg-fade;
  .row-action {
    margin-top: 2rem;
    font-size: 32*@px;
    padding: 0 80*@px;
    .btn {
      margin-top: 30*@px;
      display: block;
      text-align: center;
      line-height: @button-primary-height;
      .rounded-corners(0.2rem);
      color: @color-grey-darken-3;
      background: white;
      border: 1px solid @color-border;
    }
  }
}
</style>
