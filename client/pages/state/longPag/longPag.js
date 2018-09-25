// pages/state/longPag/longPag.js
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
var baseUrl = app.globalData.baseUrl;
// 文章里的产品
var productinfo = {}
var price = [];
var article=[];
// 分段富文本
var richText = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
   longPageData:"",
   longContent:'',
   // 点赞显示
   zan:true,
   userid:'',
   uid:'',
   trendsid:'',
  //  文章商品内容
   productInfo:"",
  //  收藏显示
    isNot:true
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  


  
  onLoad: function (options) {
  
    // article_content: WxParse.wxParse('article_content', 'html', res.data.article_content, that, 5)
    var _this = this;
    _this.navTitle()
    console.log(options.id);
    wx.setStorage({
      key: 'trendsid',
      data: options.id,
    })
    wx.getStorage({
      key: 'trendsid',
      success: function(res) {
        console.log(res.data)
        _this.setData({
          trendsid:res.data
        })
      },
    })
   wx.getStorage({
     key: 'userInfo',
     success: function(res) {
       console.log(res.data.msg[0]),
      _this.setData({
         uid:res.data.msg[0].uid,
         userid: res.data.msg[0].id
      })
       
      //  判断是否点赞
      


       // 判断是否收藏
       wx.request({
         url: baseUrl + 'im/account_favorite',
         data: {
          //  trendsid:'2419',
          //  trendsid: options.id,
           uid: res.data.msg[0].uid,
           id: res.data.msg[0].id,
           flag:0,
           type: 1,
         },
         method:'post',
         success:function(res){
           console.log(res.data.code)
           if(res.data.code == 1){
             _this.setData({
               isNot:false
             })
           }
         }
       })


       // 获取长文章内容
       wx.request({
         url: baseUrl + 'im/select_long',
         data: {
           trendsid: options.id,
          //  trendsid:'2000',
           userid: res.data.msg[0].id
           //  trendsid: "2857"
           //  trendsid:'2801'
           //  trendsid: 2419
           //  trendsid: 2337
         },
         method: "post",
         success: function (res) {
           console.log(res.data)
           if (res.data.msg[0].zambia_type == '1') {
             console.log("群殴我是")
             _this.setData({
               zan: false
             })
           }
           if (res.data.msg[0].favorite_type == '1'){
            _this.setData({
              isNot:false
            })
           }
           // 多个内容列表
          //  如果有内容
           if (res.data.msg[0].article.content.length > 0){
           for (var i = 0; i < res.data.msg[0].article.content.length; i++) {
             res.data.msg[0].article.content[i].text = res.data.msg[0].article.content[i].text.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ') //防止富文本图片过大 

             //  修改商品价格为0为暂无价格
             if (res.data.msg[0].article.content[i].product_info) {
               if (res.data.msg[0].article.content[i].product_info[0].price == 0) {
                 res.data.msg[0].article.content[i].product_info[0].price = "暂无价格"
               }else{
                 res.data.msg[0].article.content[i].product_info[0].price = '￥' + res.data.msg[0].article.content[i].product_info[0].price 
               }
             }
            
            //  console.log(res.data.msg[0].article.title.length)
             //  如果存在商品
             if (res.data.msg[0].article.content[i]) {
               productinfo[i] = res.data.msg[0].article.content[i]
             }
           }
         }  
           console.log(productinfo)

           _this.setData({
             productInfo: productinfo
           })


           //如果是一整段富文本
           if (res.data.msg[0].article.content[0]){
           res.data.msg[0].article.content[0].text = res.data.msg[0].article.content[0].text.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ') //防止富文本图片过大 
           var article = res.data.msg[0].article.content[0].text
           //  console.log(article)
           WxParse.wxParse("article", 'html', article, _this, 15);
        }

           // 如果是分段富文本
           var articles = [];
           for (var i = 0; i < res.data.msg[0].article.content.length; i++) {
             //  console.log(res.data.msg[0].article.content[i].text)
             if (res.data.msg[0].article.content[i].text || res.data.msg[0].article.content[i].text.img) {
               res.data.msg[0].article.content[i].text || res.data.msg[0].article.content[i].text.img[0].img
               articles.push(res.data.msg[0].article.content[i].text)
             }
           }
           console.log(articles)
           for (var i in articles) {
             if (typeof (articles[i]) == "undefined") {
             }
             if (typeof (articles[i]) == "number") {
               articles.splice(i, 1)
             }


           }
           console.log(articles)
           var replyArr = articles;
           for (let i = 0; i < replyArr.length; i++) {
             WxParse.wxParse('reply' + i, 'html', replyArr[i], _this);
             if (i === replyArr.length - 1) {
               WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, _this)
             }
           }


           for (var i = 0; i < articles.length; i++) {

           }
           //  articles = articles[0]
           //  WxParse.wxParse("articles", 'html', articles, _this);
           //  wx.getStorage({
           //    key: 'zan',
           //    success: function(res) {
           //      if(res.data == "成功"){
           //        _this.setData({
           //          zan:false
           //        })
           //      }
           //    },
           //  })

           // _this.zan();

           //  如果标题太长裁剪
           if (res.data.msg[0].article.title.length > 100) {
             // res.data.msg[0].article.title.;
             console.log(res.data.msg[0].article.title.substr(0,100)+'...')
             res.data.msg[0].article.title = res.data.msg[0].article.title.substr(0, 34) + '...'
           }
           _this.setData({
             longPageData: res.data.msg[0],
             // longContent: res.data.msg[0].article.content[0].text
           })
         }
       })
     },
   })
 
 
  
  },
  product_detail:function(e){
     wx.navigateTo({
       
       url: '../../brand/productListDetail/productListDetail?id=' + e.currentTarget.dataset.id,
       success: function(res) {},
       fail: function(res) {},
       complete: function(res) {},
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

  jumpProduct:function(){
    wx.switchTab({
      url: '../../brand/brand',
    })
  },
  zan:function(e){
    var _this = this;
    wx.request({
      url: baseUrl + 'im/zan_zambia',
      data:{
        trendsid: _this.data.trendsid,
        userid:_this.data.userid,
        uid:_this.data.uid,
        // trendsid: "2419",
        // userid: "10082",
        // uid: "9aa32f382d4857f4a3c4212647766fb8"
      },
      method:'post',
      success:function(res){
        console.log(res.data.msg)
        if (res.data.msg == "成功" )
         _this.setData({
           zan:false
         })
      }
    })
   
  },
  //收藏
  collection() {
    var _this = this;
      wx.request({
        url: baseUrl + 'im/account_favorite',
        data:{
          // table_id: 2419,
          table_id: _this.data.trendsid,
          userid: _this.data.userid,
          uid: _this.data.uid,
          flag:1,
          type:1,
        },
        method:'post',
        // data:{table_id: "2857", userid: "10082", uid: "9aa32f382d4857f4a3c4212647766fb8", type: "1", flag: 1 },
        success:function(res){
          console.log(res.data)
          if(res.data.msg == "成功"){
            _this.setData({
              isNot:false
            })
          }
        }
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