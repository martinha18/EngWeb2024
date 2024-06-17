var express = require('express');
var router = express.Router();
var axios = require('axios')

router.get('/', function(req, res) {
    res.render('login', {title: "Autenticação"});
})

router.post('/', function(req, res) {
    if (req.body._id[0] == 'd'){
        const params = new URLSearchParams();
        params.append('_id', req.body._id);
        params.append('password', req.body.password);

        axios.get('http://WhiteBoardAPI:10000/docentes/'+req.body._id+"/autenticar", {params: params})
        .then(function(resposta){
            global.tokens[req.body._id] = resposta.data
            res.redirect("paginaInicial/"+req.body._id+"?token="+global.tokens[req.body._id])   
        })
        .catch(function(erro){
            if (erro.response && erro.response.status === 401) {
                res.render('error', {message: erro.response.data.message});
            } else {
                res.render('error', {message: erro.response.data.error});
            }
        }) 
    }
    else if (req.body._id[0] == 'a'){
        const params = new URLSearchParams();
        params.append('_id', req.body._id);
        params.append('password', req.body.password);

        axios.get('http://WhiteBoardAPI:10000/alunos/'+req.body._id+"/autenticar", {params: params})
        .then(function(resposta){
            global.tokens[req.body._id] = resposta.data
            res.redirect("paginaInicial/"+req.body._id+"?token="+global.tokens[req.body._id])
        })
        .catch(function(erro){
            if (erro.response && erro.response.status === 401) {
                res.render('error', {message: erro.response.data.message});
            } else {
                res.render('error', {message: erro.response.data.error});
            }        
        }) 
    }
    else res.render('error', {message: 'Formato de ID inválido'});
})

router.get('/paginaInicial/:id', function(req, res) {
    if (req.params.id[0] == 'd'){
        axios.get('http://WhiteBoardAPI:10000/ucs/docente/'+req.params.id+"?userID="+req.params.id+"&token="+global.tokens[req.params.id])
        .then(function(resposta){
            axios.get('http://WhiteBoardAPI:10000/docentes/'+req.params.id+"?userID="+req.params.id+"&token="+global.tokens[req.params.id])
            .then(function(r){
                res.render('paginaInicial', {title: "Página inicial", user: r.data, lista: resposta.data, aluno: false});
            })
            .catch(function(erro){
                if (erro.response && erro.response.status === 401) {
                    res.render('error', {token:req.query.token, message: erro.response.data.message});
                } else {
                    res.render('error', {token:req.query.token, message: 'Docente não encontrado'})
                }
            })
        })
        .catch(function(erro){
            if (erro.response && erro.response.status === 401) {
                res.render('error', {token:req.query.token, message: erro.response.data.message});
            } else {
                res.render('error', {token:req.query.token, message: 'Não foi possível apresentar a página pretendida'})
            }
        }) 
    }
    else if (req.params.id[0] == 'a'){
        axios.get('http://WhiteBoardAPI:10000/ucs/aluno/'+req.params.id+"?userID="+req.params.id+"&token="+global.tokens[req.params.id])
        .then(function(resposta){
            axios.get('http://WhiteBoardAPI:10000/alunos/'+req.params.id+"?userID="+req.params.id+"&token="+global.tokens[req.params.id])
            .then(function(r){
                res.render('paginaInicial', {title: "Página inicial", user: r.data, lista: resposta.data, aluno: true});
            })
            .catch(function(erro){
                if (erro.response && erro.response.status === 401) {
                    res.render('error', {token:req.query.token, message: erro.response.data.message});
                } else {
                    res.render('error', {token:req.query.token, message: 'Docente não encontrado'})
                }
            })   
        })
        .catch(function(erro){
            if (erro.response && erro.response.status === 401) {
                res.render('error', {token:req.query.token, message: erro.response.data.message});
            } else {
                res.render('error', {token:req.query.token, message: 'Não foi possível apresentar a página pretendida'})
            }
        })
    }
    else res.render('error', {token:req.query.token, message: 'Formato de ID inválido'});
})

module.exports = router;