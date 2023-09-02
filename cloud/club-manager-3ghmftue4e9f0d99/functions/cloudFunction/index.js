// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return db.collection('activity_temp').aggregate()
    .lookup({
      from:"clubsimp_temp",
      localField:'club_ID',
      foreignField:'ID',
      as:'result'
    })
    .end()
  }
  /*
  wx.cloud.callFunction({
      name:'cloudFunction'  //云函数的名字
    })
    .then(res=>{  //云函数返回100条数据
        //console.log('请求成功',res)
        this.setData({
          originallist:res.result.list
        })
        console.log('请求成功',this.data.originallist)
    }) 
  */
