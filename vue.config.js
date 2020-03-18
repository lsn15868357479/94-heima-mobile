// 需要导出一个对象
module.exports = {
// 需要更改less中变量位置
  css: {
    // css相关
    loaderOptions: {
      // 所有关于样式loader相关的选项
      less: {
        modifyVars: {
          blue: '#3296fa'
        }
      }
    }
  }
}
