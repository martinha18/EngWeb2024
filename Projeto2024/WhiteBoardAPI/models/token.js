var mongoose = require('mongoose');

var tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['Docente', 'Aluno','Admin'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1d' // Token expires in 1 day
    }
});

// Apaga o token (caso exista) de um aluno ou docente antes de adicionar o novo
tokenSchema.pre('save', function (next) {
    this.constructor.deleteMany({ userId: this.userId })
    .then(function(){
        next();
    })
    .catch(function(erro){
        next(erro);
    })
});

module.exports = mongoose.model('tokens', tokenSchema)