// pages/shop/shop.js
var count = 1;
var totalPrice = "";
var count_s = '';
var countSum = "";
var totals = '';
var app = getApp();
var baseUrl = app.globalData.baseUrl;
// var option = "370"
// 商品id
var productid = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //购买数量
    count_num:1,
    //商品单价
    price_single:'',
    //邮费
    // mail_price: 12,
    mail_price: 0,
    // 不加邮费的金额
    total_single:'',
    //加上邮费的总计
    total:'',
    farm_info:'',
    productinfo: '',
    options:'',
    addressInfo:'',
    addressDetail:'',
    // 有地址列表
    addressList:"",
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var _this = this;
     console.log(options)
      _this.setData({
        options:options
      })

      this.navTitle();
      wx.getStorage({
        key: 'farm_info',
        success: function(res) {
          console.log(res.data)
          // countSum = parseInt(res.data.product_info.price) + _this.data.mail_price
          countSum = parseFloat(res.data.product_info.price)
          countSum += _this.data.mail_price
          _this.setData({
            farm_info:res.data,
            price_single:res.data.product_info.price,
            total_single: res.data.product_info.price,
            total: countSum.toFixed(2)
          })
          //缓存商品价格
          wx.setStorage({
            key: 'goodPrice',
            data: res.data.product_info.price,
          })
        },
        
      })
      wx.getStorage({
        key: 'productid',
        success: function(res) {
          console.log(res.data)
          productid = res.data
        },
      })
      wx.getStorage({
        key: 'userInfo',
        success: function (res) {
         wx.request({
        url: baseUrl + 'im/order_info',
        data:{
          // productid: options.productid,
          productid: productid,
          spec_id:'',
          uid: res.data.msg[0].uid,
          userid: res.data.msg[0].id,
        },
        method:'post',
        success:function(res){
          console.log(res.data.msg.productinfo)
          _this.setData({
            productinfo: res.data.msg.productinfo
          })
        }
        
      })

        },
      })
    _this.request();
  },
  request: function () {
    var _this = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        wx.request({
          url: baseUrl + 'im/account_adderss_list',
          data: {
            userid: res.data.msg[0].id,
            uid: res.data.msg[0].uid,
          },
          method: "post",
          success: function (res) {
            console.log(res.data.msg)
            _this.setData({
              addressList: res.data.msg
            })
            for (var i = 0; i < res.data.msg.length;i++){
              // 列表点击后的地址
              if (_this.data.options.id == res.data.msg[i].id){
                var msg = res.data.msg[i];
                if (msg.region_id != 0){
                  var addressdetail = msg.province_name + " " + msg.city_name + " " + msg.region_name + ' ' + msg.address_info
                }else{
                   addressdetail = msg.province_name + " " + msg.city_name + " " + msg.address_info
                }
                _this.setData({
                  addressInfo: res.data.msg[i],
                  addressDetail:addressdetail
                })
                return;
              } 
              if (res.data.msg[i].is_default == 1) {
                // 默认地址
                var msg = res.data.msg[i];
                if (msg.region_id != 0) {
                  var addressdetail = msg.province_name + " " + msg.city_name + " " + msg.region_name + ' ' + msg.address_info

                } else {
                  addressdetail = msg.province_name + " " + msg.city_name + " " + msg.address_info
                }
                _this.setData({
                  addressInfo: res.data.msg[i],
                  addressDetail: addressdetail
                })
              }
            }
        
          }
        })
      },
    })

  },
  //添加地址
  addAddress:function(){
    if (this.data.addressList){
      wx.navigateTo({
        url: '../address_list/address_list',
      })
    }else{
      wx.navigateTo({
        url: '../address_list/address_list',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
   
  },
  // 下单
  order:function(){
    var _this = this;
    console.log(1111)
     wx.getStorage({
       key: 'userInfo',
       success: function(res) {
         console.log(res.data)
         console.log(res)
         wx.request({
           url: baseUrl + 'im/product_order',
           data: {
             productid: productid,
             id: res.data.msg[0].id,
             uid: res.data.msg[0].uid,
             buy_num: _this.data.count_num,
             remark: '我是大赢家'
           },
           method: 'post',
           success: function (res) {
              console.log(res.data)
              wx.navigateTo({
                url: '../xiadan/xiadan',
              })
           }
         })
       },
     })
      
  },
  

  // wx.setStorage({
  //   key: total_single,
  //   data: ,
  // }),
 // 设置导航栏文字
  navTitle: function () {
    var _this = this;
    wx.getStorage({
      key: 'farm_info',
      success: function (res) {
         wx.setNavigationBarTitle({
          title:res.data.farm_info.name
        })
      },
    })
  },
  //点击减号
  jian:function(){
    var _this = this;
    if(count == 1){
      // totals = _this.data.total_single
      // console.log(_this.data.total_single)
      // totals += _this.data.mail_price
      // console.log("ifde"+ totals)
      // _this.setData({
      //   total: totals
      // })
      return;
      
   }else{
      count--;     
      wx.setStorage({
        key: 'count',
        data: count,
      })
      wx.getStorage({
        key: 'count',
        success: function (res) {
          _this.setData({
            count_num: res.data
          })
        },
      })
      wx.getStorage({
        key: 'goodPrice',
        success: function (res) {
          totalPrice = parseFloat(res.data * count).toFixed(2)
          _this.setData({
            total_single: totalPrice
          })
          // 加上邮费的总价
          totals = parseFloat(_this.data.total_single)
          totals += _this.data.mail_price
          _this.setData({
            total: totals.toFixed(2)
          })
        },
      })
    }
  },

  //点击加号
  add:function(){
    var _this = this;
    count++;
   //缓存购买数量
    wx.setStorage({
      key: 'count',
      data: count,
    })
    wx.getStorage({
      key: 'count',
      success: function(res) {
        _this.setData({
          count_num:res.data
        })
      },
    })
    wx.getStorage({
      key: 'goodPrice',
      success: function (res) {
        totalPrice = parseFloat(res.data * count).toFixed(2)
        _this.setData({
          total_single: totalPrice
        })
        // 加上邮费的总价
        totals = parseFloat(_this.data.total_single)
        totals +=  _this.data.mail_price
        _this.setData({
          total: totals.toFixed(2)
        })
       },
       
    })
  
   
  },
  jumpHome:function(){
    wx.switchTab({
      url: '../home/home',
    })
  },
  jumpAddressList:function(){
    wx.navigateTo({
      url:  '../address_list/address_list',
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