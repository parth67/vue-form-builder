// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import model from './store/model'
import _ from 'lodash'
// import schema from './store/schema-store'
import Vuex, { createNamespacedHelpers } from 'vuex'

Vue.config.productionTip = false
Vue.use(Vuex)

window.Vue = Vue
window.Vuex = Vuex
window._ = _
window.createNamespacedHelpers = createNamespacedHelpers

window.$store = new Vuex.Store({
  modules: {
    model: {namespaced: true, ...model}
    // formSchema: schema
  }
})

window.Vue = Vue

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: window.$store,
  template: '<App/>',
  components: {App}
})
