const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    testhtml: ['<p> Think Different </p> <p><img src="https://s1.ax1x.com/2020/09/13/wwinit.png" alt="" /><img src="https://s1.ax1x.com/2020/09/13/wwinit.png" alt="" /> </p>'],
    opacity: 0,
    index: -1,
    vOpacity: 1,
    data: [],
    avatarUrl: new String(),
    logged: false,
    userInfo: null,
    nickName: "点击登录",
    editor: 0,
  },
  onGetOpenid: function () {
    let that = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        let pres = res;
        db.collection('user').where({
          _id: pres.result.openid,
        }).get().then(res => {
          if (!(res.data.length)) {
            console.log('添加成功')
            db.collection('user').add({
              data: {
                _id: pres.result.openid
              }
            })
          }
        })
        db.collection('user').where({
          enable:1
        }).get().then(res=>{
          for(let i = 0; i < res.data.length; i++){
            console.log(res.data[i]._id)
            console.log(pres.result.openid)
            console.log(pres.result.openid == res.data[i]._id)
            if(pres.result.openid == res.data[i]._id){
              that.setData({
                editor: 1
              })
              break;
            }
          }
        })
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
  onLoad: function () {
    let that = this
    let title = /(?<=(<p>))[^<>]+(?=(<))/m
    let image = /(?<=(<img.+src="))[^"]+(?=")/m
    console.log(this.data.data)
    db.collection('article').get().then(res => {
      for (let i = 0; i < res.data.length; i++) {
        console.log(res.data[i]);
        let tmp = that.data.data
        tmp.push({
          html: res.data[i].html,
          icons: image.exec(res.data[i].html) ? image.exec(res.data[i].html)[0] : null,
          content: title.exec(res.data[i].html) ? title.exec(res.data[i].html)[0] : null,
        })
        console.log(tmp)
        that.setData({
          data: tmp,
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
  onGetUserInfo: function (e) {
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
  details: function (Event) {
    let that = this
    console.log(Event)
    console.log(this.data.data[parseInt(Event.currentTarget.id)].html)
    let tmp = this.data.data[parseInt(Event.currentTarget.id)].html
    this.setData({
      opacity: 1,
      index: 2,
      vOpacity: 0,
      html: tmp
    });
  },
  tap: function () {
    this.setData({
      opacity: 0,
      index: -1,
      vOpacity: 1,
      html: ""
    })
  },
  onPullDownRefresh: function() {
    let that = this
    let title = /(?<=(<p>))[^<>]+(?=(<))/m
    let image = /(?<=(<img.+src="))[^"]+(?=")/m
    console.log(this.data.data)
    db.collection('article').get().then(res => {
      for (let i = 0; i < res.data.length; i++) {
        console.log(res.data[i]);
        let tmp = that.data.data
        tmp.push({
          html: res.data[i].html,
          icons: image.exec(res.data[i].html) ? image.exec(res.data[i].html)[0] : null,
          content: title.exec(res.data[i].html) ? title.exec(res.data[i].html)[0] : null,
        })
        console.log(tmp)
        that.setData({
          data: tmp,
        })
      }
    })
  }
})