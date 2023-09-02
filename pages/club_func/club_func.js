// pages/club_func/club_func.js
let status = ''
let path = ''
let name1 = ''
Component({

  /**
   * 页面的初始数据
   */
  data: {
    cluburl:'',
    items: [
      { name: 'announce', value: '发送公告',checked:false},
      { name: 'activity', value: '发送活动',checked:false},
    ],
    ifName:false,
    title:'',
    content:'',
  },
methods:
{
  memberinfo()
  {
    wx.navigateTo({
      url: '../club_member/club_member',
    })
  },
  announceinfo()
  {
    wx.navigateTo({
      url: '../club_announceinfo/club_announceinfo',
    })
  },
  activityinfo()
  {
wx.navigateTo({
  url: '../club_activityinfo/club_activityinfo',
})
  },
  inputimg()
  {
    if(status=='announce')
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
              path = 'cloud://club-manager-3ghmftue4e9f0d99.636c-club-manager-3ghmftue4e9f0d99-1302029001/announcementImg/'+name1+new Date().toTimeString().substring(0,8)+new Date().toISOString().substring(0, 10)+'.png'

              wx.cloud.uploadFile({
                cloudPath: "announcementImg/"+name1+new Date().toTimeString().substring(0,8)+new Date().toISOString().substring(0, 10)+".png", //仅为示例，非真实的接口地址
                filePath: tempFilePaths,
                success:  (res)=> {
        this.setData(
          {
            cluburl:cloudPath
          }
        )
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
    else{
      if(status=='')
      {
        wx.showModal({
          title: '提示',
          content: '请选择发布方式！',
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
                path = 'cloud://club-manager-3ghmftue4e9f0d99.636c-club-manager-3ghmftue4e9f0d99-1302029001/activityImg/'+name1+new Date().toTimeString().substring(0,8)+new Date().toISOString().substring(0, 10)+'.png'
                wx.cloud.uploadFile({
                  cloudPath: "activityImg/"+name1+new Date().toTimeString().substring(0,8)+new Date().toISOString().substring(0, 10)+".png", //仅为示例，非真实的接口地址
                  filePath: tempFilePaths,
                  success:  (res)=> {
                    //console.log('hahaha');
                    //console.log(res.data)\
        this.setData(
          {
            cluburl:cloudPath
          }
        )
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
    }
    
  },
  radioChange(e)//检测选中项目的变化
  {
    status = e.detail.value
  },
  check()
  {
    wx.navigateTo({
      url: '../club_check/club_check',
    })
  },
  announce_release()
  {
    this.setData({
      ifName:true,
    })
  },
  cancel()
  {
    this.setData({
      ifName:false
    })
  },
  confirm()
  {
    if(status=='')
    {
      wx.showModal({
        title: '提示',
        content: '未选择发送模式！',
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
      if(status=='announce')
      {
        if(this.data.content==''||this.data.title==''||path=='')
        {
          wx.showModal({
            title: '提示',
            content: '内容不完整！',
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
          var name1 = wx.getStorageSync('zifu')
          const db = wx.cloud.database()
          db.collection('announcement_temp').add(
            {
              data:
              {
                Imgpath:path,//存入云端图片的位置
                an_date:new Date().toISOString().substring(0, 10),
                an_id:name1+new Date().toTimeString().substring(0,8)+new Date().toISOString().substring(0, 10),
                an_title:this.data.title,
                club_ID:name1,
                content:this.data.content,
                status:0
              },
              success: (res)=>
              {
                wx.showModal({
                  title: '提示',
                  content: '已成功发布公告！',
                  showCancel:false,
                  complete: (res) => {
                    if (res.cancel) {
                      
                    }
                
                    if (res.confirm) {
                      this.setData({
                        title:'',
                        content:'',
                        ifName:false
                      })
                    }
                  }
                })
              }
            }
          )
        }
        //console.log('11')

      }
      else{
        if(this.data.content==''||this.data.title==''||path=='')
        {
          wx.showModal({
            title: '提示',
            content: '内容不完整！',
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
          var name1 = wx.getStorageSync('zifu')
          const db = wx.cloud.database()
          db.collection('activity_temp').add(
            {
              data:
              {
                Imgpath:path,//存入云端图片的位置
                an_date:new Date().toISOString().substring(0, 10),
                an_id:name1+new Date().toTimeString().substring(0,8)+new Date().toISOString().substring(0, 10),
                an_title:this.data.title,
                club_ID:name1,
                content:this.data.content,
                status:0
              },
              success: (res)=>
              {
                wx.showModal({
                  title: '提示',
                  content: '已成功发布活动！',
                  showCancel:false,
                  complete: (res) => {
                    if (res.cancel) {
                      
                    }
                
                    if (res.confirm) {
                      this.setData({
                        title:'',
                        content:'',
                        ifName:false
                      })
                    }
                  }
                })
              }
            }
          )
        }
         
      }
    }
  }
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  }
})