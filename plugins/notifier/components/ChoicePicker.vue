<template>
  <ul class="choice-picker" :style="{textAlign:align}">
    <li class="choice-item"
        :class="{multiple,
          default:!multiple&&value===choice.value,
          selected:multiple&&values.indexOf(choice.value)>-1}"
        v-for="choice in choiceList" @click="onInput(choice.value)">{{choice.text}}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ChoicePicker',
  data () {
    const vm = this
    return {
      values: vm.multiple && [...vm.value]
    }
  },
  props: {
    value: {},
    multiple: { type: Boolean, default: false },
    align: { type: String, default: 'center' },
    choiceList: { type: Array }
  },
  methods: {
    onInput (value) {
      const vm = this
      if (vm.multiple) {
        const pos = vm.values.indexOf(value)
        if (pos > -1) vm.values.splice(pos, 1)
        else vm.values.push(value)
        return vm.$emit('input', vm.values)
      } else {
        return vm.$emit('input', value)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../assets/styles/defines";

ul.choice-picker {
  position: relative;
  //padding: 30*@px 0;
  //line-height: 64*@px;
  max-height: 750*@px;
  overflow: auto;
  li.choice-item {
    line-height: 88*@px;
    padding: 0 50*@px;
    border-bottom: 1px solid @color-bg-fade;
    position: relative;
    &.multiple::before {
      //content: '☐';
    }
    &.default {
      color: @color-primary-background;
    }
    &.selected {
      background: @color-blue-lighten-5;
      &::before {
        //content: '☑';
        content: '✔';
        color: @color-blue-darken-2;
        margin-right: 20*@px;
      }
    }
  }
}
</style>
