var express = require('express');
var router = express.Router();
var Admin = require('../controllers/admin');
var auth = require("../auth/auth")

router.get('/', function(req, res) {
    auth.verifyToken(req.query.userID, req.query.token)
    .then(function(response){
        if (!response){
            res.status(401).jsonp({message: 'Realize a Autenticação'})
        }
        else{
            Admin.find()
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

router.post('/', function(req, res){
    if (req.query.adminPasse == global.adminPasse){
        var admin = {
            _id : req.body._id,
            password: req.body.password,
            token: ""
        };
        Admin.insert(admin)
        .then(function (data){
            res.jsonp(data); 
        })
        .catch(erro => 
            res.status(422).jsonp(erro)
        );
    }else{
        res.status(401).jsonp({message: 'Passe de Admin errada'})
    }
});

router.get('/:id', function(req, res) {
    auth.verifyToken(req.query.userID, req.query.token)
    .then(function(response){
        if (!response){
            res.status(401).jsonp({message: 'Realize a Autenticação'})
        }
        else{
            Admin.findById(req.params.id)
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

router.put('/:id', async function(req, res) {
    auth.verifyToken(req.query.userID, req.query.token)
    .then(async function(response){
        if (!response){
            res.status(401).jsonp({message: 'Realize a Autenticação'})
        }
        else{
            Admin.update(req.params.id, req.body)
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

router.delete('/:id', async function(req, res) {
    auth.verifyToken(req.query.userID, req.query.token)
    .then(async function(response){
        if (!response){
            res.status(401).jsonp({message: 'Realize a Autenticação'})
        }
        else{
            Admin.delete(req.params.id)
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

// Autenticação não pode ser protegida pelos tokens
router.get('/:id/autenticar', function(req, res) {
    auth.authenticateUser(req.params.id, req.query.password, "Admin")
    .then(function(data){
        res.jsonp(data);
    })
    .catch(function(erro){
        res.status(500).jsonp({error: erro.message})  
    });
});

module.exports = router;