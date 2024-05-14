var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET home page. */
router.get('/', function(req, res, next) {
  var d = new Date().toISOString().substring(0,16)
  res.render('index', { title: 'Express', data: d });
});

module.exports = router;

router.get('/compositores', function(req, res) {
  axios.get('http://localhost:3000/compositores')
    .then (resposta => {
      var d = new Date().toISOString().substring(0,16)
      res.render('compositores', { lista: resposta.data, data: d, title: "Lista de Compositores" });
    })
    .catch (erro => {
      res.render('error', { error: erro, message: 'Erro ao recuperar os compositores' });
    })
});

router.get('/compositores/registo', function(req, res) {
  var d = new Date().toISOString().substring(0,16)
  res.render('formcompositores', { data: d, title: "Registo de Aluno" });
});

router.get('/compositores/:id', function(req, res) {
  axios.get('http://localhost:3000/compositores/'+req.params.id)
    .then (resposta => {
      var d = new Date().toISOString().substring(0,16)
      res.render('compositor', { compositor: resposta.data, data: d, title: "Consulta de Compositor" });
    })
    .catch (erro => {
      res.render('error', { error: erro, message: 'Erro ao recuperar os compositores' });
    })
});

router.get('/compositores/edit/:id', function(req, res, next) {
  axios.get("http://localhost:3000/compositores/"+req.params.id)
      .then(resposta=>{
        var d = new Date().toISOString().substring(0,16)
        res.render("editcompositores",{compositor: resposta.data, data: d})
      })
      .catch (erro => {
        res.render('error', { error: erro, message: 'Erro ao editar o compositor' });
      })
});

router.get('/compositores/delete/:id', function(req, res, next) {
  axios.delete("http://localhost:3000/compositores/"+req.params.id)
      .then(resp=>{
         res.redirect("/compositores")
        })
        .catch(erro=>{
            res.render("error",{error: erro, message: 'Erro ao eliminar o compositor'})
        })
});

//POST

router.post('/compositores/registo', function(req, res) {
  console.log(JSON.stringify(req.body))
  axios.post('http://localhost:3000/compositores', req.body)
    .then (resposta => {
      console.log('Dados do novo compositor:', resposta.data);
      var d = new Date().toISOString().substring(0,16)
      res.render('compositor', { compositor: resposta.data, data: d, title: "Consulta de Compositor"});
    })
    .catch (erro => {
      res.render('error', { error: erro, message: 'Erro ao gravar um compositor novo' });
    })
});

router.post('/compositores/edit/:id', function(req, res, next) {
  var compositor=req.body
  axios.put("http://localhost:3000/compositores/"+req.params.id, compositor)
      .then(resp=>{
          res.redirect("/compositores/"+req.params.id)
      })
      .catch(erro=>{
          res.render("error",{error: erro, message: 'Erro ao editar o compositor'})
      })
});