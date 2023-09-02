// pages/club_announceinfo/club_announceinfo.js
let arr = [];
let name1 = '';
let status = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select_all:false,
    list:[],
    choseNames: '',
  },
  confirm()
  {
    this.setData(
      {
        list:[]
      }
    )
    this.onLoad()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  selectall: function (e) {

    for (let i = 0; i < this.data.list.length; i++) {

      this.data.list[i].checked = (!this.data.select_all)

      if (this.data.list[i].checked == true) {
        // 全选获取选中的值
        arr = arr.concat(this.data.list[i].number.split(','));
      }
    }
    this.setData({
      list: this.data.list,
      select_all: (!this.data.select_all),
      choseNames: arr
    })
  },
  checkboxChange: function (e) {
    console.log(e.detail.value)
    arr = arr.concat(e.detail.value)
    this.setData({
      choseNames: e.detail.value, //单个选中的值
    })
    if (this.data.choseNames.length == this.data.list.length) {
      this.setData({
        select_all: true
      })
    } else {
      this.setData({
        select_all: false
      })
    }
  },
  onLoad:function(options) {
    const db = wx.cloud.database()
    name1 = wx.getStorageSync('zifu')
    db.collection('announcement_temp').where(
      {
        club_ID:name1
      }
    ).get()
    .then(
      res=>{
        for(var i =0;i<res.data.length;i++)
        {
          if(res.data[i].status=='0')
          {
            status = '待审核'
          }
          else{
            if(res.data[i].status=='1')
            {
              status = '通过'
            }
            else{
              status = '驳回'
            }
          }
          this.setData(
            {
              list:this.data.list.concat(
                {
                  title:res.data[i].an_title,
                  date:res.data[i].an_date,
                  state:status
                }
              )
            }
          )
        }
      }
    )
  },
  onRefresh:function(){
    //导航条加载动画
    wx.showNavigationBarLoading()
    //loading 提示框
    wx.showLoading({
      title: 'Loading...',
    })
    console.log("下拉刷新啦");
    setTimeout(function () {
      wx.hideLoading();
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
    }, 2000)
  },
  onPullDownRefresh:function(){
    this.onRefresh();
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