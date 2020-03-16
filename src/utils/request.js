// 请求管理工具
import axios from 'axios'
import JSONBig from 'json-bigint'// 引入大数字插件
import store from '@/store'// 引入vuex中的store实例对象 相当于组件的this.$store
// axios.defaults 是对原有默认值进行修改
// axios.create() 相当于 new 了一个新的axios实例
const instance = axios.create({
// 构造函数 传入一些配置 同defaults
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0',
  //   transformResponse函数后台响应回来 但是还未进入到axios的响应拦截是执行 数组里可以写多个的处理函数
  transformResponse: [function (date) {
    // date就是后端响应回来的字符串
    return date ? JSONBig.parse(date) : {}
  }]
})// 创建一个axios实例

// 注入token 应该在请求之前 即请求拦截器
// instance是axios应该新的实例
instance.interceptors.request.use(function (config) {
  // 成功的时候 如何处理
  // 读取配置信息 给配置信息中注入token
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`// 讲token同意注入headers
  }
  return config// 返回配置
}, function (error) {
  // 直接返回profile错误
  return Promise.reject(error)// 返回错误 这样的话会直接进入到axios的catch中
})
// 用响应器拦截 出 返回结果的数据 讲多嵌套的结果结构出来
instance.interceptors.response.use(function (response) {
  // Response已经被axios包了一层数据 data才是之前出来的数据
  try {
    return Response.data.data// 如果成功则返回
  } catch (error) {
    //   如果失败 说明 Response.data不存在
    return Response.data
  }
}, function (error) {
// 直接返回失败
  return Promise.reject(error)// 返回执行链的catch
})
export default instance
