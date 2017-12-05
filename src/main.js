// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import model from './store/model'
import schema from './store/schema-store'
import Vuex, { createNamespacedHelpers } from 'vuex'

Vue.config.productionTip = false
Vue.use(Vuex)

window.Vue = Vue
window.createNamespacedHelpers = createNamespacedHelpers

window.$store = new Vuex.Store({
  modules: {
    model: {namespaced: true, ...model},
    formSchema: schema
  }
})

/* window.$store.dispatch('init', {
  schemaNamespace: '',
  modelNamespace: 'model',
  value: {
    fields: [{
      id: 'id1',
      model: 'a'
    }],
    groups: [{
      id: 'grp1',
      fields: [{
        id: 'id1',
        model: 'a',
        dependsOn: ['id1'],
        watcher: function watchid1 () { console.log('notified', arguments) }
      }, {
        id: 'id2',
        model: 'a',
        dependsOn: ['id1'],
        watcher: function watchid1 () { console.log('notified', arguments) }
      }]
    }]
  }
}) */

window.Vue = Vue

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: window.$store,
  router,
  template: '<App/>',
  components: {App}
})
