const mongoose = require('./core');

const registerSchema = new mongoose.Schema({
    username: { type: String },
    password: {
        type: String,
        select:false, //查表时不带出password字段
        set(val) {
            // 使用bcrypt进行散列保存 12代表加密程度
            console.log('test')
            return require('bcrypt').hashSync(val,12);
        }
    }
},{versionKey:false})

module.exports = mongoose.model("Register", registerSchema,"register");