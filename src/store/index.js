// store的index，专门处理vuex中的模块

import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    // 专门放置需要共享的状态
    // { token: '', refresh_token: ''  }  现在还没有设置  预设
    user: auth.getUser()// 就是token信息的对象 如果需要持久化 如果缓存中也token 就从缓存中读取
  },
  mutations: {
    // 修改token
    updateUser (state, payload) {
      state.user = payload.user// 定义载荷中的user给state
      // 更新vuex的时候 也应该讲最新的书籍 存入本地缓存
      auth.setUser(payload.user)// 相当于保持vuex与本地存储的同步
    },
    // 删除token
    delUser (state) {
      state.user = {}// 讲vuex中设置为空对象
      // 缓存中的数据也需要更新
      auth.delUser()// 删除本地缓存中的token
    }
  },
  actions: {
  },
  modules: {
  }
})
