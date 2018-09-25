//app.js
// var qcloud = require('./vendor/wafer2-client-sdk/index')
// var config = require('./config')

App({

  onLoad: function (options) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    var scene = decodeURIComponent(options.scene)
    //
    var query = options.query.dentistId // 3736
    console.log(scene)
    console.log(options)
    

    //获取的数据赋值给gloabal，是个例子
    // var that = this;
    // wx.login({
    //   success: res => {
    //     wx.request({
    //       url: that.globalData.wx_url_1 + res.code + that.globalData.wx_url_2,
    //       success: res => {
    //         that.globalData.openid = res.data.openid;
    //       }
    //     })
    //   }
    // });





    // //获取关联普通二维码的码值，放到全局变量qrCode中
    // if (options.query && options.query.qrCode) {
    //   this.globalData.qrCode = options.query.qrCode;
    // } 
    // this.globalData.qrCode = "324324"
   wx.setStorage({
     key: 'options',
     data: options,
   })
   wx.getStorage({
     key: 'options',
     success: function(res) {
       console.log(res.data)
     },
   })
  },

    onLaunch: function () {
        // qcloud.setLoginUrl(config.service.loginUrl)
        
     
    },
    globalData: {
      baseUrl:"https://webapp.farmtruth.cn/test/index.php/small/",
      qrCode:'',
      // openid: 0,
    },
})