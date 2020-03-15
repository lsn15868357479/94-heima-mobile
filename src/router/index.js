import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 按需加载方式配置路由
const Layout = () => import('@/views/layout')// 按需引入layout一级路由
// 二级路由
const home = () => import('@/views/home')
const question = () => import('@/views/question')
const video = () => import('@/views/video')
const user = () => import('@/views/user')
// 其他一级路由
const chat = () => import('@/views/user/chat')
const login = () => import('@/views/login')
const profile = () => import('@/views/user/profile')
const search = () => import('@/views/search')
const searchresult = () => import('@/views/search/result')
const article = () => import('@/views/article')
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Layout, // 布局组件 一级路由
    // 二级路由
    children: [{
      path: '', // 什么都不写 表示默认为二级路由组件
      component: home
    }, {
      path: '/question',
      component: question
    }, {
      path: '/video',
      component: video
    }, {
      path: '/user',
      component: user
    }]// 二级路由

  }, {
    path: '/user/chat',
    component: chat
  }, {
    path: '/login',
    component: login
  }, {
    path: '/user/profile',
    component: profile
  }, {
    path: '/search',
    component: search
  }, {
    path: '/search/result',
    component: searchresult
  }, {
    path: '/article',
    component: article
  }
]
const router = new VueRouter({
  routes
})

export default router
