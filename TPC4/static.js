/*
    Module Static - to serve static resources in public folder
    Exports: 
        Bool staticResource(request) - tells if someone is asking a static resource
        Data serveStaticResource(req, res) - returns the resource
*/

var fs = require('fs')

function staticResource(request){
    return /\/w3.css$/.test(request.url)
}

exports.staticResource = staticResource

function serveStaticResource(req, res){
    var partes = req.url.split('/')
    var file = partes[partes.length -1 ]
    fs.readFile(file, (erro, dados)=>{
        if(erro){
            console.log('Erro: ficheiro nÃ£o encontrado ' + erro)
            res.statusCode = 404
            res.end('Erro: ficheiro nÃ£o encontrado ' + erro)
        }
        else{
            if(file == 'w3.css'){
                res.setHeader('Content-Type', 'text/css')
                res.end(dados)
            }
        }
    })
}

exports.serveStaticResource = serveStaticResource