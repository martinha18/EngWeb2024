var express = require('express');
var router = express.Router();
var axios = require('axios')
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const FormData = require('form-data');
const fs = require('fs');


router.get('/:id', function(req, res) {
  if (req.params.id[0] == 'd'){
    axios.get('http://WhiteBoardAPI:10000/docentes/'+req.params.id+"?userID="+req.params.id+"&token="+global.tokens[req.params.id])
    .then(function(resposta){
      const docente = resposta.data
      if (docente != null){
        res.render('perfil', {isDocente : true, docente: docente});
      } 
      else{
        res.render('error', {token:req.query.token, message: 'Docente não registado na WhiteBoard'})
      }
    })
    .catch(function(erro){
      if (erro.response && erro.response.status === 401) {
        res.render('error', {token:req.query.token, message: erro.response.data.message});
      } else {
        res.render('error', {token:req.query.token, message: 'Rota não existente na WhiteBoardAPI'})
      }
    })
  }
  else if (req.params.id[0] == 'a'){
    axios.get('http://WhiteBoardAPI:10000/alunos/'+req.params.id+"?userID="+req.params.id+"&token="+global.tokens[req.params.id])
    .then(function(resposta){
      const aluno = resposta.data
      if (aluno != null){
        res.render('perfil', {isDocente : false, aluno: aluno});
      } 
      else{
        res.render('error', {token:req.query.token, message: 'Aluno não registado na WhiteBoard'})
      }
    })
    .catch(function(erro){
      if (erro.response && erro.response.status === 401) {
        res.render('error', {token:req.query.token, message: erro.response.data.message});
      } else {
        res.render('error', {token:req.query.token, message: 'Rota não existente na WhiteBoardAPI'})
      }
    })
  }
  else {
    res.render('error', {token:req.query.token, message: 'Formato de ID inválido'})
  }
});

router.get('/:id/notas', function(req, res){
  axios.get("http://WhiteBoardAPI:10000/ucs/notas/aluno/"+req.params.id+"?userID="+req.params.id+"&token="+global.tokens[req.params.id])
  .then(function(resposta){
    const notas = resposta.data
    axios.get('http://WhiteBoardAPI:10000/alunos/' + req.params.id+"?userID="+req.params.id+"&token="+global.tokens[req.params.id])
    .then(function(response){
      res.render('alunoVerNotas', {aluno: response.data, notasAlunos: notas, alunoID: req.params.id})
    })
    .catch(function(erro){
      if (erro.response && erro.response.status === 401) {
        res.render('error', {token:req.query.token, message: erro.response.data.message});
      } else {
        res.render('error', {token:req.query.token, message: 'Rota não existente na WhiteBoardAPI'})
      }
    })
  })
  .catch(function(erro){
    if (erro.response && erro.response.status === 401) {
      res.render('error', {token:req.query.token, message: erro.response.data.message});
    } else {
      res.render('error', {token:req.query.token, message: 'Rota não existente na WhiteBoardAPI'})
    }
  })
});

router.get('/:id/inscreverUC', function(req, res) {
  if (req.params.id[0] == 'd'){
    axios.get('http://WhiteBoardAPI:10000/docentes/' + req.params.id+"?userID="+req.params.id+"&token="+global.tokens[req.params.id])
    .then(function(response){
      res.render('inscreverUC', {user: response.data, userID: req.params.id})
    })
    .catch(function(erro){
      if (erro.response && erro.response.status === 401) {
        res.render('error', {token:req.query.token, message: erro.response.data.message});
      } else {
        res.render('error', {token:req.query.token, message: 'Rota não existente na WhiteBoardAPI'})
      }
    })
  }
  else if (req.params.id[0] == 'a'){
    axios.get('http://WhiteBoardAPI:10000/alunos/' + req.params.id+"?userID="+req.params.id+"&token="+global.tokens[req.params.id])
    .then(function(response){
      res.render('inscreverUC', {user: response.data, userID: req.params.id})
    })
    .catch(function(erro){
      if (erro.response && erro.response.status === 401) {
        res.render('error', {token:req.query.token, message: erro.response.data.message});
      } else {
        res.render('error', {token:req.query.token, message: 'Rota não existente na WhiteBoardAPI'})
      }
    })
  }
  else {
    res.render('error', {token:req.query.token, message: 'Formato de ID inválido'})
  }
});

