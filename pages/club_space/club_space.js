// pages/club_space/club_space.js
let name1 = ''
let _id = ''
Component({

  /**
   * 页面的初始数据
   */
  data: {
    ifName:false,
    pwd1 : '',
    pwd2 : '',
    cluburl:''

  },
methods://本页面的方法
{
logout()
  {
    wx.redirectTo({
      url: '../home/home',
    })
  },
  distory()
  {
    name1 = wx.getStorageSync('zifu')
    const db = wx.cloud.database()
    db.collection('club_admin').where({
      ID:name1

    }).get().then(
      res=>{
        _id = res.data[0]._id
        wx.showModal({
          title: '提示',
          content: '您确定要将社团注销吗？',
          complete: (res) => {
            if (res.cancel) {
              
            }
        
            if (res.confirm) {
              db.collection('club_admin').doc(_id).update(
                {
                  data:
                  {
                    status:'1'
                  }
                }
              )
            }
          }
        })
        
      }
    )
  },
  pwdchange()
  {
    this.setData({
      ifName:true
    })
  },
  cancel()
  {
    this.setData({
      ifName:false,
      pwd1:'',
      pwd2:'',
    })
  },
  confirm()
  {
    if(this.data.pwd1=='')
    {
      wx.showModal({
        title: '提示',
        content: '密码不能为空！',
        showCancel:false,
        complete: (res) => {
          if (res.cancel) {
            
          }
      
          if (res.confirm) {
            
          }
        }
      })
    }
    else{
      if(this.data.pwd1!=this.data.pwd2)
      {
        wx.showModal({
          title: '提示',
          content: '两次输入的密码不一致！',
          showCancel:false,
          complete: (res) => {
            if (res.cancel) {
              
            }
        
            if (res.confirm) {
              
            }
          }
        })
      }
      else{
        const db = wx.cloud.database()
        name1 = wx.getStorageSync('zifu')
        db.collection('club_admin').where({
          ID:name1
        }).get()
        .then(
          res=>{
            _id = res.data[0]._id
            wx.showModal({
              title: '提示',
              content: '将此密码作为新密码？',
              complete: (res) => {
                if (res.cancel) {
                }
            
                if (res.confirm) {
                  db.collection('club_admin').doc(_id).update(
                    {
                      data:
                      {
                        password:this.data.pwd1
                      }
                    }
                  )
                  this.setData(
                    {
                      ifName:false,
                      pwd1:'',
                      pwd2:''
                    }
                  )
                }
              }
            })
          }
        )

      }
    }
  },
  imgchange()
  {
    var me = this;
    name1 = wx.getStorageSync('zifu');
    wx.chooseMedia ({
      count: 1, // 默认9
      mediaType:['image'],
      success: (res)=> {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          cluburl:res.tempFiles[0].tempFilePath
        })
        const tempFilePaths = res.tempFiles[0].tempFilePath
        //console.log('nnnn');
        wx.cloud.uploadFile({
          cloudPath: "club/"+name1+".jpg", //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          success:  (res)=> {
            //console.log('hahaha');
            //console.log(res.data)
            var data = JSON.parse(res.data);
            //console.log("12")
           // console.log(data);
            wx.hideLoading();
              if (data.status == 200) {
                wx.showToast({
                title: "用户上传成功~！",
                icon: 'none',
                duration: 3000
              })
              me.setData({
                  cluburl: data.data
               })
                  } else if (data.status == 500) {
                    wx.showToast({
                      title: data.msg,
                      icon: 'none',
                      duration: 3000
                    })
                  }
                }
              })
        
      }
    })
  }
  
},

  /**
   * 生命周期函数--监听页面加载
   */
  attached:function(options) {
    name1 = wx.getStorageSync('zifu')
    this.setData({
      cluburl:'cloud://club-manager-3ghmftue4e9f0d99.636c-club-manager-3ghmftue4e9f0d99-1302029001/club/'+name1+'.jpg'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

})