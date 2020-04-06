// 导出一个封装好的 request请求 函数

export default function(Vue){
 
    // 1.配置请求的基地址
    const baseURL = "https://api-ugo-web.itheima.net"

    // 2.在Vue的原型上挂载 request 这个函数，这样以后在调用的时候，就可以直接在Vue的实例对象中，使用this.request
    // 3.opts:是以后在调用这个函数发请求的时候，传入的参数，里面有url data method等，直接解构出来，方便配置url
    
    Vue.prototype.request = async function(opts){
      const { url, data, method } = opts

      // 发请求前，设置 加载中 的动画效果
      // 调用 封装好的 API showLoading()
      uni.showLoading({
        title:"加载中",
      })

      // 发送请求
      // uni.app对Promise对象做了封装，后台返回的数据为一个数组
      // 数组的第一个参数：错误的信息    第二个参数：请求的具体的数据信息
      // 用解构的方法，直接接收后台返回的数据

      const [err,res] = await uni.request({
          url: baseURL + url,
          method,
          data
      })

      // 当获取到数据后，停止 加载 的动画效果
      uni.hideLoading()

      return res.data.message // 根据后台返回的参数信息可知
    }
}