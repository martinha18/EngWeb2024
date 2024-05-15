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
    var objectId = mongoose.Types.ObjectId(id);
    console.log(objectId)
    return Compositor.updateOne({_id: objectId},compositor)
}

module.exports.deleteCompositor = function(id){
    return Compositor.deleteOne({id:id})
}