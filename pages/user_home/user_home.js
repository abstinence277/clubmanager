// pages/user_home/user_home.js
Component({
  /**
   * 页面的初始数据
   */
  data: {
    activitylist:[],
    clublist:[]
  },
  methods:{
    club_info(){
    wx.navigateTo({
      url: '../club_info/club_info', //在~这~里~哦~ TONYCHENG
    })
    },
    Sign_club(){
      wx.navigateTo({
        url: '../sign_up_club/sign_up_club', 
      })
    },
    Sign_activity(){
      wx.navigateTo({
        url: '../sign_up_activity/sign_up_activity', 
      })
    }
  },
  
    
  lifetimes:{
    attached:function(){
      wx.cloud.database().collection('announcement_temp')
        .get()
        .then(res=>{
            console.log('请求成功',res)
            this.setData({
              activitylist:res.data
            })
            console.log(this.data.activitylist,this.data.clublist)
        })
        .catch(err=>{
            console.log('请求失败',err)
        })

      wx.cloud.database().collection('club_admin')
        .get()
        .then(res=>{
            console.log('请求成功',res)
            this.setData({
              clublist:res.data
            })
            console.log(this.data.activitylist,this.data.clublist)
        })
        .catch(err=>{
            console.log('请求失败',err)
        })
    },
    
  }
})