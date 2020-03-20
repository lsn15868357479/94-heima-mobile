<template>
 <!-- 文章列表组件  放置列表 -->
  <!-- van-list 可以帮助我们实现上拉加载  需要一些变量 -->
  <!-- 这里放置这个div的目的是 形成滚动条, 因为我们后期要做 阅读记忆 -->
  <!-- 阅读记忆  上次你阅读到哪  回来之后还是哪-->
<div class="scroll-wrapper">
    <!-- 文章列表 -->
      <!-- van-list组件 如果不加干涉, 初始化完毕 就会检测 自己距离底部的长度,如果超过了限定 ,就会执行 load事件  自动把
       绑定的 loading 变成true
      -->
      <!-- 下拉刷新事件 包裹列表事件 -->
      <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="successText">
         <van-list finished-text="数据为0" v-model="upLoading" :finished="finished" @load="onLoad">
      <!-- 循环内容 -->
      <van-cell-group>
            <van-cell v-for="item in articles" :key="item" title="134456" :value="'55565656' +item"></van-cell>
      </van-cell-group>

    </van-list>
      </van-pull-refresh>

</div>
</template>

<script>
export default {
  data () {
    return {
      successText: '',
      downLoading: false,
      upLoading: false, // 表示是否开启了上拉加载 默认值false
      finished: false, // 表示 是否已经完成所有数据的加载
      articles: []// 文章列表
    }
  },
  methods: {
    onLoad () {
      console.log('开始加载数据')
      // 如果数据加载完毕 应该把finished设置为true
      // 如果超过100条直接关闭
      if (this.articles.length > 50) {
        // 如果此时记录以及大于50
        this.finished = true// 关闭加载
      } else {
        const arr = Array.from(Array(20), (value, index) => this.articles.length + index + 1)
        //  上拉加载不是覆盖之前数据 应该把数据追加的数组的队尾
        this.articles.push(...arr)
        this.upLoading = false
      }

      // 下面这么写 依然不能关掉加载状态 为什么 ? 因为关掉之后  检测机制  高度还是不够 还是会开启
      // 如果你有数据 你应该 把数据到加到list中
      // 如果想关掉
      // setTimeout(() => {
      //   this.finished = true // 表示 数据已经全部加载完毕 没有数据了
      // ,}, 1000) // 等待一秒 然后关闭加载状态
    },
    // 下拉刷新
    onRefresh () {
      setTimeout(() => {
        // 要读取最新的数据 最新的数据要添加到数据的头部
        const arr = Array.from(Array(2), (value, index) => '追加' + (index + 1))
        // 数组添加到头部
        this.articles.unshift(...arr)
        // 手动关闭加载的状态
        this.downLoading = false
        this.successText = `更新了${arr.length}条数据`
      }, 1000)
    }
  }
}
</script>

<style>

</style>
