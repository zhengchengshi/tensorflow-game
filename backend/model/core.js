const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/tensorflow-game',(err)=>{
    if(err)throw err;
    else{
        console.log('database connect success');
    }
})
module.exports = mongoose;