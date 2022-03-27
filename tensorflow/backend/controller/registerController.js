const registerModel = require('../model/register');

exports.registerFn = async function(req,res){
    // 查找全部
    // 0.将所有请求的内容赋值给username和password，需要做app.use(express.json())处理
    const { username, password } = req.body;

    const user = await registerModel.findOne({ username });
    if(user){
        res.status(403).send('用户名已存在！')
    }else{
        const registerInstance = new registerModel({
            username,
            password
        })
        registerInstance.save((err)=>{
            console.log(registerInstance)
            if(err){
                res.status('500').send('服务器出错！')
                throw err
            }
            else{
                res.status('200').send('注册成功！')
            }
        })
    }
}