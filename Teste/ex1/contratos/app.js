var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//MongoDB conection
var mongoose = require('mongoose')
var mongoDB = 'mongodb://127.0.0.1/contratos'
mongoose.connect(mongoDB,{useNewUrlParser: true, useUnifiedTopology: true})
var db = mongoose.connection
db.on('error',console.error.bind(console,'Erro de conexão ao MongoDB'))
db.once('open', function(){
  console.log('Conexão ao MongoDB realizado com sucesso')
})


var contratoRouter = require('./routes/contrato');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/contratos', contratoRouter);

module.exports = app;
