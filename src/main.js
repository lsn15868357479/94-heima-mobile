import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'// 引入vant
import 'vant/lib/index.css'// 引入样式
import '@/styles/index.less'
import 'amfe-flexible'

Vue.use(Vant) // 全局注册  实际上调用了 Vant导出的对象的方法  install方法

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
