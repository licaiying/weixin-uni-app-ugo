import Vue from 'vue'
import App from './App'

// 导入 request 函数
import request from './utils/request.js'
Vue.use(request)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
