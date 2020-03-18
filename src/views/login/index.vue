<template>
 <div class="container">
    <!-- 导航 -->
    <van-nav-bar title="登录" left-arrow @click-left="$router.back()">
    </van-nav-bar>
    <!-- 登录页面 -->
    <van-cell-group>
      <!-- 登录手机号 -->
      <van-field @blur="checkMobile" :error-message="errorMessage.mobile" v-model.trim="loginForm.mobile" label="手机号" placeholder="请输入手机号"  >
      </van-field>
      <!-- 获取验证码 -->
      <van-field @blur="checkCode" :error-message="errorMessage.code" v-model.trim="loginForm.code" label="验证码" placeholder="请输入验证码" >
         <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <!-- 登录按钮 -->
  <div class="login_box">
    <van-button @click="login" round type="info" block>登录</van-button>
  </div>
  </div>
</template>

<script>
// import * as user from '@/api/user'
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      // 表单数据
      loginForm: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      },
      // 此对象专门放置消息
      errorMessage: {
        mobile: '', // 手机的错误消息
        code: '' // 验证码的错误消息
      }
    }
  },
  methods: {
    ...mapMutations(['updateUser']), // 可以导入需要的方法  直接把updateUser方法映射到当前的methods方法中
    // 定义检查手机号方法
    checkMobile () {
    //  获取手机号 判断 是否为空  满足手机号的格式
      if (!this.loginForm.mobile) {
        // 表示为空
        this.errorMessage.mobile = '手机号不能为空'
        return false// 表示此轮校验位通过 如果通过返回true
      }
      // 手机号格式
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        // 如果手机号不满足
        this.errorMessage.mobile = '手机号格式不正确'
        return false
      }
      // 到了这里说明校验通过
      this.errorMessage.mobile = '' // 因为通过了 就没有消息了
      return true
    },
    // 检查验证码
    checkCode () {
      if (!this.loginForm.code) {
        this.errorMessage.code = '验证码不能为空'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errorMessage.code = '验证码必须为6位数字'
        return false
      }
      this.errorMessage.code = ''
      return true
    },
    // 登录校验
    async login () {
      const validateMobile = this.checkMobile()
      const validateCode = this.checkCode()
      // 校验手机号好验证码
      if (validateMobile && validateCode) {
        // 都通过了 表示前端校验通过 还要调用接口
        // 提示消息 表示登录成功
        // console.log('校验通过')
        try {
          const result = await login(this.loginForm)
          // 拿到token之后 应该把token设置长得state
          // 要更改state必须通过mutations
          this.updateUser({ user: result })
          // 跳转
          // 两种情况 1 redirectUrl (登录未遂 => 登录  => 遂) 2 没有 redirectUrl 跳到首页
          const { redirectUrl } = this.$route.query// query查询参数 就饿 ？ 后面的参数
          // redirectUrl有值的话 跳到该地址 没有的话跳到主页
          this.$router.push(redirectUrl || '/') // 短路表达式
        } catch (error) {
          // 提示消息 提示用户 告诉用户登录失败
          this.$gnotify({ message: '用户名或者验证码错误' })
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
   .login_box {
     padding: 20px;
   }
</style>
