const mongoose = require('./core');

const loginSchema = new mongoose.Schema({
    username: { type: String },
    password: {
        type: String,
        set(val) {
            // 使用bcrypt进行散列保存 12代表加密程度
            return require('bcrypt').hashSync(val,12);
        }
    }
},{versionKey:false})

// module.exports = mongoose.model("Login", loginSchema,"login");