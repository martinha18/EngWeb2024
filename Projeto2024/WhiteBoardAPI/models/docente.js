var mongoose = require("mongoose")

var docente = new mongoose.Schema({
    _id: String,
    nome: String,
    foto: String,
    categoria: String,
    filiacao: String,
    email: String,
    webpage: String,
    password: String,
    token: String 
}, {versionKey: false})

module.exports = mongoose.model('docentes', docente)