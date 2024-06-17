var Aluno = require('../models/aluno')

module.exports.find = function(){
    return Aluno.find().select('-token').exec()
}

module.exports.findById = function(id){
    return Aluno.findOne({_id: id}).exec()
}

module.exports.insert = function(aluno){
    return Aluno.create(aluno)
}

module.exports.update = function(id,aluno){
    return Aluno.updateOne({_id:id}, aluno)
}

module.exports.delete = function(id) {
    return Aluno.findByIdAndDelete(id).exec()
}

module.exports.insertToken = function(id, token) {
    return Aluno.updateOne({_id: id}, {$set: {token: token}})
}