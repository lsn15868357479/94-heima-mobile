import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/permission' // 权限拦截模式
import store from './store'
import Vant, { Lazyload } from 'vant'// 引入vant
import plugin from '@/utils/plugin'
import 'vant/lib/index.less'// 引入样式  想修改某个变量
import '@/styles/index.less'
import 'amfe-flexible'

Vue.use(Vant) // 全局注册  实际上调用了 Vant导出的对象的方法  install方法
Vue.use(plugin)
Vue.use(Lazyload) // 注册 懒加载的指令 图片就可以搭配这个指令进行懒加载了
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
//  export default  Vant  默认对象
// export const LazyLoad = {} // 平常对象
