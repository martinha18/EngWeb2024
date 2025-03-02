var mongoose = require('mongoose')

var contratoSchema = new mongoose.Schema({
    _id: String,
    id: String,
    anuncio: String,
    procedimento: String,
    objeto: String,
    publicacao: String,
    celebracao: String,
    preco: Number,
    prazo: String,
    nipc: String,
    entidade: String,
    fundamentacao: String,
}, {versionKey: false})

module.exports = mongoose.model('contratos',contratoSchema, 'contratos')