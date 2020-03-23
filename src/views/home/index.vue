<template>
  <div class="container">
    <!-- 放置tabs组件  默认绑定激活页签-->
    <van-tabs v-model="activeIndex">
       <!-- 子标签 title为当前显示内容-->
       <van-tab :title="`${item.name}`" v-for="item in channels" :key="item.id">
       <!-- <div class="scroll-wrapper">
         <van-cell-group>
           <van-cell title="标题" value="内容" v-for="item in 20" :key="item"></van-cell>
         </van-cell-group>
       </div> -->
       <!-- 需要将频道id传递给每一个列表组件  -->
           <!-- 监听article-list触发的showAction事件 -->
       <ArticleList  @showAction="openAction"  :channel_id="item.id"></ArticleList>
       </van-tab>
    </van-tabs>
    <!-- 放置编辑频道图标 -->
    <span @click="showChannelEdit=true" class="bar_btn">
      <!-- 放入图标 -->
      <van-icon name="wap-nav" />
    </span>
    <van-popup v-model="showMoreAction" style="width:80%">
      <!-- 放置反馈组件 -->
          <!-- 应该在此位置监听 more-action触发的事件 -->
           <!-- 不喜欢文章 和 举报文章 用一个方法 -->
        <!-- @事件名="方法名"  @事件名="方法名()" @事件名="方法名($event 参数)" @事件名="逻辑" -->
        <!-- $event 是事件参数 在h5标签中 dom元素的事件参数  自定义事件中$event 就是自定义事件传出的第一个参数 -->
        <!-- <MoreAction @dislike="dislikeOrReport('dislike')" @report="dislikeOrReport($event,'report')" /> -->
        <MoreAction @dislike="dislikeOrReport('dislike')" @report="dislikeOrReport('report',$event)" />
    </van-popup>
    <!-- 频道编辑组件 放在 弹出面板的组件 -->
    <van-action-sheet :round="false"  v-model="showChannelEdit" title="编辑频道">
      <!-- 放置频道编辑组件 -->
       <!-- 此时将父组件的数据 传递给了 子组件 -->
        <ChannelEdit @addChannel="addChannel" @delChannel="delChannel" :activeIndex="activeIndex" @selectChannel="selectChannel" :channels="channels"  ></ChannelEdit>
      </van-action-sheet>
  </div>
</template>

<script>

import ArticleList from './components/article-list'
import MoreAction from './components/more-action'
import { getMyChannels, delChannel, addChannel } from '@/api/channels'
import { dislikeArticle, reportArticle } from '@/api/articles' // 不感兴趣
import eventbus from '@/utils/eventbus'// 公共事件处理器
import ChannelEdit from './components/channel-edit' // 引入编辑频道组件
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
    ArticleList, MoreAction, ChannelEdit
  },
  data () {
    return {
      channels: [], // 接收频道数据
      showMoreAction: false, // 是否显示弹层
      articleId: null, // 用来接收 点击的文章的id
      activeIndex: 0, // 当前默认激活的页面0
      showChannelEdit: false // 是否显示频道编辑组件  默认不显示
    }
  },
  methods: {
    async addChannel (channel) {
      // 调用api将频道写入缓存 成功之后 要将数据调价到data数据
      await addChannel(channel)// 传入参数 写入缓存
      this.channels.push(channel)// 将添加的channel添加到 data中的channels中
    },
    async delChannel (id) {
      try {
        await delChannel(id)// 调用api方法
        // 如果此时成功resolve 应该调用data中的数据
        const index = this.channels.findIndex(item => item.id === id)// 找到对应的索引
        // 找到对应的索引之后
        // 要根据当前删除的索引 和 当前激活的索引的 关系 来 决定 当前激活索引是否需要改变
        if (index <= this.activeIndex) {
          //  如果你删除的索引 是在当前激活索引之前的 或者等于当前激活索引的
          // 此时就要把激活索引 给往前挪一位
          this.activeIndex = this.activeIndex - 1
        }
        this.channels.splice(index, 1)// 删除对应索引
      } catch (error) {
        this.$gnotify({ message: '删除频道失败' })
      }
    },
    async getMyChannels () {
      const data = await getMyChannels()// 接收返回的数据结构
      this.channels = data.channels// 讲数据赋值给data中的数据
    },
    //  当子组件触发 selectChannel时 触发该方法
    // selectChannel (id) {
    // //   // 拿到id之后  应该找到id所对应的频道的索引
    //   const index = this.channels.findIndex(item => item.id === id) // 获取索引
    //   this.activeIndex = index // 将对应频道的索引 设置给当前激活的 标签
    //   this.showChannelEdit = false // 关闭弹层
    // },
    selectChannel (index) {
      this.activeIndex = index // 将对应频道的索引 设置给当前激活的 标签
      this.showChannelEdit = false // 关闭弹层
    },
    // 此方法 会在article-list组件触发 showAction的时候 触发
    openAction (artId) {
      this.showMoreAction = true
      // 应该把id存起来
      this.articleId = artId
    },
    // operateType 是操作类型 如果是dislike 就是不喜欢 如果是 report 就是 举报
    async dislikeOrReport  (operateType, type) {
      // 调用不给兴趣接口
      try {
        operateType === 'dislike' ? await dislikeArticle({
          target: this.articleId // 不感兴趣的id
        }) : await reportArticle({ target: this.articleId, type }) //  这里的type怎么办 ?????? 通过$event传出来
        // await下方的逻辑 是 resolve(成功)之后 的
        this.$gnotify({
          type: 'success',
          message: '操作成功'
        })
        // 应该 触发一个事件 利用事件广播的机制 通知对应的tab 来删除 文章数据
        // 除了 传一个文章之外 你还需要告诉 监听事件的人 现在处于哪个频道 可以传递频道id
        // this.channels[this.activeIndex].id
        eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
        // 监听了这个事件组件 就要根据id来删除数据
        this.showMoreAction = false// 此时关闭弹层
      } catch (error) {
        this.$gnotify({
          message: '操作失败'
        })
      }
    }
    // // 举报文章
    // async reportArticle (type) {
    //   try {
    //     await reportArticle({ target: this.articleId, type })
    //     this.$gnotify({
    //       type: 'success',
    //       message: '操作成功'
    //     })
    //     // await下方认为举报成功
    //     // 同样的也要讲举报的文章删除掉
    //     eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
    //     // 监听了这个事件组件 就要根据id来删除数据
    //     this.showMoreAction = false// 此时关闭弹层
    //   } catch (error) {
    //     this.$gnotify({
    //       message: '操作失败'
    //     })
    //   }
    // }
  },
  created () {
    // 获取频道数据
    this.getMyChannels()
  }
}
</script>
<style lang="less" scoped>
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
