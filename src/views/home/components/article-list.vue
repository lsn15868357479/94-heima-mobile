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
          <van-cell v-for="item in articles" :key="item.art_id.toString()">
            <!-- 放置文章列表循环项  单图 三张图 无图-->
            <div class="article_item">
              <!-- 标题 -->
              <h3 class="van-ellipsis">{{item.title}}</h3>
              <!-- 根据当前的封面类型决定显示单图 三图 还是无图 -->
              <!-- 三图 -->
              <div class="img_box" v-if="item.cover.type === 3">
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 单图 -->
              <div class="img_box" v-if="item.cover.type === 1">
                   <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>

              <div class="info_box">
                <span>{{item.aut_name}}</span>
                <span>{{item.comm_count}}</span>
                <span>{{item.pubdate | relTime }}</span>
                  <!-- 此叉号的显示 应该根据当前的登录状态来判断 如果登录了 可以显示 如果没有登录 不显示 -->
                    <!-- 最原始方式   v-if="$store.state.user.token"-->
                    <!-- @事件名="逻辑处理"  点击事件中触发一个 显示反馈的事件-->
                <span @click="$emit('showAction',item.art_id.toString())" class="close" v-if="user.token">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getArticles } from '@/api/articles'
import eventBus from '@/utils/eventbus'
export default {
  created () {
    // 初始化函数
    // 监听删除文章事件
    // 相当于 有多少个实例 就有多少个监听
    eventBus.$on('delArticle', (artId, channelId) => {
      // 这个位置 每个组件实例都会触发
      // 这里要判断一下 传递过来的频道是否等于 自身的频道
      if (channelId === this.channel_id) {
        // 说明当前的这个article-list实例 就是我们要去删除数据的实例
        const index = this.articles.findIndex(item => item.art_id.toString() === artId)
        // 通过id 查询对应的文章数据所在的下标
        if (index > -1) {
          // 因为下标从0开始 所以应该大于-1
          this.articles.splice(index, 1)// 删除对应下标的数据
          // 但是 如果你一直删除 就会将 列表数据都删光 并不会触发 load事件
          if (this.articles.length === 0) {
            //  说明你把数据给删光了
            this.onLoad() // 手动的触发onload事件 给页面加数据
          }
        }
      }
    })
  },
  computed: {
    ...mapState(['user']) // 将user对象映射到计算属性中
  },
  data () {
    return {
      successText: '',
      downLoading: false,
      upLoading: false, // 表示是否开启了上拉加载 默认值false
      finished: false, // 表示 是否已经完成所有数据的加载
      articles: [], // 文章列表
      timestamp: null // 定义一个时间戳属性 用来储存 历史事件戳
    }
  },
  // props 对象形式 可以约束传入的值 必填传值的类型
  props: {
    // key(props属性名):value(对象 配置)
    channel_id: {
      required: true, // 必填项 此属性的含义true 要求改props必须传
      type: Number, // 表示要传入的prop属性的类型
      default: null // 默认值的意思 加入没有传入prop属性默认值就好采用
    }
  },
  methods: {
    async onLoad () {
      console.log('开始加载文章列表数据')
      // 如果数据加载完毕 应该把finished设置为true
      // 如果超过100条直接关闭
      // if (this.articles.length > 50) {
      //   // 如果此时记录以及大于50
      //   this.finished = true // 关闭加载
      // } else {
      //   const arr = Array.from(
      //     Array(20),
      //     (value, index) => this.articles.length + index + 1
      //   )
      //   //  上拉加载不是覆盖之前数据 应该把数据追加的数组的队尾
      //   this.articles.push(...arr)
      //   this.upLoading = false
      // }

      // 下面这么写 依然不能关掉加载状态 为什么 ? 因为关掉之后  检测机制  高度还是不够 还是会开启
      // 如果你有数据 你应该 把数据到加到list中
      // 如果想关掉
      // setTimeout(() => {
      //   this.finished = true // 表示 数据已经全部加载完毕 没有数据了
      // ,}, 1000) // 等待一秒 然后关闭加载状态
      await this.$sleep()// 人为控制了 请求的时间
      const data = await getArticles({
        channel_id: this.channel_id,
        timestamp: this.timestamp || Date.now()
      }) // this.channel_id指的是 当前的频道id
      //  获取内容
      this.articles.push(...data.results) // 将数据追加到队尾  这里用...
      this.upLoading = false // 关闭加载状态
      // 将历史时间戳 给timestamp  但是 赋值之前有个判断 需要判断一个历史时间是否为0
      // 如果历史时间戳为 0 说明 此时已经没有数据了 应该宣布 结束   finished true
      if (data.pre_timestamp) {
        // 如果有历史时间戳 表示 还有数据可以继续进行加载
        this.timestamp = data.pre_timestamp
      } else {
        // 表示没有数据可以请求了
        this.finished = true
      }
    },
    // 下拉刷新
    async onRefresh () {
      // 下拉刷新应该发送最新的时间戳
      await this.$sleep()// 人为控制了 请求的时间
      const data = await getArticles({
        channel_id: this.channel_id,
        timestamp: Date.now()// 永远传最新的时间戳
      })
      // 手动关闭下拉刷新的状态
      this.downLoading = false
      // 需要判断 最新的时间戳能否换来的数据啊  如果能换来数据 把新数据整个替换旧数据 如果不能  就告诉大家 暂时没有更新
      if (data.results.length) {
        // 如果有返回数据
        // 需要将整个的articles替换
        this.articles = data.results
        // 此时你 已经之前的全部数据覆盖了 假如 你之前把数据拉到了低端 也就意味着 你之前的finished已经为true了
        if (data.pre_timestamp) {
          // 因为下拉刷新 换来了一拨新的数据 里面 又有历史时间戳
          this.finished = false// 重新唤醒列表 让列表可以继续上拉加载
          this.timestamp = data.pre_timestamp // 记录历史时间戳给变量
        }
        this.successText = `更新了${data.results.length}条数据`
      } else {
        // 如果换不来新数据
        this.successText = '已是最新了'
      }
      // setTimeout(() => {
      //   // 要读取最新的数据 最新的数据要添加到数据的头部
      //   const arr = Array.from(
      //     Array(2),
      //     (value, index) => '追加' + (index + 1)
      //   )
      //   // 数组添加到头部
      //   this.articles.unshift(...arr)
      //   // 手动关闭加载的状态
      //   this.downLoading = false
      //   this.successText = `更新了${arr.length}条数据`
      // }, 1000)
    }
  }
}
</script>

<style lang="less" scpoed>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
