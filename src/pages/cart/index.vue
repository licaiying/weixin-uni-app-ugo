<template>
  <view class="wrapper">

    <!-- 1.收货信息 -->
    <view class="shipment" v-if="addr">
      <view class="dt">收货人: </view>
      <view class="dd meta">
        <text class="name">{{addr.userName}}</text>
        <text class="phone">{{addr.telNumber}}</text>
      </view>
      <view class="dt">收货地址:</view>
      <view class="dd">{{addr.detailAddr}}</view>
    </view>

    <!-- 2.如果没有数据，先显示一个按钮，获取收货地址 -->
    <button type="primary" v-else @tap="getAddr">获取收货地址</button>


    <!-- 购物车 -->
    <view class="carts">
      <view class="item">
        <!-- 店铺名称 -->
        <view class="shopname">优购生活馆</view>

        <view class="goods" v-for="(item,index) in list" :key="item.goods_id">
          <!-- 商品图片 -->
          <image class="pic" :src="item.goods_small_logo"></image>
          <!-- 商品信息 -->
          <view class="meta">
            <view class="name">{{item.goods_name}}</view>
            <view class="price">
              <text>￥</text>{{item.goods_price}}<text>.00</text>
            </view>

            <!-- 加减 -->
            <view class="amount">
              <text class="reduce" @tap="change(-1,index)">-</text>
              <input type="number" :value="item.goods_numb" class="number">
              <text class="plus" @tap="change(1,index)">+</text>
            </view>
          </view>

          <!-- 选框 -->
          <view class="checkbox">
            <icon type="success" size="20" :color="item.goods_buy?'#ea4451':'#ccc'" @tap="change_buy(index)"></icon>
          </view>
        </view>

      </view>
    </view>


    <!-- 其它 -->
    <view class="extra">
      <label class="checkall">
        <!-- 小程序中，三元表达式的第一项不能写太复杂的数据，需要是一个变量 -->
        <!-- <icon type="success" :color="ckList.lenght==list.length?'#ea4451':'#ccc'" size="20"></icon> -->
        <icon type="success" :color="is?'#ea4451':'#ccc'" size="20" @tap="changeAll"></icon>
        全选
      </label>
      <view class="total">
        合计: <text>￥</text><label>{{sum}}</label><text>.00</text>
      </view>
      <view class="pay" @tap="goPay">结算({{ckList.length}})</view>
    </view>


  </view>
</template>

<script>
  export default {
    data(){
      return {
        list:null, // 页面初始化数据

        addr:null // 收货地址
      }
    },

    computed:{
      ckList(){
        // 通过计算属性，来判断全选的状态
        // 先将已经选中的商品，筛选提取出来,放到一个新数组里
        // ckList：表示选中的商品的列表信息
        // 1.声明一个空数组
        var arr = []

        // 2.循环遍历所有的商品
        this.list.forEach(item => {
          if (item.goods_buy) {
            arr.push(item)
          }
        })

        // 将选中的商品数组，返回出去
        return arr
      },

      // 修改三元表达式额第一项参数
      is(){
        return this.ckList.length == this.list.length
      },

      // 计算商品总价
      sum(){
        var numb = 0
        this.ckList.forEach(item => {
          numb += item.goods_numb * item.goods_price
        })
        return numb
      }
    },

    methods:{
      // 数量的变化，的执行函数------------------------------------------------
      change(step,index){
        // step:表示加减的数量  1 或者 -1
        // index:商品的下标

        // 1.前提是，需要判断，以防止数量为负数
        // 数量减减时
        if (step==-1&&this.list[index].goods_numb==1) {
          return
        }
        // 数量加加时,数量最多不能超过15
        if (step==1&&this.list[index].goods_numb==15) {
          return 
        }

        // 2.点击加减按钮时，让数量随着step的变化而变化
        this.list[index].goods_numb += step

        // 3.将改变后的数量，重新存储到本地里
        uni.setStorageSync("carts",this.list)
      },

      // 单选 功能--------------------------------------------------------
      change_buy(index){
        // 点击时，改变其选中状态，取反 
        // 1.根据goods_buy 进行取反判断
        this.list[index].goods_buy = !this.list[index].goods_buy

        // 2.状态改变后，重新存储到本地里
        uni.setStorageSync("carts",this.list)
      },

      // 全选 功能----------------------------------------------------------
      changeAll(){
        // 根据计算属性中 is 的值，进行判断
        // this.is-->全选   !this.is-->全不选
        // 点击之后， 把 !this.is 的值，赋值给 list 里面的每一个成员

        var key = !this.is

        this.list.forEach(item => {
          item.goods_buy = key
        })

        // 将改变后的值，重新存储到本地里
        uni.setStorageSync("carts",this.list)
      },

      // 获取收货地址的执行函数--------------------------------------------------
      getAddr(){
        // 调用API  wx.chooseAddress
        // 因为现在使用uni-app框架，在做项目，所以都需将 wx. 更改为 uni.
        uni.chooseAddress({
          success:(res) => {
            // console.log(res)
            this.addr = res

            // 对详细地址，做拼接
            this.addr.detailAddr = res.provinceName + res.cityName + res.countyName + res.detailInfo
          }
        })
      },

      // 结算功能-----------------------------------------------------------------
      goPay(){
        // 判断
        // 1. 是否有收获地址
        if (!this.addr) {
          uni.showToast({title:"没有收获地址",icon:"none"})
          return 
        }

        // 2. 是否有选中的商品
        if (!this.ckList.length) {
          uni.showToast({title:"还没有选择商品哦",icon:"none"})
          return 
        }

        // 3. 是否现在是登录状态,获取token
        if (!uni.getStorageSync("token")) {
          uni.showToast({title:"还没有登录呢，转跳到登录页面",icon:"none"})

          // 若没有登录，让用户跳转到登录页面
          // 登录页面是非tabBar页面
          uni.navigateTo({
            url:"/pages/auth/index"
          })
        }
 
      }

    },

    // 获取本地数据，只会执行一次,所以不适合在这里获取数据，应该在onShow 里获取
    // onLoad():只会在页面加载的时候执行一次
    // onLoad(){
    //   console.log(uni.getStorageSync("carts").length)
    // }

    onShow(){
      // 获取本地数据
      this.list = uni.getStorageSync("carts") || []
    }
    
  }
