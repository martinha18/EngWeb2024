var Contrato = require('../models/contrato')

module.exports.list = function(){
    return Contrato.find().sort({nome: 1}).exec()
}

module.exports.findById = function(id){
    return Contrato.findOne({id: id}).exec()
}

module.exports.insert = function(contrato){
    return Contrato.create(contrato)
}

module.exports.update = function(id, contrato){
    return Contrato.updateOne({id: id},contrato)
}

module.exports.delete = function(id){
    return Contrato.deleteOne({id:id})
}

module.exports.findEntities = function() {
    return Contrato.find().distinct({entidade}).sort();
};
