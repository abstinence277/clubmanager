// pages/home_recover/home_recover.js
let ans = '';
let _id = '';
let name1 = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:'',
    question:'',
    answer:'',
    prompt:'',
    prompt1:'问题',
    prompt2:'答案',
    ifName:false,
    pwd1:'',
    pwd2:'',

    
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
        name1 = this.data.account
        db.collection('user_info').where({
          ID:this.data.account
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
                  db.collection('user_info').doc(_id).update(
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
  sub()
  {
    if(this.data.account=='')
    {
      this.setData(
        {
          prompt:'请输入账号！'
        }
      )
    }
    else{
    const db = wx.cloud.database()
    db.collection('user_info').where(
      {
        ID:this.data.account
      }
    ).get()
    .then(res=>
      {
        if(res.data.length==0)
        {
          this.setData(
            {
              prompt:'账号不存在！'
            }
          )
        }
        else if(res.data[0].question==''){
          this.setData(
            {
              prompt:'没有设置密保问题'
            }
          )
        }
        else{
          this.setData(
            {
              question:res.data[0].question
            }
            
          )
          ans = res.data[0].answer
          _id = res.data[0]._id
        }
      })
    }
  },

  submit()
  {
    if(this.data.answer=='')
    {
      this.setData({
        prompt:'请输入答案！'
      })
    }
    else{
      if(this.data.answer==ans)
      {
        this.setData(
          {
            ifName:true
          }
        )
        /*const db = wx.cloud.database()
        db.collection('user_info').doc(id).update({
          data:{
            password:"1111"
          }
        })*/
       /* wx.showModal({
          title: '提示',
          content: '密码已重置为为1111，请及时去登录端修改',
          showCancel:false,
          complete: (res) => {
            if (res.cancel) {
              
            }
        
            if (res.confirm) {
              wx.navigateTo({
                url: '../home/home',
              })
            }
          }
        })*/
      }
      else{
        this.setData({
          prompt:'你的回答错误！'
        })
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