</script>

<style scoped lang="less">
  .shipment {
    height: 100rpx;
    line-height: 2;
    padding: 30rpx 30rpx 40rpx 30rpx;
    font-size: 27rpx;
    color: #333;
    background-color: #fff;
    background-image: url(http://static.botue.com/ugo/images/cart_border%402x.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;

    .dt {
      width: 140rpx;
      float: left;
      clear: both;
    }

    .dd {
      padding-left: 160rpx;
    }

    .meta {
      padding-right: 50rpx;
    }

    text.phone {
      float: right;
    }
  }

  .carts {
    background-color: #f4f4f4;
    padding-bottom: 110rpx;
    overflow: hidden;

    .shopname {
      padding: 30rpx;
      margin-top: 20rpx;
      font-size: 30rpx;
      color: #333;
      background-color: #fff;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
    }

    .goods {
      display: flex;
      padding: 30rpx 20rpx 30rpx 0;
      margin-left: 100rpx;
      border-bottom: 1rpx solid #eee;
      background-color: #fff;
  
      position: relative;

      .checkbox {
        width: 101rpx;
        height: 100%;
        background-color: #fff;

        display: flex;
        justify-content: center;
        align-items: center;

        position: absolute;
        left: -100rpx;
        top: 0;
      }

      &:last-child {
        border-bottom: none;
      }

      .pic {
        width: 200rpx;
        height: 200rpx;
        margin-right: 30rpx;
      }

      .meta {
        flex: 1;
        font-size: 27rpx;
        color: #333;
        position: relative;
      }

      .name {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .price {
        position: absolute;
        bottom: 0;

        color: #ea4451;
        font-size: 33rpx;

        text {
          font-size: 22rpx;
        }
      }

      .amount {
        position: absolute;
        bottom: 0;
        right: 20rpx;

        height: 48rpx;
        text-align: center;
        border: 1rpx solid #ddd;
        border-radius: 8rpx;

        display: flex;
        align-items: center;

        text {
          display: block;
          width: 60rpx;
          line-height: 48rpx;
          font-size: 36rpx;
          color: #ddd;
          text-align: center;
        }

        input {
          width: 60rpx;
          height: 48rpx;
          min-height: 48rpx;
          font-size: 27rpx;
          border-left: 1rpx solid #ddd;
          border-right: 1rpx solid #ddd;
        }
      }
    }
  }

  .extra {
    position: fixed;
    bottom: 0;
    /* #ifdef H5 */
    bottom: 50px;
    /* #endif */
    left: 0;
    z-index: 9;

    width: 750rpx;
    height: 96rpx;
    text-align: center;
    line-height: 96rpx;
    font-size: 36rpx;
    border-top: 1rpx solid #eee;
    background-color: #fff;
    color: #333;
    display: flex;

    .checkall {
      width: 140rpx;
      line-height: 1;
      margin-left: 25rpx;
      display: flex;
      align-items: center;

      icon {
        margin-right: 20rpx;
      }
    }

    .total {
      display: flex;
      justify-content: center;
      flex: 1;

      label, text {
        color: #ea4451;
        vertical-align: bottom;
        position: relative;
        bottom: -2rpx;
      }

      text {
        position: relative;
        bottom: -3rpx;
        font-size: 24rpx;

        &:first-child {
          margin-left: 10rpx;
        }
      }
    }

    .pay {
      width: 200rpx;
      background-color: #ea4451;
      color: #fff;
    }
  }
</style>

