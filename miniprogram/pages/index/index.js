// //index.js
// const app = getApp()

// Page({
//   data: {
//     avatarUrl: './user-unlogin.png',
//     userInfo: {},
//     logged: false,
//     takeSession: false,
//     requestResult: ''
//   },

//   onLoad: function() {
//     if (!wx.cloud) {
//       wx.redirectTo({
//         url: '../chooseLib/chooseLib',
//       })
//       return
//     }

//     // 获取用户信息
    



//   onGetOpenid: function() {
//     // 调用云函数
//     wx.cloud.callFunction({
//       name: 'login',
//       data: {},
//       success: res => {
//         console.log('[云函数] [login] user openid: ', res.result.openid)
//         app.globalData.openid = res.result.openid
//         wx.navigateTo({
//           url: '../userConsole/userConsole',
//         })
//       },
//       fail: err => {
//         console.error('[云函数] [login] 调用失败', err)
//         wx.navigateTo({
//           url: '../deployFunctions/deployFunctions',
//         })
//       }
//     })
//   },

//   // 上传图片
//   doUpload: function () {
//     // 选择图片
//     wx.chooseImage({
//       count: 1,
//       sizeType: ['compressed'],
//       sourceType: ['album', 'camera'],
//       success: function (res) {

//         wx.showLoading({
//           title: '上传中',
//         })

//         const filePath = res.tempFilePaths[0]
        
//         // 上传图片
//         const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
//         wx.cloud.uploadFile({
//           cloudPath,
//           filePath,
//           success: res => {
//             console.log('[上传文件] 成功：', res)

//             app.globalData.fileID = res.fileID
//             app.globalData.cloudPath = cloudPath
//             app.globalData.imagePath = filePath
            
//             wx.navigateTo({
//               url: '../storageConsole/storageConsole'
//             })
//           },
//           fail: e => {
//             console.error('[上传文件] 失败：', e)
//             wx.showToast({
//               icon: 'none',
//               title: '上传失败',
//             })
//           },
//           complete: () => {
//             wx.hideLoading()
//           }
//         })

//       },
//       fail: e => {
//         console.error(e)
//       }
//     })
//   },

// })
//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()
Page({
  data:{
    testhtml:['<p> Think Different </p> <p><img src="https://s1.ax1x.com/2020/09/13/wwinit.png" alt="" /><img src="https://s1.ax1x.com/2020/09/13/wwinit.png" alt="" /> </p>'],
    opacity:0,
    index:-1,
    vOpacity:1,
    data:[],
    avatarUrl:new String(),
    logged:false,
    userInfo:null,
    nickName:"点击登录"
  },
  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../error/error',
        })
      }
    })
  },
  onLoad: function init(){
    let that = this
    let title = /(?<=(<p>))[^<>]+(?=(<\/p>))/mg
    let image = /(?<=(<img[^(src)]+src="))[^"]+(?=")/mg
    db.collection('article').get().then(res =>{
      for (let i = 0; i < res.data.length; i++){
        console.log(res.data[i]);
        that.data.data.push({
          html:res.data[i].html,
          icons:image.exec(res.data[i].html)?image.exec(res.data[i].html)[0]:null,
          content:title.exec(res.data[i].html)?title.exec(res.data[i].html)[0]:null,
        })
      }
    })
    // console.log(1)
    // this.setData({
    //   icons1: image.exec(this.data.testhtml[0])[0],
    //   content1: title.exec(this.data.testhtml[0])[0]
    // })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
              success: res => {
              that.onGetOpenid()
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                nickName: res.userInfo.nickName
              })
            }
          })
        }
      }
    })
  },
  onGetUserInfo: function(e) {
    let that = this
    if (!this.data.logged && e.detail.userInfo) {
        that.onGetOpenid()
        this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        nickName: res.userInfo.nickName
      })
    }
  },
  details: function (e){
    this.setData({
      opacity:1,
      index:2,
      vOpacity:0,
      html:this.data.data[parseInt(e.target.id)].html
    });
  },
  tap: function (){
    this.setData({
      opacity:0,
      index:-1,
      vOpacity:1,
      html:""
    })
  },

})