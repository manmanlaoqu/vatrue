// pages/login/login.js
var app = getApp();
var baseUrl = app.globalData.baseUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:'',
    unionId:'',
    userInfo:'',
    sessionId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取扫码路由参数
    console.log(options.id)
    if (options.id == "") {
      console.log("a")
      wx.hideLoading()
      wx.navigateTo({
        url: '../blank/blank',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      //如果二维码参数为空
      wx.setStorage({
        key: 'entranceId',
        data: "",
      })
      return;
    
    }else{
      // 如果二维码参数不为空
      wx.setStorage({
        key: 'entranceId',
        data: options.id,
      })
    }
    
 wx.showLoading({
      icon:'none',
      title: '登录中',
    })
    //登录
    var _this = this;
    setTimeout(function () {
      _this.setData({
        show: true
      })
    }, 1000)
    _this.login();
    // 获取unionId
      wx.getStorage({
        key: 'unionId',
        success: function(res) {
          console.log(res.data)
          _this.setData({
            unionId:res.data
          })
          if (_this.data.unionId) {
            _this.setData({
              show:false
            })
            wx.switchTab({
              url: '../home/home',
            })
            
          } else {
           
          }
        },
      })   
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        console.log(res.data)
      },
    })
  },
  login: function () {
    var _this = this
    wx.login({
      success: function (res) {
        wx.hideLoading()
        wx.request({
          url: baseUrl + 'small/openid',
          // url: 'https://webapp.farmtruth.cn/test/index.php/small/small/openid', //接口地址
          data: { code: res.code },
          header: {
            'content-type': 'application/json' //默认值
          },
          success: function (res) {
            // 成功之后将3rd_session存储在缓存中
            console.log(res.data)
            // // 首次登录存入sessionId
            wx.setStorageSync("sessionId", res.data);
          wx.getStorage({
            key: 'sessionId',
            success: function(res) {
              console.log(res.data)
              _this.setData({
                sessionId:res.data
              })
            },
          })
            //  wx.setStorage({
            //    key: 'sessionId',
            //    data: res.data,
            //  })
           
          }
        })
      }
    })
  },
  // 获取用户信息事件
  bindGetUserInfo:function(e){
    var _this = this;
    wx.getStorage({
      key: 'sessionId',
      success: function(res) {
        // 判断授权是否允许
        if (e.detail.errMsg == "getUserInfo:ok") {
          //如果授权允许解析数据
          wx.request({
            url: baseUrl + 'small/wx_login',
            // url: 'https://webapp.farmtruth.cn/test/index.php/small/small/wx_login',
            data: {
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
              sessionId:res.data
            },
            success: function (res) {
              console.log(res.data)
              wx.setStorageSync('unionId', res.data.unionId)
              wx.setStorageSync('openId', res.data.openId);
              wx.setStorageSync('userInfo', res.data)
            
          // 将用户信息传入后台
            
            wx.request({
              url: baseUrl + 'small/wx_account_info',
              // url: "https://webapp.farmtruth.cn/test/index.php/small/small/wx_account_info",
              method:'post',
              data:{
                nickname: res.data.nickName,
                sex: res.data.sex,
                province: res.data.province,
                city: res.data.city,
                headimgurl: res.data.avatarUrl,
                sex: res.data.gender,
                sessionId: _this.data.sessionId,
              },
              success:function(res){
                console.log(res.data)
                wx.setStorage({
                  key: 'userInfo',
                  data: res.data,
                })
              }
           })
            }
          })
          wx.switchTab({
            url: '../home/home',
          })
          
          // wx.getStorage({
          //   key: 'userInfo',
          //   success: function (res) {
          //     console.log(res.data)
           
          //   },
          // })

        } else {
         return
        }
      },
    })
  },
 


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})