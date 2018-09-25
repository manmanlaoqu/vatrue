// pages/home/product_source/product_source.js
var productImgList = [];
var images = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:'',
    productImg:[],
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getStorage({
      key: 'product_info',
      success: function (res) {
        console.log(res.data)
        
        // var images = [];  
        for(var i = 0; i < res.data.length;i++){
          
          for (var j = 0; j < res.data[i].originimg.length;j++ ){
            productImgList.push(res.data[i].originimg[j].url)
          }

          // for (var index in res.data[i].originimg){
          //   images[index] = res.data[i].originimg[index].url
          // }
        }
        console.log(images)
        console.log(productImgList)


        _this.setData({
          product: res.data
        })
      },
    })
  },
  // 图片点击预览
  imgYu: function (event) {
    console.log(event)
    var src = event.currentTarget.dataset.src;//获取data-src
    // var imgList = event.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src,  //当前显示图片的http链接
      urls: productImgList,  //需要预览的图片的http链接列表
    })
  },
})