var express = require('express');
var router = express.Router();
var axios = require('axios')

router.get('/', function(req, res, next) {
  axios.get('http://localhost:17000/books')
    .then (resposta => {
      res.render('index', { lista: resposta.data, title: "Livros" });
    })
    .catch (erro => {
      res.render('error', { error: erro, message: 'Erro ao apresentar índice' });
    })
});

router.get('/:id', function(req, res) {
  axios.get('http://localhost:17000/books/'+req.params.id)
    .then (resposta => {
      res.render('livro', { contrato: resposta.data, title: "Consulta de Livro" });
    })
    .catch (erro => {
      res.render('error', { error: erro, message: 'Erro ao apresentar o livro' });
    })
});

module.exports = router;
