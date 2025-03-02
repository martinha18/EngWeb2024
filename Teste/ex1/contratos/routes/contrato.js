var express = require('express');
var router = express.Router();
var Contrato = require("../controllers/contrato")

/* GET home page. */
router.get('', function(req, res, next) {
  Contrato.list()
  .then(data => res.jsonp(data))
  .catch(erro => res.jsonp(erro))
});

router.get('/:id', function(req, res) {
  Contrato.findById(req.params.id)
  .then(data => res.jsonp(data))
  .catch(erro => res.jsonp(erro))
});

router.get('/entidades', function(req, res) {
  Contrato.findEntities()
  .then(data => res.jsonp(data))
  .catch(erro => res.jsonp(erro))
});

router.get('/tipos', function(req, res) {
  Contrato.findById(req.params.id)
  .then(data => res.jsonp(data))
  .catch(erro => res.jsonp(erro))
});

router.post('', function(req, res) {
  Contrato.insert(req.body)
  .then(data => res.status(201).jsonp(data))
  .catch(erro => res.status(523).jsonp(erro))
});

router.put('/:id', function(req, res) {
  Contrato.update(req.params.id, req.body)
  .then(data => res.status(201).jsonp(data))
  .catch(erro => res.status(524).jsonp(erro))
});

router.delete('/:id', function(req, res) {
  Contrato.delete(req.params.id)
  .then(data => res.status(201).jsonp(data))
  .catch(erro => res.status(524).jsonp(erro))
});

module.exports = router;
