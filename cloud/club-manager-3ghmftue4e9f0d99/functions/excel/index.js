// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'club-manager-3ghmftue4e9f0d99'}) // 使用当前云环境
const xlsx = require('node-xlsx')
const db = cloud.database()
const _ = db.command
// 云函数入口函数
let alldata = [];
let data = [];
let row = ['学号','姓名','学院'];
let dataCVS='test.xlsx';

let arr1 = [];
exports.main = async (event, context) => {
 // const wxContext = cloud .getWXContext()
try
             {
              alldata = [] 
              let id = event.id;
              alldata.push(row);
              console.log(id)
              console.log(event.arr)
              //await func(id);
              /*db.collection('myregister').where(
                {
                  an_id:id
                }
              ).get()
              .then(
                res=>
                {
                  arr1 = res.data;
                  for(let i= 0 ;i<arr1.length;i++)
                  {
                   db.collection('user_info').where(
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
                  /*wx.setStorage(
                    {
                      key:'huodong',
                      data:alldata
                    }
                  )
                  console.log(alldata);

                }
              )*/
              console.log(alldata)
              var buffer = await xlsx.build([
                {
                  name:'name',
                  data:event.arr,
                }
              ]) ;
              //console.log(buffer)
            return  await cloud.uploadFile({
                cloudPath: dataCVS,
                fileContent: buffer,
              });
  
              //alldata.push(event.arr)
}
                catch(error)
                {
                  console.error(error)
                }
              

  /*return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }*/
}
/*func = async(id)=>
{
  await db.collection('myregister').where(
    {
      an_id:id
    }
  ).get()
  .then(
    res=>
    {
      arr1 = res.data;
      for(let i= 0 ;i<arr1.length;i++)
      {
       db.collection('user_info').where(
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
      /*wx.setStorage(
        {
          key:'huodong',
          data:alldata
        }
      )
      console.log(alldata);

    }
  )
}*/