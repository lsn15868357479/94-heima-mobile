// 专门处理用户信息的存储和删除 以及获取 放置在 localStorge
const USER_TOKEN = 'heima-toutiao-m-94' // 这个key专门用来存储 用户信息
// 设置用户的信息
export function setUser (user) {
  // user一个是一个对象
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user))// user需要转化成字符串
}

// 读取用户信息
export function getUser () {
  // 讲字符串转化为对象在返回
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || '{}') // 短路表达式
//   如果前面为true 后面不执行 如果前面为false 后面执行
}

// 删除用户信息
export function delUser () {
  localStorage.removeItem(USER_TOKEN)
}
