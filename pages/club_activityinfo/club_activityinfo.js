//const { composeRawBufferEntity3DWhole } = require("XrFrame/kanata/lib/index");

// pages/club_announceinfo/club_announceinfo.js
let arr = [];
let name1 = '';
let status = '';
let an_id = '';
let arr1 = [];
let alldata = []
let row = ['学号','姓名','学院']
let row2 = ['1234','cyl','cs']

Page({

  /**
   * 页面的初始数据
   */
  data: {
    select_all:false,
    list:[],
    choseNames: '',
  },
async func1(s)
  {
    const db = await wx.cloud.database()
   await db.collection('activity_temp').where(
      {
        an_title:s
      }).get()
      .then(
        res=>
        {
          an_id = res.data[0].an_id
          console.log(an_id)
        }
      )
    
  },
async func(id)
  {
    const db  = await wx.cloud.database()
    await db.collection('myregister').where(
      {
        an_id:id
      }
    ).get()
    .then(
      res=>
      {
        arr1 = res.data;
     
        /*wx.setStorage(
          {
            key:'huodong',
            data:alldata
          }
        )*/
        //console.log(alldata);
        console.log(alldata)

      }
    )
  },
 async func2(arr1)
 {
  const db = await wx.cloud.database()
  for(let i= 0 ;i<arr1.length;i++)
  {
   await db.collection('user_info').where(
      {
        ID:arr1[i].studID
      }
    ).get()
    .then(ress=>
      {
        let arr2 = [];
        arr2.push(ress.data[0].ID);
        arr2.push(ress.data[0].name);
        arr2.push(ress.data[0].college);
        alldata.push(arr2);
      })
  }
 },
async output()
  {

    alldata = []
    alldata.push(row)
    //alldata.push(row2)
    //console.log(arr)
    const db = wx.cloud.database()
    await this.func1(arr[0])
    /*db.collection('activity_temp').where(
      {
        an_title:arr[0]
      }
    ).get()
    .then(
      res=>{
        an_id = res.data[0].an_id*/
    await this.func(an_id)
    await this.func2(arr1)
      await  wx.cloud.callFunction(
          {
            name:"excel",
            data:
            {
              id:an_id,
              arr:alldata
            },
            complete:res=>
            {
              wx.cloud.getTempFileURL(
                {
                  fileList:[res.result.fileID],
                  success:res=>{
                    this.setData(
                      {
                        tempFileURL:res.fileList[0].tempFileURL,
                        showUrl:true
                      }
                    )
                    wx.setClipboardData({
                      data: this.data.tempFileURL,
                      success(res){
                        wx.getClipboardData(
                          {
                            success(res)
                            {
                              console.log(res.data)
                            }
                          }
                        )
                      }
                    })
                  }
                }
              )
            }

          }
        )
       /*db.collection('myregister').where(
          {
            an_id:an_id
          }
        ).get()
        .then(
          res=>
          {
            arr1 = res.data
            
            for(let i= 0 ;i<arr1.length;i++)
            {
              db.collection('user_info').where(
                {
                  ID:res.data[i].studID
                }
              ).get()
              .then(ress=>
                {
                  let arr2 = []
                  arr2.push(ress.data[0].ID)
                  arr2.push(ress.data[0].name)
                  arr2.push(ress.data[0].college)
                  alldata.push(arr2)
                })
            }
            wx.setStorage(
              {
                key:'huodong',
                data:alldata
              }
            )
            //console.log(alldata)
              console.log(alldata)

          }
        )*/
 
  },


            
           
  confirm()
  {
    arr = []
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
        arr = arr.concat(this.data.list[i].title.split(','));
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
    db.collection('activity_temp').where(
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