const mongoose =require('mongoose');

const tokenSchema = mongoose.Schema({
    token: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required:true}
})

module.exports = mongoose.model('Refresh',tokenSchema,'tokens')