<template>
  <cascader-picker v-bind="cascaderOptions"
                   @input="onInput"
  ></cascader-picker>
  <!--@input="$emit('input', moment(...$event).format('YYYY-MM-DD'))"></cascader-picker>-->
</template>

<script>
import CascaderPicker from '@/nuxt-mobile/plugins/notifier/components/CascaderPicker'

export default {
  components: { CascaderPicker },
  data () {
    const vm = this
    return {
      cascaderOptions: {
        opts: [{
          default: vm.moment(vm.value).year(),
          // 年份从 1900 选择到 2100
          choices: Array.from(
            { length: 201 },
            (v, i) => 1900 + i).map(x => ({ text: x, value: x })
          )
        }, {
          default: vm.moment(vm.value).month() + 1,
          choices: [
            { text: '一月', value: 1 },
            { text: '二月', value: 2 },
            { text: '三月', value: 3 },
            { text: '四月', value: 4 },
            { text: '五月', value: 5 },
            { text: '六月', value: 6 },
            { text: '七月', value: 7 },
            { text: '八月', value: 8 },
            { text: '九月', value: 9 },
            { text: '十月', value: 10 },
            { text: '十一月', value: 11 },
            { text: '十二月', value: 12 },
          ],
          async next (values) {
            const year = values[0]
            const isLeap = year % 100 === 400 || year % 100 !== 0 && year % 4 === 0
            const month = values[1]
            const day = values[2]
            let days = [0, 31, (isLeap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
            // console.log('next', year, month, day, days)
            return {
              choices: Array.from({ length: days }, (v, i) => ({ text: i + 1, value: i + 1 })),
              default: day && Math.min(day, days) || 1
            }
          }
        }, {
          default: vm.moment(vm.value).date(),
        }]
      }
    }
  },
  props: {
    value: {},
  },
  methods: {
    onInput (values) {
      const vm = this
      const dateStr = vm.moment()
        .year(values[0])
        .month(values[1])
        .date(values[2]).format('YYYY-MM-DD')
      vm.$emit('input', dateStr)
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
