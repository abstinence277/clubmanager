// pages/user_home/user_home.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    currentTab: 0,
    //这里只做tab名和显示图标
    items: [
      {
        "text": "大厅",
        "iconPath": "/images/stu_tabs/home.png",
        "selectedIconPath": "/images/stu_tabs/home-active.png"
      },
      {
        "text": "社团公告",
        "iconPath": "/images/stu_tabs/info.png",
        "selectedIconPath": "/images/stu_tabs/info-active.png"
      }
      ,
      {
        "text": "我的",
        "iconPath": "/images/stu_tabs/avatar.png",
        "selectedIconPath": "/images/stu_tabs/avatar-active.png"
      }
    ]

  },
  swichNav: function (e) {
    let that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  onLoad: function (option) {
    wx.hideHomeButton()
  }
})