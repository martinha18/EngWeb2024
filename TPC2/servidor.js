var http = require('http');
var fs = require('fs');
var url = require('url');

http.createServer(function(req,res){
    var regex1 = /^\/cidades\/(c\d+)$/
    var regex2 = /^\/ligacoes\/(l\d+)$/
    q = url.parse(req.url, true)
    if(q.pathname == '/'){
        fs.readFile('/home/marta/Desktop/Marta/EW/EngWeb2024/TPC2/paginasHTML/principal.html', function(erro, dados){
            res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
            res.write(dados)
            res.end()
        })
    }
    else if(q.pathname == '/cidades'){
        fs.readFile('./paginasHTML/cidades.html', function(erro, dados){
            res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
            res.write(dados)
            res.end()
        })
    }
    else if(q.pathname == '/ligacoes'){
        fs.readFile('./paginasHTML/ligacoes.html', function(erro, dados){
            res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
            res.write(dados)
            res.end()
        })
    }
    else if(regex1.test(q.pathname)){
        let resultado = regex1.exec(q.pathname);
        fs.readFile('./paginasHTML/'+resultado[1]+'.html', function(erro, dados){
            res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
            res.write(dados)
            res.end()
        })
    }
    else if(regex2.test(q.pathname)){
        let resultado = regex2.exec(q.pathname);
        fs.readFile('./paginasHTML/'+resultado[1]+'.html', function(erro, dados){
            res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
            res.write(dados)
            res.end()
        })
    }
    else if(q.pathname == '/w3.css'){
        fs.readFile('w3.css', function(erro, dados) {
            res.writeHead(200, {'Content-Type': 'text/css'})
            res.write(dados)
            res.end()
        })
    }
    else {
        res.writeHead(400,{'Content-Type': 'text/html; charset=utf-8'})
        res.write('<p>Erro: pedido não suportado</p>')
        res.write('<pre>' + q.pathname + '</pre>')
        res.end()
    }
    console.log(q.pathname)
}).listen(7777);