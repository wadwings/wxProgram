// miniprogram/pages/genre/index.js
const db = wx.cloud.database();
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editor: 0,
  },
  navi1(){
    setTimeout(() => {
      wx.navigateTo({
        url: '../innovation/index',
      })
    }, 500)
  },
  navi2(){
    setTimeout(() => {
      wx.navigateTo({
        url: '../willing/index',
      })
    }, 500)
  }  ,
  navi3(){
    setTimeout(() => {
      wx.navigateTo({
        url: '../technic/index',
      })
    }, 500)
  }  ,
  navi4(){
    setTimeout(() => {
      wx.navigateTo({
        url: '../art/index',
      })
    }, 500)
  }  ,
  navi5(){
    setTimeout(() => {
      wx.navigateTo({
        url: '../PE/index',
      })
    }, 500)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const col = db.collection('user').where({_id: app.globalData.openid})
    col.get().then(res =>{
      console.log()
      this.setData({
        editor: res.data[0].enable ? 1 : 0
      })
    }).catch(err =>{
      wx.showToast({
        icon: "none",
        title: '你还没有登录！'
      })
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