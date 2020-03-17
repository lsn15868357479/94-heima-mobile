// 请求管理工具
import axios from 'axios'
import JSONBig from 'json-bigint'// 引入大数字插件
import store from '@/store'// 引入vuex中的store实例对象 相当于组件的this.$store
import router from '@/router'
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
}, async function (error) {
  // 如果请求失败或者失效或其他错误 会进入到响应拦截器的错误区域
  // 只有是401 就是token失效（应该用导航守卫将没有token的拦截在外面）
// 直接返回失败
  // error
  //    config 是出现这次错误的请求信息
  //    request 请求对象
  //    response 响应对象status（状态码）
  if (error.response && error.response.status === 401) {
    const path = {
      path: '/login', // 地址
      query: {
        // 需要传递的query参数
        redirectUrl: router.currentRoute.fullpath// 表示登录页需要跳转的地址
      }
    }
    // 如果状态码为401 就是token失效
    // `refresh_token`
    if (store.state.user.refresh_token) {
      // 表示有`refresh_token`
      // 如果有refresh_token 我们就要用refresh 换取新token  需要调用刷新token的接口
      // 发请求 得用工具啊 ? 用instance 还是axios呢 ?
      // 这里必须要用axios 因为 现在token已经失效了 instance的拦截器 还是会去将 失效的token注入到 headers中
      // 需要用没有拦截器的axios 来发 刷新token的请求
      try {
        const result = await axios({
          method: 'put',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: { Authorization: `Beaer ${store.state.user.refresh_token}` }
        })
        // result.data.data.token// 新token
        // 如果成功了 应该更新失效的token
        // 直接更新vuex中的数据
        store.commit('updateUser', {
          // 载荷数据
          user: {
            token: result.data.data.token, // 新token// 最新token
            refresh_token: store.state.user.refresh_token
          }
        })
        // / 提交mutations 更新vuex数据
        //   你之所以会到这个位置 是因为  401, 也就意味着你之前的请求 是错误的
        //  需要把之前错误的请求再次发送出去 用axios 还是 instance呢
        return instance(error.config)// 相当于 执行之前出现401错误的请求  返回这个请求的目的 是继续执行这个请求执行链下面的内容
      } catch (error) {
        //   如果失败意味着 你尝试去续命 可是续命失败
        // 重新登录 重新登录之前 需要  删除掉 token 因为此时 token失效 refesh_token也失效
        store.commit('delUser')
        router.push(path)
      }
    } else {
      // 如果没有`refresh_token`直接跳到登录
      router.push('./login')
      // 如果由于token失效，跳到登录页  当前页面如何 跳转成功后不一定是这个页面
      // / 我们要实现 你 在  A页面发请求 结果失效了  也没有refresh_token,只能回到 login, 你登录之后, 你希望回到A页面
      // 怎么做呢 ? 我们需要在跳到登录页中过程中 ,把当前页面的地址 传给 登录页面
      // 登录页面 登录成功能之后 先判断 有没有需要跳转的地址 如果没有跳到主页 如果有 跳到需要跳转的页面
      // router.currentRoute // 表示当前的路由信息对象 里面包含了路由的地址 和参数
      // 我们需要获取 当前路由的带参数的地址  router.currentRoute.fullPath(文档)
      // router.currentRoute // 表示当前的路由信息对象 里面包含了路由的地址 和参数
      // 我们需要获取 当前路由的带参数的地址  router.currentRoute.fullPath(文档)
      store.commit('delUser')// 也要删除token 因为token失效
      router.push(path)
    }
  }
  return Promise.reject(error)// 返回执行链的catch
})
export default instance
