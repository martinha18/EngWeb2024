var Compositor = require('../models/compositor')

module.exports.list = function(){
    return Compositor.find().sort({nome: 1}).exec()
}

module.exports.findById = function(id){
    return Compositor.findOne({id: id}).exec()
}

module.exports.insert = function(compositor){
    return Compositor.create(compositor)
}

module.exports.updateCompositor = function(id, compositor){
    return Compositor.updateOne({_id:id},compositor)
}

module.exports.deleteCompositor = function(id){
    return Compositor.deleteOne({_id:id})
}