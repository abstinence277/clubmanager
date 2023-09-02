// pages/club_check/club_check.js
let arr = []; //存放选中id的数组
let name1 = '';
let arr1 = [];
let number1 = 0;
let state = 0;
let status = '';
let _id = '';
let arraypro = [];
let _id1 = '';
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
  delete()
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
      const db = wx.cloud.database()
      for(var i = 0;i<arr.length;i++)
      {
        db.collection('user_info').where(
          {
            ID:arr[i]
          }
        ).get()
        .then(
          res=>
          {
            arr1 = res.data[0].club
            _id = res.data[0]._id
            name1 = wx.getStorageSync('zifu')
            for(var j = 0;j<arr1.length;j++)
            {
              if(arr1[j]==name1)
              {
                arr1.splice(j,1)
                break
              }
            }
            db.collection('user_info').doc(_id).update(
              {
                data:
                {
                  club:arr1
                },success:(res)=>
                {
                  const db = wx.cloud.database()
                  db.collection('club_admin').where(
                    {
                      ID:name1
                    }
                  ).get()
                  .then(res=>
                    {
                      _id1 = res.data[0]._id
                      number1 = res.data[0].club_total_number - arr.length
                      db.collection('club_admin').doc(_id1).update(
                        {
                          data:
                          {
                            club_total_number:number1
                          }
                        }
                      )
                    })
                  arr1 = []
 
                }
              }
            )
          }
        )
      
      }
     wx.showModal({
        title: '标题',
        content: '已完成删除',
        showCancel:false,
        complete: (res) => {
          if (res.cancel) {
            
          }
      
          if (res.confirm) {
            wx.navigateBack()
           /* wx.navigateTo({
              url: '../club_index/club_index',
            })*/
          }
        }
      })
    }

  },
  confirm()
  {
    this.setData(
      {
        list:[]
      }
    )
    name1 = wx.getStorageSync('zifu')
    for(var i = 0;i<arraypro.length;i++)
    {
      for(var j = 0;j<arraypro[i].club.length;j++)
      {
        console.log(arraypro[i].club[j])
        if(arraypro[i].club[j] == name1)
        {
          console.log(arraypro[i].name)
          this.setData(
            {
              list:this.data.list.concat(
                {
                  name:arraypro[i].name,
                  number:arraypro[i].ID,
                  sex:arraypro[i].sex,
                  college:arraypro[i].college
                }
              )
            }
          )
        }
      }
    }
  
  this.onLoad()
  arraypro = [] //清空内存，不然会出bug
 
  
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
  onLoad: async function(options) {
    arraypro = []
    this.setData(
      {
        arraypro:[]
      }
    )
    const db = wx.cloud.database()
    const c = db.collection('user_info')
    const total = await(await c.count()).total
    const batchtimes = Math.ceil(total/20)
    let x = 0
    for(var i = 0 ;i<batchtimes;i++)
    {
      db.collection("user_info").skip(i*20).get(
        {
          success:function(res)
          {
            x = x+1
            for(var j = 0;j<res.data.length;j++)
            {
              arraypro.push(res.data[j])
            }
            if(x==batchtimes)
            {
              console.log(arraypro)
            }
          }
          
        }
      )
    }
   
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    arraypro = []
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