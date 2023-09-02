const app=getApp();

Component({
  /**
   * 页面的初始数据
   */
  data: {
    showIndex:null,
    height:'',
    //显示的个人信息
    name:"",
    sex:"",
    major:"",
    grade:"",
    faceUrl:""
  },
  methods:{
    //跳转到“我的注册”界面
    click1(){
      wx.navigateTo({
        url: '/pages/myregister/myregister',
      })
    },
    //跳转到“我的社团”界面
    click2(){
      wx.navigateTo({
        url: '/pages/myclub/myclub',
      })
    },
    //跳转到“我的收藏”界面
    click3(){
      wx.navigateTo({
        url: '/pages/myfavour/myfavour',
      })
    },
    //跳转到“历史记录”界面
    click4(){
      wx.navigateTo({
        url: '/pages/myhistory/myhistory',
      })
    },
    //打开弹窗
    openpopup(e){
      var index = e.currentTarget.dataset.index;
      this.setData({
        showIndex:index
      })
    },
    //关闭弹窗
    closepopup(){
      this.setData({
        showIndex:null
      })
    },
    //返回登陆界面
    back(){
      wx.reLaunch({
        url: '/pages/home/home',
      })
    },
  
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
      var that = this;
      // 动态获取屏幕高度
      wx.getSystemInfo({
        success: (result) => {
          that.setData({
            height: result.windowHeight
          });
        },
      })
    },
    /**
   * 头像上传
   */
  uploadFace(){
    var me = this;
    var userID = wx.getStorageSync('userID');
    wx.chooseMedia ({
      count: 1, // 默认9
      mediaType:['image'],
      success: (res)=> {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          faceUrl:res.tempFiles[0].tempFilePath
        })
        const tempFilePaths = res.tempFiles[0].tempFilePath
        console.log('nnnn');
        wx.cloud.uploadFile({
          cloudPath: "user/uploadFace/"+userID.name+".png", //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          success:  (res)=> {
            console.log('hahaha');
            console.log(res.data)
            var data = JSON.parse(res.data);
            console.log("12")
            console.log(data);
            wx.hideLoading();
              if (data.status == 200) {
                wx.showToast({
                title: "用户上传成功~！",
                icon: 'none',
                duration: 3000
              })
              me.setData({
                  faceUrl: data.data
               })
 
 
                  } else if (data.status == 500) {
                    wx.showToast({
                      title: data.msg,
                      icon: 'none',
                      duration: 3000
                    })
                  }
                }
              })
      }
    })
  }
  },
  lifetimes:{
    attached:function(){
      //设置个人信息
      this.setData({
        name:app.globalData.name,
        sex:app.globalData.sex,
        grade:app.globalData.grade,
        major:app.globalData.major
      })
      var userID = wx.getStorageSync('userID');
      wx.cloud.database().collection('user_info').where(
        {
          ID:userID.name
        }
      )
          .get()
          .then(res=>{
              console.log('请求成功',res)
              this.setData({
                  faceUrl:"cloud://club-manager-3ghmftue4e9f0d99.636c-club-manager-3ghmftue4e9f0d99-1302029001/user/uploadFace/"+userID.name+".png"
              })
          })
          .catch(err=>{
              console.log('请求失败',err)
          })
    },
    
  }
})
