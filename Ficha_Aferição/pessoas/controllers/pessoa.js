var Pessoa = require('../models/pessoa')

module.exports.list = function(){
    return Pessoa.find().sort({nome: 1}).exec()
}

module.exports.findById = function(id){
    return Pessoa.findOne({id: id}).exec()
}

module.exports.insert = function(pessoa){
    return Pessoa.create(pessoa)
}

module.exports.updatePessoa = function(id, pessoa){
    return Pessoa.updateOne({_id:id},pessoa)
}

module.exports.deletePessoa = function(id){
    return Pessoa.deleteOne({_id:id})
}