router.post('/:id/inscreverUC', function(req, res) {
  if (req.params.id[0] == 'd'){
    axios.get('http://WhiteBoardAPI:10000/docentes/' + req.params.id+"?userID="+req.params.id+"&token="+global.tokens[req.params.id])
    .then(function(response){
      axios.put('http://WhiteBoardAPI:10000/ucs/addDocente/'+req.body._id+"/"+req.params.id+"?userID="+req.params.id+"&token="+global.tokens[req.params.id], req.body)
      .then(function(resposta){
        if (resposta.data.modifiedCount == 1){
          res.redirect("/perfil/"+req.params.id+"?token="+response.data.token)
        } 
        else{
          res.render('error', {token:req.query.token, idUser: req.params.id, user: response.data, message: 'Inscrição na UC inválida'})
        }
        })
      .catch(function(erro){
        if (erro.response && erro.response.status === 401) {
          res.render('error', {token:req.query.token, message: erro.response.data.message});
        } else {
          res.render('error', {token:req.query.token, idUser: req.params.id, user: response.data, message: 'ID de UC não existente'})
        }
      })
    })
    .catch(function(erro){
      if (erro.response && erro.response.status === 401) {
        res.render('error', {token:req.query.token, message: erro.response.data.message});
      } else {
        res.render('error', {token:req.query.token, message: 'Rota não existente na WhiteBoardAPI'})
      }
    })
  }
  else if (req.params.id[0] == 'a'){
    axios.get('http://WhiteBoardAPI:10000/alunos/' + req.params.id+"?userID="+req.params.id+"&token="+global.tokens[req.params.id])
    .then(function(response){
      axios.put('http://WhiteBoardAPI:10000/ucs/addAluno/'+req.body._id+"/"+req.params.id+"?userID="+req.params.id+"&token="+global.tokens[req.params.id], req.body)
      .then(function(resposta){
        if (resposta.data.modifiedCount == 1){
          res.redirect("/perfil/"+req.params.id+"?token="+response.data.token)
        } 
        else{
          res.render('error', {token:req.query.token, idUser: req.params.id, user: response.data, message: 'Inscrição na UC inválida'})
        }
        })
      .catch(function(erro){
        if (erro.response && erro.response.status === 401) {
          res.render('error', {token:req.query.token, message: erro.response.data.message});
        } else {
          res.render('error', {token:req.query.token, idUser: req.params.id, user: response.data, message: 'ID de UC não existente'})
        }
      })
    })
    .catch(function(erro){
      if (erro.response && erro.response.status === 401) {
        res.render('error', {token:req.query.token, message: erro.response.data.message});
      } else {
        res.render('error', {token:req.query.token, message: 'Rota não existente na WhiteBoardAPI'})
      }
    })
  }
  else {
    res.render('error', {token:req.query.token, message: 'Formato de ID inválido'})
  }
});

router.get('/:id/editar', function(req, res) {
  if (req.params.id[0] == 'd'){
    axios.get('http://WhiteBoardAPI:10000/docentes/'+req.params.id+"?userID="+req.params.id+"&token="+global.tokens[req.params.id])
    .then(function(resposta){
      const docente = resposta.data
      if (docente != null){
        res.render('editarPerfil', {isDocente : true, docente: docente});
      } 
      else{
        res.render('error', {token:req.query.token, message: 'Docente não registado na WhiteBoard'})
      }
    })
    .catch(function(erro){
      if (erro.response && erro.response.status === 401) {
        res.render('error', {token:req.query.token, message: erro.response.data.message});
      } else {
        res.render('error', {token:req.query.token, message: 'Rota não existente na WhiteBoardAPI'})
      }
    })
  }
  else if (req.params.id[0] == 'a'){
    axios.get('http://WhiteBoardAPI:10000/alunos/'+req.params.id+"?userID="+req.params.id+"&token="+global.tokens[req.params.id])
    .then(function(resposta){
      const aluno = resposta.data
      if (aluno != null){
        res.render('editarPerfil', {isDocente : false, aluno: aluno});
      } 
      else{
        res.render('error', {token:req.query.token, message: 'Aluno não registado na WhiteBoard'})
      }
    })
    .catch(function(erro){
      if (erro.response && erro.response.status === 401) {
        res.render('error', {token:req.query.token, message: erro.response.data.message});
      } else {
        res.render('error', {token:req.query.token, message: 'Rota não existente na WhiteBoardAPI'})
      }
    })
  }
  else {
    res.render('error', {token:req.query.token, message: 'Formato de ID inválido'})
  }
});

router.post('/:id/editar', upload.single('foto'), function(req, res) {    
  // Cria um form para enviar para o WhiteBoardAPI (body e file)
  const form = new FormData();
    
  for (const key in req.body) {
    form.append(key, req.body[key]);
  }
  
  if (req.file) {
    form.append('foto', fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
  }

  if (req.params.id[0] == 'd'){
    axios.put('http://WhiteBoardAPI:10000/docentes/'+req.body._id+"?userID="+req.params.id+"&token="+global.tokens[req.params.id], form, {headers: {...form.getHeaders()}})
    .then(function(resposta){
      const docente = resposta.data
      if (docente != null){
          res.redirect("/perfil/"+req.body._id+"?token="+global.tokens[req.body._id])
          
          if (req.file){
            fs.unlink(req.file.path, function(error) {
              if (error) console.error('Erro ao eliminar o ficheiro temporario', error);
            });
          }
      } 
      else{
        res.render('error', {token:req.query.token, message: 'Docente não registado na WhiteBoard'})
      }
    })
    .catch(function(erro){
      if (erro.response && erro.response.status === 401) {
        res.render('error', {token:req.query.token, message: erro.response.data.message});
      } else {
        res.render('error', {token:req.query.token, message: 'Rota não existente na WhiteBoardAPI'})
      }
    })
  }
  else if (req.params.id[0] == 'a'){
    axios.put('http://WhiteBoardAPI:10000/alunos/'+req.body._id+"?userID="+req.params.id+"&token="+global.tokens[req.params.id], form, {headers: {...form.getHeaders()}})
    .then(function(resposta){
      const aluno = resposta.data
      if (aluno != null){
          res.redirect("/perfil/"+req.body._id+"?token="+global.tokens[req.body._id])

          if (req.file){
            fs.unlink(req.file.path, function(error) {
              if (error) console.error('Erro ao eliminar o ficheiro temporario', error);
            });
          }
      } 
      else{
        res.render('error', {token:req.query.token, message: 'Aluno não registado na WhiteBoard'})
      }
    })
    .catch(function(erro){
      if (erro.response && erro.response.status === 401) {
        res.render('error', {token:req.query.token, message: erro.response.data.message});
      } else {
        res.render('error', {token:req.query.token, message: 'Rota não existente na WhiteBoardAPI'})
      }
    })
  }
  else {
    res.render('error', {token:req.query.token, message: 'Formato de ID inválido'})
  }
});

module.exports = router;