var mongoose = require("mongoose")

var admin = new mongoose.Schema({
    _id: String,
    password: String,
    token: String 
}, {versionKey: false})

module.exports = mongoose.model('admins', admin)