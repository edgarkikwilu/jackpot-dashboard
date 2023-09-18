import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

Vue.config.productionTip = false

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL

new Vue({
  render: h => h(App),
}).$mount('#app')
