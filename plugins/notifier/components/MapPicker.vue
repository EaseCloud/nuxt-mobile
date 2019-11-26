<template>
  <div class="map-picker">
    <el-amap ref="map" :zoom="14" :center="[item.lng, item.lat]"
             :plugin="plugin" :events="events">
      <el-amap-marker ref="marker" :position="[item.lng, item.lat]"></el-amap-marker>
    </el-amap>
    <div class="map-picker-menu">
      <div class="menu-actions">
        <a class="btn-cancel" @click="$emit('input')">取消</a>
        <a class="btn-submit" @click="$emit('input', item)">确定</a>
      </div>
      <div class="menu-label">{{item.label}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    const vm = this
    return {
      item: {
        lng: vm.lng,
        lat: vm.lat,
        label: vm.label,
        adcode: vm.adcode
      },
      plugin: [{ pName: 'Scale' }, { pName: 'ToolBar' }, { pName: 'Geolocation' }],
      events: {
        moveend () {
          const map = vm.$refs.map.$$getInstance()
          const center = map.getCenter()
          // const marker = vm.$refs.marker.$$getInstance()
          // marker.setPosition(center)
          vm.item.lng = center.lng
          vm.item.lat = center.lat
          // 移动之后立即反解位置信息
          if (window.AMap.Geocoder) {
            const geocoder = new window.AMap.Geocoder({ radius: 1000, extensions: 'all' })
            geocoder.getAddress([center.lng, center.lat], function (status, result) {
              if (status === 'complete' && result.info === 'OK') {
                if (result && result.regeocode) {
                  // console.log(result.regeocode)
                  vm.item.adcode = result.regeocode.addressComponent.adcode
                  vm.item.label = result.regeocode.formattedAddress
                }
              }
            })
          }
        }
      }
    }
  },
  props: {
    label: { type: String, default: '' },
    lng: { type: Number, default: 0 },
    lat: { type: Number, default: 0 },
    adcode: { default: '' },
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/styles/defines';

.map-picker {
  .fill-absolute();
  .map-picker-menu {
    .fixed-top();
    background: white;
    border-bottom: 1px solid @color-border;
    padding: 20*@px;
    font-size: 28*@px;
    line-height: 64*@px;
    .menu-label {
      margin-right: 250*@px;
      line-height: 32*@px;
    }
    .menu-actions {
      float: right;
      .btn-cancel {
        float: left;
        color: white;
        background: @color-grey;
        width: 100*@px;
        text-align: center;
        margin-left: 10*@px;
        .rounded-corners(10*@px);
      }
      .btn-submit {
        float: left;
        color: white;
        background: @color-primary-background;
        width: 100*@px;
        text-align: center;
        margin-left: 10*@px;
        .rounded-corners(10*@px);
      }
    }
  }
}
</style>
