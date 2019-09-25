import Vue from 'vue'
import App from './App.vue'

import SmartTable from 'vuejs-smart-table'

Vue.config.productionTip = false

Vue.use(SmartTable)

new Vue({
  render: h => h(App)
}).$mount('#app')
