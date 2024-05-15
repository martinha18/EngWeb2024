var Periodo = require('../models/periodo')

module.exports.list = function(){
    return Periodo.find().sort({nome: 1}).exec()
}

module.exports.findById = function(id){
    return Periodo.findOne({_id: id}).exec()
}

module.exports.insert = function(periodo){
    return Periodo.create(periodo)
}

module.exports.update = function(id, periodo){
    return Periodo.updateOne({_id: id},periodo)
}

module.exports.delete = function(id){
    return Periodo.deleteOne({_id:id})
}