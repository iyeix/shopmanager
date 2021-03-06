// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import '@/assets/css/reset.css'
import Axios from 'axios'
import moment from 'moment'

// 使用element-ui
Vue.use(ElementUI)
Vue.prototype.$axios = Axios
// Axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
Axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.config.productionTip = false

// 全局过滤器，处理日期
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
