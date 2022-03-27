const mongoose = require('./core');
const rankingsSchema = new mongoose.Schema({
    username:{type:String,required:true},
    score:{type:Number,required:true}
},{versionKey:false})

const rankingsModel = mongoose.model('Rankings',rankingsSchema,'rankings');

module.exports = rankingsModel;