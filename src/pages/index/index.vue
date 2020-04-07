<template>
  <view :style="{height: pageHeight, overflow: 'hidden'}">
    <search @search="disableScroll" />

    <!-- wxml页面中，若想跳转到tabBar页面，必须使用一个属性：open-type="switchTab -->
     <!-- <navigator url="/pages/cart/index" open-type="switchTab">
         去购物车
     </navigator> -->

    <!-- 焦点图 -->
    <swiper class="banner" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
      <swiper-item v-for="item in swiperArr" :key="item.goods_id">
        <navigator :url="'/pages/goods/index?id='+item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>

    <!-- 导航条 -->
    <view class="navs">
      <navigator open-type="switchTab" url="/pages/category/index" v-for="item in navArr" :key="item.name">
        <image :src="item.image_src"></image>
      </navigator>
    </view>

    <!-- 楼层 -->
    <view class="floors">
      <view class="floor" v-for="(item,index) in floorsArr" :key="index">

        <!-- 楼层的 标题区域 -->
        <view class="title">
          <image :src="item.floor_title.image_src"></image>
        </view>

        <!-- 楼层的 图片区域 -->
        <view class="items">
          <navigator url="/pages/list/index" v-for="img in item.product_list" :key="img.name">
            <image :src="img.image_src"></image>
          </navigator>
        </view>
      </view>
    </view>

    <!-- 回到顶部 -->
    <!-- 这里不能用 v-show 有问题  小程序里使用v-if -->
    <view class="goTop icon-top" v-if="isShow" @click="goTop"></view>
  </view>
</template>

<script>
  import search from '@/components/search';

  export default {

    data () {
      return {
        pageHeight: 'auto',

        swiperArr:[], // 轮播图数据
        navArr:[], // 导航栏数据
        floorsArr:[], // 楼层数据

        isShow:false // 返回顶部按钮的初始状态,默认是false 不显示
      }
    },

    components: {
      search
    },
    
    methods: {
      disableScroll (ev) {
        this.pageHeight = ev.pageHeight + 'px';
      },

      // 获取 轮播图 数据------------------------------------------------------------
       async getSwiperData(){
        //  const [err,res] = await uni.request({
        //   url:"https://api-ugo-web.itheima.net/api/public/v1/home/swiperdata",
        //   method:'get',
        //   // data:{}
        //  })
        // //  console.log(res)
        // this.swiperArr = res.data.message

        // 调用封装好的request方法，因为在main.js中做了全局注册，所以可直接调用
        const res = await this.request({
          url:"/api/public/v1/home/swiperdata"
        })

        // console.log(res)
        this.swiperArr = res.message
       },

       // 获取 导航栏 数据------------------------------------------------------------------
       async getNavData(){
         const res = await this.request({
           url:"/api/public/v1/home/catitems"
         })

        //  console.log(res)
         this.navArr = res.message
       },

       // 获取 楼层 数据------------------------------------------------------------------
       async getFloorsData(){
         const res = await this.request({
           url:"/api/public/v1/home/floordata"
         })

         this.floorsArr = res.message
       },

       // 返回顶部的执行函数---------------------------------------------------------------
       goTop(){
         // 调用API--> pageScrollTo  并传入参数  让卷起的距离为0，即可 返回顶部
         uni.pageScrollTo({scrollTop:0})
       }

    },

    // 调用函数，渲染页面--------------------------------------------------
    onLoad(){
      this.getSwiperData()
      this.getNavData()
      this.getFloorsData()

      // 默认允许分享、转发
      // 一般不这样做，让用户自定义开启转发功能
      // uni.showShareMenu()
    },

    // 监听用户下拉动作的执行函数-------------------------------------------
    async onPullDownRefresh(){
      // 1.调用渲染页面的函数，当用户执行完 下拉刷新 动作时，重新渲染页面
      // 2.使用async  await语法，保证请求完毕后(下拉完成后)，结束下拉效果
      await this.getSwiperData()
      await this.getNavData()
      await this.getFloorsData()

      // 3.请求完毕后，调用 API 关闭 下拉效果 ---> stopPullDownRefresh()
      uni.stopPullDownRefresh()
    },

    // 页面滚动的时候,获取页面的滚动距离--------------------------------------------------------
    // onPageScroll()--->生命周期函数
    onPageScroll(e){
      // 1.通过事件对象获取滚动的距离
      // console.log(e.scrollTop) // scrollTop:随时获取页面的滚动距离，onPageScroll 提供的属性
      if (e.scrollTop>200) {
        this.isShow = true
      }else {
        this.isShow = false
      }
    },

    // 用户自定义的 开启转发 功能
    // 是一个生命周期函数
    onShareAppMessage(){
      return {
        title:"欢迎使用UGO！",
        imageUrl:"http://www.999zx.cn/adm_file/fck/images/2018/4/Image/20184386447866.jpg",
        path:"/pages/index/index"
      }
    }

  }
</script>

<style scoped lang="less">
  .banner {
    width: 100%;
    height: 340rpx;

    image {
      width: 100%;
      height: 340rpx;
    }
  }

  .navs {
    display: flex;
    justify-content: space-between;
    padding: 30rpx 44rpx;

    image {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor {

    .title {
      width: 750rpx;
      height: 60rpx;
      padding: 20rpx 0 0 8rpx;
      background-color: #f4f4f4;
    }

    .items {
      padding: 20rpx 16rpx;
      overflow: hidden;

      navigator {
        width: 193rpx;
        height: 188rpx;
        margin-left: 10rpx;
        margin-bottom: 10rpx;
        float: left;
      }

      navigator:first-child {
        width: 232rpx;
        height: 386rpx;
        margin-left: 0rpx;
      }

      navigator:nth-child(2),
      navigator:nth-child(5) {
        width: 273rpx;
      }
    }

    &:first-child {

      .items {

        navigator {
          width: 233rpx;
        }
      }
    }
  }

  .goTop {
    position: fixed;
    bottom: 30rpx;
    /* #ifdef H5 */
    bottom: 65px;
    /* #endif */
    right: 30rpx;
  
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100rpx;
    height: 100rpx;
    font-size: 48rpx;
    color: #666;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.8);
  }
</style>