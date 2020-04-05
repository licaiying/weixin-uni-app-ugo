<template>
<!-- v-if="data":如果有数据，就做展示，否则，就不做展示 -->
  <view class="wrapper" v-if="data">
    <!-- 商品图片 -->
    <swiper class="pics" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
      <swiper-item v-for="item in data.pics" :key="item.pics_id">
        <image :src="item.pics_big"></image>
      </swiper-item>
    </swiper>
    <!-- 基本信息 -->
    <view class="meta">
      <view class="price">￥{{data.goods_price}}</view>
      <view class="name">{{data.goods_name}}</view>
      <view class="shipment">快递: 免运费</view>
      <text class="collect icon-star">收藏</text>
    </view>
    <!-- 商品详情 -->
    <view class="detail">
      <!-- rich-text：小程序展示商品详情时，所特有的组件 -->
      <rich-text :nodes="data.goods_introduce"></rich-text>
    </view>
    <!-- 操作 -->
    <view class="action">
      <!-- open-type="contact":打开会话客服 -->
      <button open-type="contact" class="icon-handset">联系客服</button>
      <text class="cart icon-cart" @click="goCart">购物车</text>
      <text class="add" @tap="add">加入购物车</text>
      <text class="buy" @click="createOrder">立即购买</text>
    </view>
  </view>
</template>

<script>
  export default {
    data(){
      return {
        data:null,
        
        // 1.往购物车添加商品时 ，首先判断，购物车里是否有该商品，若有，就让数量加1，若没有，就按新商品添加
        // 根据本地存储的信息进行判断
        // 可能没有数据，直接设为空对象
        carts:uni.getStorageSync("carts") || []
      }
    },

    methods: {
      goCart () {
        // 转跳到tabBar页面
        uni.switchTab({
          url: '/pages/cart/index'
        })
      },

      createOrder () {
        uni.navigateTo({
          url: '/pages/order/index'
        })
      },

      // 根据商品的id，发请求，获取商品的详细信息，并在页面中做展示-----------------------------
      async getData(id){
        const res = await this.request({
          url:"/api/public/v1/goods/detail",
          data:{
            goods_id:id
          }
        })

        // console.log(res)
        this.data = res
      },

      // 向购物车添加商品的执行函数-----------------------------------
      add(){
        // 2.准备 添加的商品 的详细数据信息对象
        var one = {
          goods_id:this.data.goods_id, 
          goods_name:this.data.goods_name,
          goods_small_logo:this.data.goods_small_logo,
          goods_numb:1, // 商品的数量，默认为1
          goods_price:this.data.goods_price
        }

        // 3. 添加到购物车，注意，判断商品是否重复
        // 3.1 假设没有重复
        var key = "未重复"

        // 3.2 循环遍历，购物车里的商品，做重复验证
        for (var i=0;i<this.carts.length;i++) {
          // 如果重复了
          if (this.carts[i].goods_id == one.goods_id) {
            key = "已重复"
            // 就让这个商品的数量加1
            this.carts[i].goods_numb++
            break
          }
        }

        // 3.3 若 key = "未重复" ，则作为新的商品进行添加
        if (key == "未重复") {
          this.carts.push(one)
        }

        // 4.将页面中新添加的商品存储到本地
        uni.setStorageSync("carts",this.carts)

        // 5.提示信息
        uni.showToast({
          title:"商品添加成功",
          icon:"none"
        })

      }
    },

    onLoad(opts){
      // console.log(opts) // {id: "129"}

      // 调用函数，渲染页面
      this.getData(opts.id)
    }

  }
</script>

<style scoped lang="less">
  .wrapper {
    margin-bottom: 100rpx;
    background-color: #f4f4f4;
  }

  .pics {
    height: 640rpx;
  }
  
  .meta {
    height: 250rpx;
    line-height: 1;
    padding: 30rpx 180rpx 30rpx 20rpx;
    box-sizing: border-box;
    background-color: #fff;
    position: relative;

    .price {
      font-size: 36rpx;
      color: #ea4451;
      margin-bottom: 20rpx;
    }

    .name {
      color: #333;
      line-height: 1.4;
      font-size: 33rpx;

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .shipment {
      font-size: 27rpx;
      color: #999;
      position: absolute;
      bottom: 30rpx;
    }

    .collect {
      width: 140rpx;
      height: 88rpx;
      text-align: center;
      box-sizing: border-box;
      border-left: 1rpx solid #ddd;
      font-size: 24rpx;
      color: #999;

      position: absolute;
      right: 10rpx;
      top: 91rpx;
    }

    [class*="icon-"]::before {
      display: block;
      font-size: 45rpx;
      margin-bottom: 10rpx;
    }
  }

  .detail image {
    width: 100%;
    height: 480rpx;
    margin-top: 20rpx;
  }

  .action {
    width: 100%;
    height: 98rpx;
    background-color: #fff;

    position: fixed;
    left: 0;
    bottom: 0;

    display: flex;
    align-items: center;

    text {
      display: block;
    }

    .add, .buy {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 210rpx;
      text-align: center;
      font-size: 27rpx;
      color: #fff;
    }

    .add {
      background-color: #f4b73f;
    }

    .buy {
      background-color: #ea4451;
    }

    button {
      padding: 0;
      border-radius: 0;
      background-color: #fff;

      &::after {
        border: none;
      }
    }

    button, .cart {
      flex: 1;
      text-align: center;
      color: #989898;
      font-size: 24rpx;
      box-sizing: border-box;
    }

    [class*="icon"]::before {
      display: block;
      font-size: 45rpx;
      margin-bottom: 2rpx;
    }
  }
</style>
