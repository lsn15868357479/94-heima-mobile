// 次文件专门处理postcss文件
module.exports = {
  // 所有的postcss插件
  plugins: {
    //   自动给css样式加前缀的属性 display:flex
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 37.5, // 基准值 font-size:30px => 30/rootValue =rem
      propList: ['*']// 包括哪些文件  索引的文件都转化
    }
  }
}
