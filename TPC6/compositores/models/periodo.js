var mongoose = require('mongoose')

var compositorSchema = new mongoose.Schema({
    _id: String,
    nome: String
}, {versionKey: false})

module.exports = mongoose.model('periodos',compositorSchema, 'periodos') //! nome da coleção