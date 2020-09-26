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
    info: 1,
    form: 0,
    signup: {
      name: "",
      classes: "",
      uninumber: ""
    }
  },
  onGetOpenid: function () {
    let that = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        db.collection('user').where({
          _id: app.globalData.openid,
        }).get().then(res => {
          if (!(res.data.length)) {
            wx.getUserInfo({
              success: res => {
                console.log('添加成功')
                let time = new Date()
                db.collection('user').add({
                  data: {
                    _id: app.globalData.openid,
                    nickName: res.userInfo.nickName,
                    avatarUrl: res.userInfo.avatarUrl,
                    time: time.valueOf()
                  }
                })
              }
            })
          }
          db.collection('user').where({
            _id: app.globalData.openid,
          }).get().then(res=>{
            if(!(res.data[0].name)){
              that.setData({
                form: 1,
              })
            }else{
              app.globalData.userInfo = res.data[0]
              console.log(app.globalData.userInfo)
              wx.redirectTo({
                url: '../genre/index',
              })
            }
          })
        })
        that.setData({
          info: 0,
        })
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
    setTimeout(() => {
      if(this.data.form)
        wx.lin.initValidateForm(this);
    },3000)
    let that = this;
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
  submit(e){//收集用户姓名、学号、专业班级
    const {detail} = e;
    db.collection('user').where({
      _id : app.globalData.openid
    }).update({
      data:{
        name: detail.values.name,
        class: detail.values.classes,
        uninumber: detail.values.uninumber,
      }
    }).get().then(res =>{
      app.globalData.userInfo = res.data[0];
      console.log(app.globalData.userInfo);
    }).catch(e => {
      console.error(e);
    })
  },
  
})