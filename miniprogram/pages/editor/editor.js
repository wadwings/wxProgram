const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    formats: {},
    readOnly: false,
    placeholder: '社团的推广内容，推广文的第一段将会作为预览片段，第一张图片将会作为预览图，在第一行仅写一个数字1会在首页中隐藏该文章',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS})
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
    db.collection('article').where({
      _openid: app.globalData.openid
    }).get().then(res=>{
      if(res.data.length){
        console.log(res.data[0].html)
        that.editorCtx.setContents({
          html:res.data[0].html,
          success: res =>{
            wx.showToast({
              title: '文档读取成功',
            })
          }
        })
      }
    })
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        let time = new Date()
        let pattern = /(?<=\.).+/
        wx.cloud.uploadFile({
          cloudPath: time.valueOf().toString() + '.' +pattern.exec(res.tempFilePaths[0])[0],
          filePath: res.tempFilePaths[0],
          success: res => {
            that.editorCtx.insertImage({
              src: res.fileID,
              data: {
                id: 'abcd',
                role: 'god'
              },
              width: '100%',
              success: function () {
                console.log('insert image success')
              }
            })
          },
          fail: console.error
        });
      }
    })
  },
  getContents(){
    this.editorCtx.getContents({      
      success: res=>{
        let title = /(?<=(<p>))[^<>]+(?=(<))/m;
        let image = /(?<=(<img.+src="))[^"]+(?=")/m;
        let pres = res;
        let openid = app.globalData.openid
        let collection = db.collection('article').where({
          _openid:app.globalData.openid
        });
        console.log(openid)
        collection.get().then(res =>{
          if(res.data.length){
            console.log(title)
            console.log(pres.html)
            collection.update({
              data:{
                enable: title.exec(pres.html)[0] == "1" ? 0 : 1,
                src: image.exec(pres.html)[0],
                html: pres.html
              }
            }).then(res =>{
              console.log(res)
              wx.showToast({
                title: '文档修改成功',
              })
            })
          }else{
            db.collection('article').add({
              data:{
                enable: title.exec(pres.html)[0] == "1" ? 0 : 1,
                src: image.exec(pres.html)[0],
                _id: app.globalData.openid,
                html: pres.html,
                genre: app.globalData.userInfo.genre,
                shetuan: app.globalData.userInfo.shetuan,
              }
            })
            .then(res =>{
              console.log(res)
              wx.showToast({
                title: '文档保存成功',
              })
            })
          }
        })
      }
    })
  }
})
