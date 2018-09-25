// pages/brand/productListDetail/productListDetail.js
var app = getApp();
var baseUrl = app.globalData.baseUrl;
var imgSrc=[];
// 存储单品追溯的数据
var originpart = [];
var originpartT = [];
var imgLarge = [];
var productImgList = [];
// 点击规格次数
var count = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
      //下标
      id:0,
      proInfo:{},
      //关注信状态码
      code:'',
      productid:'',
      imgList:[],
      originPart:[],
      originPartT:[],
      appear:false,
      //产品溯源中的img
      productImg:[],
      isNot:true,
      countNum:''
  },
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
  imgLarge:function(event){
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current:src,
      urls: imgLarge,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    // 有用
    _this.setData({
      productid:options.id
    })
    wx.showLoading({
      title: '加载中',
    })
    _this.navTitle();
      console.log(options)
      var _this = this;
      // _this.setData({
      //   index:options.index
      // })
      wx.request({
        url: baseUrl + 'im/product_detail',
        data:{
          productid:options.id,
          // productid: "2028"
          // productid:'1796'
        },
        method:'post',
        success:function(res){
          wx.hideLoading()
          console.log(res.data.msg[0])


          for (var i = 0; i < res.data.msg[0].origin.length;i++ ){
            for (var j = 0; j < res.data.msg[0].origin[i].originimg.length;j++){
              imgLarge[j] = imgLarge.push(res.data.msg[0].origin[i].originimg[j].url)
            }
          }
          // console.log(imgLarge)



          //对图片处理
          // 判断数据中的图片是否大于0
          if (res.data.msg[0].pic.length > 0) {
            for (let i = 0; i < res.data.msg[0].pic.length; i++) {
              imgSrc[i] = res.data.msg[0].pic[i].image;
              wx.setStorage({
                key: 'imgList',
                data: imgSrc,
              })
            }
            // 存储实景图片，放入数组中
            wx.getStorage({
              key: 'imgList',
              success: function (res) {
                _this.setData({
                  imgSrc: res.data
                })
              },
            })
          } else {
            wx.setStorage({
              key: 'imgList',
              data: ""
            })
          }
          //存储origin图片
            // for(var i = 0; i < res.data.msg[0].orignin.length;i++){
            //   // for (var j = 0; j < res.data.msg[0].orignin[i].length;j++){
            //   //   imgLarge[j] = res.data.msg[0].orignin[i].originimg[j].url
            //   // }
            // }


          //将产品溯源分为多个部分
          for(let i = 0; i < res.data.msg[0].origin.length;i++){
            if(i < 6){
              originpart[i] = res.data.msg[0].origin[i]
            } else if (i > 6 || i < 18 ){
              originpartT[i-6] = res.data.msg[0].origin[i]
              if(i == 18) break;
            }
          }
          
          _this.setData({
            originPart: originpart,
            originPartT: originpartT
          })
          // console.log(originpartT)


          // //将图片放入一个数组
          //   for(var i = 0; i < )



          // wx.setStorage({
          //   key: 'productDetailInfo',
          //   data: res.data.msg[0],
          // })
          // wx.getStorage({
          //   key: 'productDetailInfo',
          //   success: function(res) {
              
          //   },
          // })
          if (res.data.msg[0].specData[0].image == ''){
            res.data.msg[0].specData[0].image = "http://test4.farmtruth.cn/images/no-img.jpg"
          }

          for (var i in res.data.msg[0].specData){
            console.log(res.data.msg[0].specData[i].price.split('.'))
            if (res.data.msg[0].specData[i].price == 0){
              res.data.msg[0].specData[i].price = "暂无价格"
            }
            res.data.msg[0].specData[i].price = res.data.msg[0].specData[i].price.split('.')
            // for (var j in res.data.msg[0][i].specData){
            //   console.log(res.data.msg[0][i].specData[j])
            // }
          }
          _this.setData({
            proInfo: res.data.msg[0]
          })
          
        }
      })
     
     _this.likeState(0);
  },
  more:function(){
      var _this = this;
      _this.setData({
        appear:true
      })
  },
//获取点心状态
likeState:function(flag){
  var _this = this;
  wx.getStorage({
    key: 'userInfo',
    success: function (res) {
      console.log(res.data.msg[0].id)
      //关注状态
      wx.request({
        url: baseUrl + 'im/insert_attention_product',
        data: {
          productid: _this.data.productid,
          // productid: "2028",
          // 用户id
          // userid：res.data.msg[0].id
          userid: res.data.msg[0].id,
          uid: res.data.msg[0].uid,
          flag: flag
        },
        method: 'post',
        success: function (res) {
          if (res.data.code == 1){
            _this.setData({
              isNot:false
            })
          }
          // _this.setData({
          //   code: res.data.code
          // })
        }
      })
    },
  })
},

  guige:function(e){
    //如果点击的是当前元素设置背景颜色
    count = e.currentTarget.dataset.index
    var _this = this;
    _this.setData({
      id:e.currentTarget.dataset.index,
      countNum:count
    })
    
    
  },
  collect:function(){
      var _this = this;
      _this.likeState(1)
      wx.getStorage({
        key: 'userInfo',
        success: function (res) {
          console.log(res.data.msg[0].id)
          //关注状态
          wx.request({
            url: baseUrl + 'im/insert_attention_product',
            data: {
              productid:options.id,
              // productid: "2028",
              // 用户id
              // userid：res.data.msg[0].id
              userid: res.data.msg[0].id,
              uid: res.data.msg[0].uid,
              flag: '1'
            },
            method: 'post',
            success: function (res) {
              console.log(res.data.code)
              // _this.setData({
              //   code: res.data.code
              // })
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