import Vue from 'vue'

import './api'
import './notifier'

import Page from '../components/Page'

Vue.mixin({
  components: {
    Page,
  }
})
