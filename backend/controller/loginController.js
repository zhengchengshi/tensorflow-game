const registerModel = require('../model/register');

const jwt = require("jsonwebtoken");
// token私钥
const SECRET_KEY = 'Billy12138'
// token超时设定
const JWT_EXPIRED = 60 * 60
exports.loginFn = async function(req,res){
    // 查找全部
    // 0.将所有请求的内容赋值给username和password，需要做app.use(express.json())处理
    const { username, password } = req.body;

    // 1.根据用户名找用户 +password是因为查表默认不带出password字段，而这里需要
    const user = await registerModel.findOne({ username }).select("+password");
    console.log(user)
    if(!user){
        res.status(403).send('用户名不存在')
    }
    else{
        // 2.校验密码
        const isValid = require("bcrypt").compareSync(password, user.password);
        // 3.返回token，使用user._id和预先定义的字符串生成token
        if(isValid){
            const token = jwt.sign({ id: user._id,username:user.name }, SECRET_KEY, {
                expiresIn:JWT_EXPIRED , 
                issuer:'Billy'
            });
            res.status(200).send({ token });
        }
        else{
            res.status(400).send("密码错误");
        }
    }
}