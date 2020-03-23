import store from '@/store' // 游客用户的key
// 负责处理频道数据
import request from '@/utils/request'
const CACHE_CHANNEL_V = 'hm-94-toutiao-v'// 登录用户的key
const CACHE_CHANNEL_T = 'hm-94-toutiao-t' // 游客用户的key
// 获取我的频道数据 没有参数 匿名用户也可获取数据
// 要将此方法改造成本地化的频道
export function getMyChannels () {
  // 我们要对原来的方法 进行改造 但是不想 改造调用的方式
  return new Promise(function (resolve, reject) {
    // 支持本地化缓存  要区分当前是登录用户还是游客用户 如何登录还是游客  可以根据当前有没有token 来判断 是否是登录
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T // key根据当前的登录状态来判断
    // 去缓存中读取 用户频道数据
    const str = localStorage.getItem(key)// 通过缓存key获取缓存中的用户的频道数据
    if (str) {
      // 本地缓存有数据  应该把本地数据释放给 后面的执行结果
      resolve({ channels: JSON.parse(str) })
    } else {
      // 本地缓存没有数据 就要去线上拉取数据
      request({
        url: '/user/channels'
      }).then(result => {
        // 获取请求结果
        localStorage.setItem(key, JSON.stringify(result.channels))
        // 这里还需要 resolve 我们的数据
        resolve(result)// 这里表示直接 成功执行了 获取用户频道数据
      })// 得到线上的一个用户频道列表数据  先把这个数据放入缓存
    }
  })
  // return request({
  //   url: '/user/channels'
  // })
}
// 获取全部频道
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
