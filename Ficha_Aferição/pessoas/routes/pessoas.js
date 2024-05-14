var express = require('express');
var router = express.Router();
var Pessoa = require("../controllers/pessoa")

/* GET home page. */

router.get('/pessoas', function(req, res, next) {
  Pessoa.list()
  .then(data => res.jsonp(data))
  .catch(erro => res.jsonp(erro))
});

router.get('/pessoas/:id', function(req, res) {
  Pessoa.findById(req.params.id)
  .then(data => res.jsonp(data))
  .catch(erro => res.jsonp(erro))
});

router.post('/pessoas', function(req, res) {
  console.log(req.body)
  Pessoa.insert(req.body)
  .then(data => res.status(201).jsonp(data))
  .catch(erro => res.status(523).jsonp(erro))
});

router.put('/pessoas/:id', function(req, res) {
  console.log(req.body)
  Pessoa.updatePessoa(req.params.id, req.body)
  .then(data => res.status(201).jsonp(data))
  .catch(erro => res.status(524).jsonp(erro))
});

router.delete('/pessoas/:id', function(req, res) {
  console.log(req.body)
  Pessoa.deletePessoa(req.params.id)
  .then(data => res.status(201).jsonp(data))
  .catch(erro => res.status(524).jsonp(erro))
});

module.exports = router;
