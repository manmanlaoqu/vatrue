// pages/home/home.js
var app = getApp();
var baseUrl = app.globalData.baseUrl;
var qrCode = app.globalData.qrCode;
var entranceId = "";
Page({

  /**
   * 页面的初始数据
   */
  // 图片点击预览
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src,  //当前显示图片的http链接
      urls: imgList,  //需要预览的图片的http链接列表
    })
  },
  data: {
    uniqid:"",
    farm_info:'',
    price:'',
    arr: "2:3:4:5",
    // 是否关注
    concerned:true,
  //  产品溯源
      product_info:'',
    // 存储实景图片
      imgSrc:[],
      //价格小数点前
      pricePre:'',
      //价格小数点后
      priceAft:'',
      // 进度百分比
      percent:'',
      code_result:'',
      qrCodeUrl:'',
      unityid:'',
      // 产品id
      productid:'',
      // 是否带购买链接
      is_buy:'',
      // 是否已认证
      cert:'',
      userphone:'',
      farmid:''
  },

  // 跳转到地图
  jumpMap:function(event){
      var lat = event.currentTarget.dataset.lat;
      var lon = event.currentTarget.dataset.lon;
      var address = event.currentTarget.dataset.address;
      wx.navigateTo({
        url: '../map/map?lat='+lat +'&lon='+lon+'&address='+address,
        success: function(res) {
          
        },
        fail: function(res) {},
        complete: function(res) {},
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    wx.showLoading({
      title: 'loading',
    })
    var _this = this;
    console.log(_this.qrCode)
    wx.getStorage({
      key: 'options',
      success: function(res) {
        console.log(res.data)
        _this.setData({
          qrCodeUrl:res.data
        })
      },
    })

    wx.getStorage({
      key: 'userphone',
      success: function (res) {
        _this.setData({
          userphone: res.data
        })
      },
    })
    wx.getStorage({
      key: 'entranceId',
      success: function(res) {
        entranceId = res.data
        console.log(entranceId)
        if (entranceId == ""){
          wx.hideLoading()
          wx.navigateTo({
            url: '../blank/blank',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
        console.log(entranceId)
        _this.request(entranceId);
      },
    })
        // 请求获取溯源信息 end
  },
  request: function (entranceId){
  var _this = this;
  // 请求获取溯源信息
  wx.request({
    // url: 'https://webapp.farmtruth.cn/test/index.php/small/trace/traceability_anticounterfeiting/',
    url: baseUrl + "trace/traceability_anticounterfeiting/",
    data: {
      // uniqid: _this.data.code_result
      uniqid: 'BQ0DCB7AC04B5A3248'
      // uniqid :'BQ00AKM4P7YFW4379H'
      // uniqid:'BQ0BA80E4EF5D0209A',
      // uniqid:"BQ0E73DA876F667C9A"
      // uniqid:entranceId
    },
    method: "post",
    success: function (res) {
      _this.setData({
        cert: res.data.msg[0].farm_info.cert,
        is_buy: res.data.msg[0].is_buy
      })
      if (res.statusCode === 200) {
        wx.hideLoading()
      }
      Object.assign({}, res.data.msg[0].unity_info)
      // if (res.data.msg[0] !)
      wx.setStorage({
        key: 'farm_info',
        data: res.data.msg[0],
      })
      wx.setStorage({
        key: 'uniqid',
        data: res.data.msg[0].uniqid,
      })
      wx.setStorage({
        key: 'unityid',
        data: res.data.msg[0].unityid
      })
      wx.setStorage({
        key: 'farmid',
        data: res.data.msg[0].farmid,
      })
      wx.getStorage({
        key: 'farm_info',
        success: function (res) {
          wx.setStorage({
            key: 'productid',
            data: res.data.productid,
          })
          wx.getStorage({
            key: 'productid',
            success: function (res) {
              _this.setData({
                productid: res.data
              })
            },
          })
          //查询是否关注
          wx.getStorage({
            key: 'userInfo',
            success: function (res) {
              wx.request({
                url: baseUrl + 'im/insert_attention_brand',
                data: {
                  userid: res.data.msg[0].id,
                  uid: res.data.msg[0].uid,
                  farmid: _this.data.farm_info.farmid,
                  flag: 0
                },
                method: 'post',
                success: function (res) {
                  console.log(res)
                  if (res.data.code == 1) {
                    _this.data.concerned = !_this.data.concerned
                    _this.setData({
                      concerned: _this.data.concerned
                    })
                  }
                }
              })
            },
          })


          // 将farm_info.number转化为百分比
          var percentH = res.data.number / 2;
          if (res.data.number > 100){
            percentH = res.data.number / 5;
          }
          var pricePart = res.data.product_info.price.split(".");
          _this.setData({
            farm_info: res.data,
            percent: percentH,
            pricePre: pricePart[0] + '.',
            priceAft: pricePart[1]

          })
          var imageSrc = [];
          // 判断数据中的图片是否大于0
          if (res.data.real_pic.length > 0) {
            for (let i = 0; i < res.data.real_pic.length; i++) {
              imageSrc[i] = res.data.real_pic[i].image;
              wx.setStorage({
                key: 'shi_pic',
                data: imageSrc,
              })
            }
            // 存储实景图片，放入数组中
            wx.getStorage({
              key: 'shi_pic',
              success: function (res) {
                _this.setData({
                  imgSrc: res.data
                })
              },
            })
          } else {
            wx.setStorage({
              key: 'shi_pic',
              data: ""
            })
          }

        },
      })

      // 请求产品溯源信息
      wx.request({
        url: baseUrl + 'trace/product_trends_list',
        data: {
          productid: res.data.msg[0].productid
        },
        method: "post",
        success: function (res) {
          console.log(res.data.msg)
          wx.setStorage({
            key: 'product_info',
            data: res.data.msg,
          })
          wx.getStorage({
            key: 'product_info',
            success: function (res) {
              _this.setData({
                product_info: res.data,
              })
            },
          })
        }
      })
      //请求产品溯源信息end
    }
  })
},

  jump_suyuan:function(){
    wx.navigateTo({
      url: 'product_source/product_source',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 关注不关注方法
  concern:function(){
    var _this = this;
    console.log(1)
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        wx.request({
          url: baseUrl + 'im/insert_attention_brand',
          data:{
            userid: res.data.msg[0].id,
            uid: res.data.msg[0].uid,
            farmid: _this.data.farm_info.farmid,
            flag:1
          },
          method:'post',
          success:function(res){
            console.log(res)
            if (res.data.code == 1) {
              _this.data.concerned = !_this.data.concerned
              _this.setData({
                concerned: _this.data.concerned
              })
            }
          }
        })
     
      },
    })
  },
  // 设置导航栏文字
  navTitle: function () {
    var _this = this;
    wx.getStorage({
      key: 'farm_info',
      success: function (res) {
         wx.setNavigationBarTitle({
          title: res.data.farm_info.name
        })
      },
    })
  },
  more:function(){
    var _this = this;
    // 获取数据
    wx.getStorage({
      key: 'farm_info',
      success: function(res) {
       
        wx.request({
          url: baseUrl + "trace/unity_origin_list",
          data: {
            unityid: res.data.unityid,
            num:6
          },
          method: "post",
          success: function (res) {
            console.log(res.data.msg)
            //将最后一个id缓存
            var lastId = "" ;
            for(var i = 0; i < res.data.msg.length;i++){
              lastId = res.data.msg[i].id
            }
            wx.setStorage({
              key: 'lastId',
              data: lastId,
            })

              // 存贮单品溯源列表的信息
              wx.setStorage({
                key: 'suList',
                data: res.data.msg,
              })
              
          }
        })
        // 存储唯一id
        wx.setStorage({
          key: 'unityid',
          data: res.data.unityid,
        })
        wx.getStorage({
          key: 'unityid',
          success: function(res) {
            console.log(res.data)
            unityid:res.data
              wx.navigateTo({
                url: '../single/single?unityid=' + res.data,
            })  
          },
        })
      },
    })
      // wx.navigateTo({
      //   url: '../single/single' ,
      // })      
  },
  code: function () {
    wx.navigateTo({
      url: '../code_history/code_history',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })   
  },
  //防伪校验
  check:function(){
    wx.navigateTo({
      // 将是否认证参数传入
      url: '../check/check?cert=' + this.data.farm_info.farm_info.cert,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 购买
  shop:function(){
    var _this = this;
    wx.navigateTo({
      url: '../shop/shop?productid=' + _this.data.productid + '&cert=' + _this.data.cert + '&is_buy=' + _this.data.is_buy,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 获取手机号
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    var that = this;
    wx.getStorage({
      key: 'sessionId',
      success: function (res) {
        console.log(res.data)
        // 通过setData将初始值改变，并且将其渲染到页面中
        that.setData({
          sessionId: res.data
        })
        console.log(that.data.sessionId)
        wx.request({
          url: 'https://webapp.farmtruth.cn/test/index.php/small/small/wx_login',
          data: {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            sessionId: that.data.sessionId
          },
          success:function(res){
            console.log(res.data)
            wx.setStorage({
              key: 'userphone',
              data: res.data.phoneNumber,
            })
           that.setData({
             userphone:res.data.phoneNumber
           })
            
          }
        })
      },
    })
    //判断如果绑定授权失败，跳转到绑定手机号登录页面
    if (e.detail.errMsg == "getPhoneNumber:fail user deny" || e.detail.errMsg == "getPhoneNumber:fail:cancel to confirm login") {
      wx.navigateTo({
        url: '../login/login',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
     wx.navigateTo({
       url: '../check/check?cert=' + this.data.farm_info.farm_info.cert,
     })
    }
  },
  jumpLive:function(){
   wx.navigateTo({
     url: '../live/live',
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
    this.navTitle();
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