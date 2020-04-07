<template>
  <view>
    <!-- 搜索 -->
    <search />
    <!-- 分类 -->
    <view class="category">

      <!-- 一级分类 -->
      <view class="sup">
        <scroll-view scroll-y>
          <text 
          v-for="(item,index) in list" 
          :key="item.cat_id"
          :class="{'active':(index==ac_index?true:false)}"
          @tap="change(index)">{{item.cat_name}}</text>
        </scroll-view>
      </view>


      <!-- 二级分类 -->
      <view class="sub">
        <scroll-view scroll-y>
          <!-- 封面图 -->
          <image src="http://static.botue.com/ugo/uploads/category.png" class="thumb"></image>
          <view class="children" v-for="item in list[ac_index].children" :key="item.cat_id">
            <view class="title">{{item.cat_name}}</view>


            <!-- 三级分类  品牌 -->
            <view class="brands">
              <navigator url="/pages/list/index" v-for="one in item.children" :key="one.cat_id">
                <image :src="one.cat_icon"></image>
                <text>{{one.cat_name}}</text>
              </navigator>
            </view>

          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
  import search from '@/components/search';

  export default {
    data(){
      return {
        list:[], // 页面的初始化数据

        ac_index:0 // 数据列表 展示的初始化下标
      }
    },
    
    components: {
      search
    },

    methods: {
      // 获取分类页面的商品数据-------------------------------------------------------------
      async getList(){
        // this 是Vue的一个实例化对象
        const res = await this.request({
          url:"/api/public/v1/categories"
        })

        // console.log(res)
        this.list = res.message
      },

      // 当点击 一级分类 的时候，获取对应的索引值------------------------------------
      // 将遍历时的 下标值 作为函数的参数传入，就可知道点击的是 具体的哪个数据
      change(index){
        // console.log(index)

        // 将传入的索引值，赋值给默认的 初始化页面做展示时的 下标数据  做点击后的新数据展示
        this.ac_index = index
      }
    },

    // onLoad() 生命周期函数中 加载渲染 页面的首屏数据信息
    onLoad(){
      this.getList()
    }
  }
</script>

<style scoped lang="less">
  scroll-view {
    height: 100%;
  }

  .category {
    display: flex;
    width: 100%;
    position: absolute;
    top: 100rpx;
    bottom: 0;

    .sup {
      width: 196rpx;
      background-color: #f4f4f4;

      text {
        display: block;
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        font-size: 27rpx;
        color: #333;
        border-bottom: 1rpx solid #eee;

        &:last-child {
          border-bottom: none;
        }
        
        &.active {
          background-color: #FFF;
          color: #ea4451;
          position: relative;

          &::before {
            content: '';
            display: block;
            width: 8rpx;
            height: 60rpx;
            transform: translateY(-50%);
            background-color: #ea4451;

            position: absolute;
            left: 0;
            top: 50%;
          }
        }
      }
    }

    .sub {
      flex: 1;
      padding: 20rpx 18rpx;

      .thumb {
        width: 100%;
        height: 180rpx;
      }

      .children {
        text-align: center;
        color: #333;

        .title {
          display: inline-block;
          margin: 40rpx 0 20rpx;
          font-size: 30rpx;

          &::before {
            content: '/';
            margin-right: 20rpx;
            color: #666;
          }

          &::after {
            content: '/';
            margin-left: 20rpx;
            color: #666;
          }
        }
      }

      .brands {
        display: flex;
        flex-wrap: wrap;

        navigator {
          width: 33%;
          margin-bottom: 20rpx;
        }

        image {
          width: 120rpx;
          height: 120rpx;
        }

        text {
          display: block;
          font-size: 24rpx;
        }
      }
    }
  }
</style>
