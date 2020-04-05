<template>
  <view>
    <!-- 筛选 -->
    <view class="filter">
      <text class="active">综合</text>
      <text>销量</text>
      <text>价格</text>
    </view>

    <!-- 商品列表 -->
    <scroll-view class="goods" scroll-y @scrolltolower="pageAgain">
      <view class="item" @click="goDetail(item.goods_id)" v-for="item in list" :key="item.goods_id">
        <!-- 商品图片 -->
        <image class="pic" :src="item.goods_small_logo"></image>
        <!-- 商品信息 -->
        <view class="meta">
          <view class="name">{{item.goods_name}}</view>
          <view class="price">
            <text>￥</text>{{item.goods_price}}<text>.00</text>
          </view>
        </view>
      </view>
    </scroll-view>

  </view>
</template>

<script>
  export default {
    data(){
      return {
        list:[], // 根据关键字，搜索到的数据的列表信息
        pagenum:1, // 默认显示第一页的数据
        query:'', // 查询的字段名称
        flag:'请求完成' // 页面触底时的判断依据
      }
    },

    methods: {
      goDetail (id) {
        // JS:跳转一个非tabBar的页面
        uni.navigateTo({
          url: '/pages/goods/index?id='+id
        })
      },

      // 执行函数，获取 搜索字段 的详细列表信息---------------------------------------------------
      // 加载的时候，执行请求
      async getList(query){
        const res = await this.request({
          url:"/api/public/v1/goods/search",
          data:{
            query, // 查询关键词
            pagenum:this.pagenum, // 当前是第几页
            pagesize:5 // 每页显示的数据条数
          }
        })

        // console.log(res)
        // this.list = res.goods

        // 优化，将新获得的数据与原先的数据做一个连接操作，而不是直接覆盖原先的数据
        this.list = this.list.concat(res.goods)
      },

      // 页面到达底部时，重新调用函数，发请求，获取下一页的数据信息
      async pageAgain(){
        // 页面触底时，先判断上一次的请求，是否已完成
        // 若没有完成，则不去发下一次的请求
        if(this.flag == "请求开始"){
          return 
        }

        // 请求数据前
        this.flag = "请求开始"

        // 获取到新的数据后，页码++
        this.pagenum++
        await this.getList(this.query)

        // 请求结束后
        this.flag = "请求完成"
      }

    },

    onLoad(opt){
      // console.log(opt) // {query: "大米"}
      this.query = opt.query

      // 调用函数，展示数据
      this.getList(this.query)
    }
  }
</script>

<style scoped lang="less">
  .filter {
    display: flex;
    height: 96rpx;
    line-height: 96rpx;
    border-bottom: 1rpx solid #ddd;

    /* #ifdef H5 */
    position: relative;
    z-index: 99;
    /* #endif */

    text {
      flex: 1;
      text-align: center;
      font-size: 30rpx;
      color: #333;

      &.active {
        color: #ea4451;
      }
    }
  }
  
  .goods {
    position: absolute;
    width: 100%;
    top: 97rpx;
    bottom: 0;
  }

  .item {
    display: flex;
    padding: 30rpx 20rpx 30rpx 0;
    margin-left: 20rpx;
    border-bottom: 1rpx solid #eee;

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
  }
</style>
