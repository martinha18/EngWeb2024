var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get('http://localhost:16000/contratos')
    .then (resposta => {
      res.render('index', { lista: resposta.data, title: "Contratos" });
    })
    .catch (erro => {
      res.render('error', { error: erro, message: 'Erro ao apresentar índice' });
    })
});

router.get('/:id', function(req, res) {
  axios.get('http://localhost:16000/contratos/'+req.params.id)
    .then (resposta => {
      res.render('contrato', { contrato: resposta.data, title: "Consulta de Contrato" });
    })
    .catch (erro => {
      res.render('error', { error: erro, message: 'Erro ao apresentar o contrato' });
    })
});


module.exports = router;
