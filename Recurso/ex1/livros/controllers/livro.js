var Livro = require('../models/livro')

module.exports.list = function(){
    return Livro.find().exec()
}

module.exports.findById = function(id){
    return Livro.findOne({_id: id}).exec()
}

module.exports.insert = function(livro){
    return Livro.create(livro)
}

module.exports.update = function(id, livro){
    return Livro.updateOne({_id: id},livro)
}

module.exports.delete = function(id){
    return Livro.deleteOne({_id:id})
}

module.exports.listGenres = function() {
    return Livro.distinct("genres").sort().exec()
}

module.exports.listCharacters = function() {
    return Livro.distinct("characters").sort().exec()
}

module.exports.listByGenre = function(genre){
    return Livro.find({"genres": genre}).exec()
}

module.exports.listByCharacter = function(nome){
    return Livro.find({ "characters": { $regex: nome } }).exec()
}