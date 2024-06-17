var express = require('express');
var router = express.Router();
var Aluno = require('../controllers/aluno');
var auth = require("../auth/auth")
var fs = require('fs');
var multer = require('multer');
const upload = multer({ dest: 'uploads/' });


router.get('/', function(req, res) {
    auth.verifyToken(req.query.userID, req.query.token)
    .then(function(response){
        if (!response){
            res.status(401).jsonp({message: 'Realize a Autenticação'})
        }
        else{
            Aluno.find()
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

router.post('/', upload.single('foto'), function(req, res){
    auth.verifyToken(req.query.userID, req.query.token)
    .then(function(response){
        if (!response){
            res.status(401).jsonp({message: 'Realize a Autenticação'})
        }
        else{
            var aluno = {
                _id : req.body._id,
                nome: req.body.nome,
                foto: req.body._id + '.' + req.file.mimetype.split('/')[1],
                email: req.body.email,
                curso: req.body.curso,
                password: req.body.password,
                token: ""
            };
            Aluno.insert(aluno)
            .then(data => {
                let oldPath = __dirname + '/../' + req.file.path;
                let newPath = __dirname + '/../FileStore/' + aluno._id + "." + req.file.mimetype.split('/')[1];
                fs.rename(oldPath, newPath, function(error){
                    if(error) throw error;
                    res.jsonp(data); 
                });
            })
            .catch(erro => res.status(422).jsonp(erro));
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
            Aluno.findById(req.params.id)
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

router.put('/:id', upload.single('foto'), async function(req, res) {
    auth.verifyToken(req.query.userID, req.query.token)
    .then(async function(response){
        if (!response){
            res.status(401).jsonp({message: 'Realize a Autenticação'})
        }
        else{
            try {
                // Fetch the existing Aluno by ID
                let oldAluno = await Aluno.findById(req.params.id);
          
                // If no oldAluno found, return an error
                if (!oldAluno) {
                    return res.status(404).json({ error: "Aluno não encontrado" });
                }
          
                // Determine the new file name if a new file is uploaded
                if (req.file) var newFileName = req.params.id + '.' + req.file.mimetype.split('/')[1]
                else newFileName = oldAluno.foto;
          
                // Construct the new aluno object
                const aluno = {
                    _id: req.body._id || oldAluno._id,
                    nome: req.body.nome || oldAluno.nome,
                    foto: newFileName,
                    email: req.body.email || oldAluno.email,
                    curso: req.body.curso || oldAluno.curso,
                    password: req.body.password || oldAluno.password
                };
          
                // Example: Save updated aluno to the database
                Aluno.update(req.params.id, aluno)
                .then(function(){
                  if (req.file) {
                    // Delete the old photo
                    let oldPath = __dirname + '/../FileStore/' + oldAluno.foto;
                    fs.unlink(oldPath, function(error) {
                        if (error) console.error('Erro ao eliminar o ficheiro antigo:', error);
                    });
              
                    // Set new photo
                    let newFilePath = __dirname + '/../FileStore/' + aluno.foto;
                    fs.rename(__dirname + '/../' + req.file.path, newFilePath, function(error) {
                      if (error) throw error;
                    });
                  }
                  res.jsonp(aluno);
                })
                .catch(function(erro){
                  res.jsonp(erro)
                })
            } 
            catch (err) {
                console.error(err);
                res.status(500).json({ error: "Não foi  possível atualizar as informações do aluno" });
            }  
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
            const alunoId = req.params.id;

            try {
                const aluno = await Aluno.findById(alunoId);
        
                if (!aluno) {
                    return res.status(404).jsonp({ error: 'Aluno not found' });
                }
        
                // Delete the file associated with the aluno
                const filePath = __dirname + '/../FileStore/' + aluno.foto;
                fs.unlink(filePath, async function(error) {
                    if (error) {
                        // Handle the error if the file does not exist
                        console.error('File deletion error:', error);
                        return res.status(500).jsonp({ error: 'File deletion error' });
                    }
        
                    // Delete the aluno record from the database
                    try {
                        await Aluno.delete({ _id: alunoId });
                        return res.jsonp({ message: 'Aluno deleted successfully' });
                    } catch (err) {
                        return res.status(500).jsonp({ error: 'Database deletion error' });
                    }
                });
            } catch (err) {
                return res.status(500).jsonp({ error: 'Database find error' });
            }        
        }
    })
    .catch(function(){
      res.status(401).jsonp({message: 'Realize a Autenticação'})
    })
});

router.get('/:id/autenticar', function(req, res) {
    auth.authenticateUser(req.params.id, req.query.password, "Aluno")
    .then(function(data){
        res.jsonp(data);
    })
    .catch(function(erro){
        res.status(500).jsonp({error: erro.message})  
    });
});

module.exports = router;