var express = require('express');
var router = express.Router();
var UC = require('../controllers/uc')
var auth = require("../auth/auth")


router.get('/', function(req, res) {
  auth.verifyToken(req.query.userID, req.query.token)
  .then(function(response){
      if (!response){
          res.status(401).jsonp({message: 'Realize a Autenticação'})
      }
      else{
          UC.find()
          .then(function(data){
              res.jsonp(data);
          })
          .catch(function(erro){
              res.jsonp(erro);
          });
      }
  })
  .catch(function(){
    res.status(401).jsonp({message: 'Realize a Autenticação'})
  })
});

router.post('/', function(req, res) {
  auth.verifyToken(req.query.userID, req.query.token)
  .then(function(response){
      if (!response){
        res.status(401).jsonp({message: 'Realize a Autenticação'})
      }
      else{
        UC.insert(req.body)
        .then(function(data){
          res.jsonp(data)
        })
        .catch(function(erro){
          res.status(422).jsonp(erro)
        })
      }
  })
  .catch(function(){
    res.status(401).jsonp({message: 'Realize a Autenticação'})
  })
});

router.get('/:id', function(req, res) {
  auth.verifyToken(req.query.userID, req.query.token)
  .then(function(response){
      if (!response){
          res.status(401).jsonp({message: 'Realize a Autenticação'})
      }
      else{
        UC.findById(req.params.id)
        .then(function(data){
          res.jsonp(data)
        })
        .catch(function(erro){
          res.jsonp(erro)
        })
      }
  })
  .catch(function(){
    res.status(401).jsonp({message: 'Realize a Autenticação'})
  })
});

router.put('/:id', function(req, res) {
  auth.verifyToken(req.query.userID, req.query.token)
  .then(function(response){
      if (!response){
          res.status(401).jsonp({message: 'Realize a Autenticação'})
      }
      else{
        UC.update(req.params.id, req.body)
        .then(function(data){
          res.jsonp(data)
        })
        .catch(function(erro){
          res.jsonp(erro)
        })
      }
  })
  .catch(function(){
    res.status(401).jsonp({message: 'Realize a Autenticação'})
  })
});

router.delete('/:id', function(req, res) {
  auth.verifyToken(req.query.userID, req.query.token)
  .then(function(response){
      if (!response){
          res.status(401).jsonp({message: 'Realize a Autenticação'})
      }
      else{
        UC.delete(req.params.id)
        .then(function(data){
          res.jsonp(data)
        })
        .catch(function(erro){
          res.jsonp(erro)
        })
      }
  })
  .catch(function(){
    res.status(401).jsonp({message: 'Realize a Autenticação'})
  })
});


router.get('/aluno/:id', function(req, res) {
  auth.verifyToken(req.query.userID, req.query.token)
  .then(function(response){
      if (!response){
          res.status(401).jsonp({message: 'Realize a Autenticação'})
      }
      else{
        UC.ucsAluno(req.params.id)
        .then(function(data){
          res.jsonp(data)
        })
        .catch(function(erro){
          res.jsonp(erro)
        })
      }
  })
  .catch(function(){
    res.status(401).jsonp({message: 'Realize a Autenticação'})
  })
});

router.get('/docente/:id', function(req, res) {
  auth.verifyToken(req.query.userID, req.query.token)
  .then(function(response){
      if (!response){
          res.status(401).jsonp({message: 'Realize a Autenticação'})
      }
      else{
        UC.ucsDocente(req.params.id)
        .then(function(data){
          res.jsonp(data)
        })
        .catch(function(erro){
          res.jsonp(erro)
        })
      }
  })
  .catch(function(){
    res.status(401).jsonp({message: 'Realize a Autenticação'})
  })
});

router.put('/addDocente/:idUC/:idDocente', function(req, res) {
  auth.verifyToken(req.query.userID, req.query.token)
  .then(function(response){
      if (!response){
          res.status(401).jsonp({message: 'Realize a Autenticação'})
      }
      else{
        UC.addDocente(req.params.idUC, req.body.codUC, req.params.idDocente)
        .then(function(data){
          res.jsonp(data)
        })
        .catch(function(erro){
          res.jsonp(erro)
        })
      }
  })
  .catch(function(){
    res.status(401).jsonp({message: 'Realize a Autenticação'})
  })
});

router.put('/addAluno/:idUC/:idAluno', function(req, res) {
  auth.verifyToken(req.query.userID, req.query.token)
  .then(function(response){
      if (!response){
          res.status(401).jsonp({message: 'Realize a Autenticação'})
      }
      else{
        UC.addAluno(req.params.idUC, req.body.codUC ,req.params.idAluno)
        .then(function(data){
          res.jsonp(data)
        })
        .catch(function(erro){
          res.jsonp(erro)
        })
      }
  })
  .catch(function(){
    res.status(401).jsonp({message: 'Realize a Autenticação'})
  })
});

router.delete('/:id/aula/:idAula', function(req, res) {
  auth.verifyToken(req.query.userID, req.query.token)
  .then(function(response){
      if (!response){
          res.status(401).jsonp({message: 'Realize a Autenticação'})
      }
      else{
        UC.deleteAula(req.params.id,req.params.idAula)
        .then(function(data){
          res.jsonp(data)
        })
        .catch(function(erro){
          res.jsonp(erro)
        })
      }
  })
  .catch(function(){
    res.status(401).jsonp({message: 'Realize a Autenticação'})
  })
});


router.get('/notas/aluno/:idAluno', function(req, res) {
  auth.verifyToken(req.query.userID, req.query.token)
  .then(function(response){
      if (!response){
          res.status(401).jsonp({message: 'Realize a Autenticação'})
      }
      else{
        UC.findGradesByID(req.params.idAluno)
        .then(function(data){
            res.jsonp(data);
        })
        .catch(function(erro){
            res.jsonp(erro);
        });
      }
  })
  .catch(function(){
    res.status(401).jsonp({message: 'Realize a Autenticação'})
  })
});

router.get('/:id/nota/aluno/:idAluno', function(req, res) {
  auth.verifyToken(req.query.userID, req.query.token)
  .then(function(response){
      if (!response){
          res.status(401).jsonp({message: 'Realize a Autenticação'})
      }
      else{
        UC.findGradesByIDAndUC(req.params.idAluno,req.params.id)
        .then(function(data){
            res.jsonp(data);
        })
        .catch(function(erro){
            res.jsonp(erro);
        });
      }
  })
  .catch(function(){
    res.status(401).jsonp({message: 'Realize a Autenticação'})
  })
});

module.exports = router;