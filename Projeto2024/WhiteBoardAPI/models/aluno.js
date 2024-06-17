var mongoose = require("mongoose")

var aluno = new mongoose.Schema({
    _id: String,
    nome: String,
    foto: String,
    email: String,
    curso: String,
    password: String,
    token: String 
}, {versionKey: false})

module.exports = mongoose.model('alunos', aluno)