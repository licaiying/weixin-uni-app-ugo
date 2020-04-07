<template>
  <view>
    <button type="primary" open-type="getUserInfo" @getuserinfo="btnGetInfo">微信登录</button>
  </view>
</template>

<script>
export default {
  methods: {
    // 1.先用JS的方式，获取用户信息-------------------------------------
    async apiGetInfo() {
      // 调用API
      const [err, res] = await uni.getUserInfo();
      // console.log(res)

      // 若获取不到，直接结束
      if (!res) {
        return;
      }

      // 获取到用户数据，传入到某个方法内，用于做token的请求
      this.getToken(res); // res:是实参
    },

    // 2.用户主动点击的方式，获取用户信息----------------------------------
    btnGetInfo(e) {
      // console.log(e)  // 用户信息，保存在 e.detail 中

      // 获取到用户数据，传入到某个方法内，用于做token的请求
      this.getToken(e.detail); // e.detail:是实参
    },

    // 获取 Token 的方法--------------------------------------------------
    async getToken(data) {
      // 1.data 是 形参，是上诉方法中【apiGetInfo() , btnGetInfo() 】，获取到的用户信息
      // console.log(data)

      // 2. code数据，使用API获取
      const [err, codeObj] = await uni.login();
      // console.log(codeObj)

      // 3.请求
      const res = await this.request({
        url: "/api/public/v1/users/wxlogin",
        method: "POST",
        data: {
          code: codeObj.code,
          encryptedData: data.encryptedData,
          iv: data.iv,
          rawData: data.rawData,
          signature: data.signature
        }
      });

      // console.log(res) // null

      // 一开始获取res:  null 的原因
      // 1. 写小程序一开始用的是我自己私人的appID获取code；
      // 2. 公司的服务器上面公司appID获取code；
      // 3. 上面两个code 不一样；
      // 4. 不能返回，返回null

      // 公司：开发的时候，appID换成 公司的appID就可以；

      // 学习：上课我用的是黑马的appID，学生可以用黑马的appID？不能用；
      //       大家不是我们的开发人员，没有权限；

      // 4.获取到token 存储到本地
      uni.setStorageSync("token",res.message.token)

      // 5.返回到上一页
      uni.navigateBack()
    }
  },

  onLoad() {
    // 首次加载时，调用函数，获取用户信息
    this.apiGetInfo();
  }
};
</script>

<style lang="less" scoped>
button {
  width: 600rpx;
  margin: 200rpx auto 0;
}
</style>