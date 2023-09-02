// pages/club_check/club_check.js
var util = require('../../utils/util')
let arr = []; //存放选中id的数组
let name1 = '';
let arr1 = [];
//let number = 0;
let state = 0;
let status = '';
let _id = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select_all: false,//是否全选
    list: [
    ],
    choseNames: '', //选中的名字列表

  },
  confirm()
  {
    if(arr.length==0)
    {
      wx.showModal({
        title: '提示',
        content: '请选择人员！',
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
    console.log(arr)
    const db = wx.cloud.database()
    name1 = wx.getStorageSync('zifu')
    db.collection('club_admin').where(
      {
        ID:name1
      }
    ).get()
    .then(
      res=>{
        _id = res.data[0]._id
        var number = res.data[0].club_total_number
       // console.log(number)
       // console.log(arr.length)
        number = number+arr.length
       // console.log(number)
        db.collection('club_admin').doc(_id).update(
          {
            data:{
              club_total_number:number
            }
          }
        )
      }
    )

    db.collection('myregister').where({
      club_id:name1
    }).get()
    .then(res=>{
      for(var i =0;i<res.data.length;i++)
      {
        state = res.data[i].state
        status = res.data[i].status
        if(state==0)
        {
          _id = res.data[i]._id
          db.collection('myregister').doc(_id).update(
            {
              data:
              {
                state:1
              }
            }
          )
        }
      }
    })
    for(var i =0 ;i<arr.length;i++)
    {
      db.collection('user_info').where({
        ID:arr[i]
      }).get()
      .then(
        res=>
        {
          _id = res.data[0]._id
          arr1 = res.data[0].club
          db.collection('user_info').doc(_id).update(
            {
              data:
              {
                club:arr1.concat(name1),
                join_date:util.formatDate(new Date())
              },success:res=>
              {
                wx.showModal({
                  title: '提示',
                  content: '入社成功！',
                  showCancel:false,
                  complete: (res) => {
                    if (res.cancel) {
                      
                    }
                
                    if (res.confirm) {
                      wx.navigateBack()
                      /*wx.redirectTo({
                        url: '../club_index/club_index.js', 
                      })*/
                    }
                  }
                })
              }
            }
          )
        }
      )
    }
  }

  },
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
    arr = []
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options) {
    arr = []
    const db = wx.cloud.database()
    name1 = wx.getStorageSync('zifu')
    db.collection('myregister').where({
      club_id:name1
    }).get()
    .then(
      res=>{
        for(var i = 0;i<res.data.length;i++)
        {
          state = res.data[i].state
          status = res.data[i].status
          db.collection('user_info').where({
            ID:res.data[i].studID
          }).get()
          .then(ress=>
            {
              if(state==0&&status==1)
              {
                this.setData(
                  {
                    list:this.data.list.concat({
                      "name":ress.data[0].name,
                      "number":ress.data[0].ID,
                      "sex":ress.data[0].sex,
                      "college":ress.data[0].college
                    })
                  }
                )
              }
              
            })
        }
      }
    )
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