<template>
 <div class="container">
    <!-- 导航 -->
    <van-nav-bar title="登录" left-arrow @click-left="$router.back()">
    </van-nav-bar>
    <!-- 登录页面 -->
    <van-cell-group>
      <!-- 登录手机号 -->
      <van-field label="手机号" placeholder="请输入手机号"  error-message="手机号格式错误">
      </van-field>
      <!-- 获取验证码 -->
      <van-field label="验证码" placeholder="请输入验证码"  error-message="验证码错误">
         <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <!-- 登录按钮 -->
  <div class="login_box">
    <van-button round type="info" block>登录</van-button>
  </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="less">
   .login_box {
     padding: 20px;
   }
</style>
