var Admin = require('../models/admin')

module.exports.find = function(){
    return Admin.find().select('-token').exec()
}

module.exports.findById = function(id){
    return Admin.findOne({_id: id}).exec()
}

module.exports.insert = function(admin){
    return Admin.create(admin)
}

module.exports.update = function(id,admin){
    return Admin.updateOne({_id:id}, admin)
}

module.exports.delete = function(id) {
    return Admin.findByIdAndDelete(id).exec()
}

module.exports.insertToken = function(id, token) {
    return Admin.updateOne({_id: id}, {$set: {token: token}})
}