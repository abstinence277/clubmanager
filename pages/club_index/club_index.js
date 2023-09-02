// pages/user_home/user_home.js
let app = getApp()
let name1 = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    currentTab: 0,
    //这里只做tab名和显示图标
    items: [
      {
        "text": "信息总览",
        "iconPath": "/images/mag_tabs/gonggao.png",
        "selectedIconPath": "/images/mag_tabs/gonggao-active.png"
      },
      {
        "text": "功能管理",
        "iconPath": "/images/mag_tabs/dating.png",
        "selectedIconPath": "/images/mag_tabs/dating-active.png"
      }
      ,
      {
        "text": "空间",
        "iconPath": "/images/mag_tabs/my.png",
        "selectedIconPath": "/images/mag_tabs/my-active.png"
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
    name1 = option.id
     wx.hideHomeButton()
  }


})