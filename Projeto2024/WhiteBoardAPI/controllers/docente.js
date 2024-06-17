var Docente = require('../models/docente')

module.exports.find = function(){
    return Docente.find().select('-token').exec() 
}

module.exports.findById = function(id){
    return Docente.findOne({_id: id}).exec()
}

module.exports.insert = function(docente){
    return Docente.create(docente)
}

module.exports.update = function(id,docente){
    return Docente.updateOne({_id:id}, docente)
}

module.exports.delete = function(id) {
    return Docente.findByIdAndDelete(id).exec()
}

module.exports.insertToken = function(id, token) {
    return Docente.updateOne({_id: id}, {$set: {token: token}})
}