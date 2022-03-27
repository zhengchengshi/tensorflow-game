const rankingsModel = require('../model/mainData');
const registerModel = require('../model/register');


const jwt = require('jsonwebtoken')
const url = require("url");
const querystring = require("querystring")

const SECRET_KEY = 'Billy12138'


exports.data = function(req,res){
    
    // 查找全部
    rankingsModel.find({}).sort({"score":-1}).exec((err,data)=>{
        if(err)throw err;
        else{
            console.log(data)
            res.status('200').json(data);
        }
    })
}

exports.myscore = function(req,res){
    // var query = querystring.parse(url.parse(req.url).query)
    // rankingsModel.find({"data.username":query.username},(err,data)=>{
    //     if(err)throw err;
    //     else{
    //         res.status('200').json(data);
    //     }
    // })
}
exports.addData = function(req,res){
    let username;
    const token = req.headers.authorization.substring(7)

    jwt.verify(token,SECRET_KEY,async (err,decode)=>{
        if(err)throw err;
        else{
            // 解析token查找用户信息
            let userInfo = await registerModel.findOne({ _id:decode.id })
            const mainDataModelInstance = new rankingsModel({
                username:userInfo.username,
                score:req.body.score
            })
            let userData = await rankingsModel.findOne({username:userInfo.username})
            // 用户数据不存在，则存入分数
            if(!userData){
                // 数据库存入对象中的对象时需要使用raw格式上传
                mainDataModelInstance.save((err)=>{
                    if(err){
                        res.status('500').send('server fault')
                        throw err
                    }
                    else{
                        console.log('保存成功')
                        res.status('200').send('success')
                    }
                })
            }
            else{
                if(req.body.score>userData.score){
                    rankingsModel.findOneAndUpdate({
                        username:userData.username
                    },{
                        $set:{
                            score:req.body.score
                        }
                    },{},(err,data)=>{
                        if(err){
                            res.status('500').send('服务器错误！')
                            Promise.reject(err)
                        }
                        else if(!data){
                            res.status('200').send('数据不存在')
                            console.log('数据不存在')
                        }
                        else if(data){
                            console.log('修改数据成功')
                            res.status('200').send('success')
                        }
                    }
                    )
                }
                else{
                    res.status('200').send('数据未修改')
                }
            }
            
        }
    })
    
}