<template>
  <div class="container">
    <!-- 导航组件 vant组件-->
    <!-- 当页面地址是/user事 应该隐藏掉导航栏 -->
     <van-nav-bar @click-right="$router.push('/search')" fixed title="黑马头条" right-text="搜索" v-if="$route.path !== '/user'">
     </van-nav-bar>
     <!-- 二级级路由容器 -->
     <!-- 判断当前的地址 如果是/user 就给一个noTop  -->
     <div class="my-wrapper" :class="{noTop: $route.path === '/user'}">
       <router-view>
       </router-view>
     </div>
     <!-- 标签栏组件 -->
     <div>
        <van-tabbar route>
          <!-- 应该点击导航标签跳转路由 -->
           <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
           <van-tabbar-item icon="question-o" to="/question">问答</van-tabbar-item>
           <van-tabbar-item icon="tv-o" to="/video">视频</van-tabbar-item>
           <van-tabbar-item icon="contact" to="/user">我的</van-tabbar-item>
         </van-tabbar>
     </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang='less'>
.container{
  width: 100%;
  height: 100%;
  position: relative;
  // 二级路由的样式
  .my-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop{
      padding-top: 0;
    }
  }
}
</style>
