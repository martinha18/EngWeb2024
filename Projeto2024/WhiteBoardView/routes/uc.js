var express = require('express');
var router = express.Router();
var axios = require('axios');

router.get('/:id/aluno/:idAluno', function(req, res) {
    axios.get('http://WhiteBoardAPI:10000/ucs/' + req.params.id+"?userID="+req.params.idAluno+"&token="+global.tokens[req.params.idAluno])
    .then(function(response){
        const uc = response.data;

        if (uc.alunos.includes(String(req.params.idAluno))) {

            var listaNomesProfessores = [];

            // Loop através dos docentes da UC
            for (var i = 0; i < uc.docentes.length; i++) {
                
                // Faz a solicitação para obter o nome do professor
                axios.get('http://WhiteBoardAPI:10000/docentes/' + uc.docentes[i]+"?userID="+req.params.idAluno+"&token="+global.tokens[req.params.idAluno])
                .then(function(responseProfessores){
                    listaNomesProfessores.push(responseProfessores.data.nome);
                    
                    // Verifica se todos os nomes dos professores foram obtidos
                    if (listaNomesProfessores.length === uc.docentes.length) {
                        axios.get('http://WhiteBoardAPI:10000/alunos/' + req.params.idAluno+"?userID="+req.params.idAluno+"&token="+global.tokens[req.params.idAluno])
                        .then(function(response){
                            const user = response.data
                            res.render('informacoesUC', {uc: uc, user: user, idUser: req.params.idAluno, professores: listaNomesProfessores, docente: false});
                        })
                        .catch(function(erro){
                            if (erro.response && erro.response.status === 401) {
                                res.render('error', {token:req.query.token, message: erro.response.data.message});
                            } else {
                                res.render('error', {token:req.query.token, message: 'Aluno não existente'});
                            }
                        })
                    }
                })
                .catch(function(erro){
                    if (erro.response && erro.response.status === 401) {
                        res.render('error', {token:req.query.token, message: erro.response.data.message});
                    } else {
                        res.render('error', {token:req.query.token, message: 'Erro ao obter o nome do professor'});
                    }
                });
            }
        }
        else {
            res.render('error', {token:req.query.token, idUser: req.params.idAluno,  message: 'Aluno não inscrito na UC'});
        }
    })
    .catch(function(erro){
        if (erro.response && erro.response.status === 401) {
            res.render('error', {token:req.query.token, message: erro.response.data.message});
        } else {
            res.render('error', {token:req.query.token, idUser: req.params.idAluno,  message: 'Erro ao obter os dados da UC'});
        }
    });
});

router.get('/:id/docente/:idDocente', function(req, res) {
    axios.get('http://WhiteBoardAPI:10000/ucs/' + req.params.id+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente])
    .then(function(response){
        const uc = response.data;
        if (uc.docentes.includes(String(req.params.idDocente))) {

            var listaNomesProfessores = [];
            
            // Loop através dos docentes da UC
            for (var i = 0; i < uc.docentes.length; i++) {
                // Faz a solicitação para obter o nome do professor
                axios.get('http://WhiteBoardAPI:10000/docentes/' + uc.docentes[i]+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente])
                .then(function(responseProfessores){
                    listaNomesProfessores.push(responseProfessores.data.nome);
                    
                    // Verifica se todos os nomes dos professores foram obtidos
                    if (listaNomesProfessores.length === uc.docentes.length) {
                        axios.get('http://WhiteBoardAPI:10000/docentes/' + req.params.idDocente+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente])
                        .then(function(response){
                            const user = response.data
                            res.render('informacoesUC', {uc: uc, user: user, idUser: req.params.idDocente, professores: listaNomesProfessores, docente: true});
                        })
                        .catch(function(erro){
                            if (erro.response && erro.response.status === 401) {
                                res.render('error', {token:req.query.token, message: erro.response.data.message});
                            } else {
                                res.render('error', {token:req.query.token, message: 'Docente não existente'});
                            }
                        })
                    }
                })
                .catch(function(erro){
                    if (erro.response && erro.response.status === 401) {
                        res.render('error', {token:req.query.token, message: erro.response.data.message});
                    } else {
                       res.render('error', {token:req.query.token, message: 'Erro ao obter o nome do professor'});
                    }
                });
            }
        }
        else {
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,  message: 'Docente não inscrito na UC'});
        }
    })
    .catch(function(erro){
        if (erro.response && erro.response.status === 401) {
            res.render('error', {token:req.query.token, message: erro.response.data.message});
        } else {
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,   message: 'Erro ao obter os dados da UC'});
        }
    });
});

router.get('/:id/docente/:idDocente/editar', function(req, res){
    axios.get('http://WhiteBoardAPI:10000/ucs/' + req.params.id+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente])
    .then(function(response) {
        const uc = response.data;
        if (uc.docentes.includes(String(req.params.idDocente))) {
            axios.get('http://WhiteBoardAPI:10000/docentes/' + req.params.idDocente+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente])
            .then(function(resposta){
                res.render('editarUC', {docente: resposta.data, idDocente: req.params.idDocente, uc: uc});
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
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,  message: 'Docente não inscrito na UC'});
        }

    })
    .catch(function(erro){
        if (erro.response && erro.response.status === 401) {
            res.render('error', {token:req.query.token, message: erro.response.data.message});
        } else {
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,   message: 'Erro ao obter os dados da UC'});
        }
    });
})

router.post('/:id/docente/:idDocente/editar', function(req, res){
    axios.get('http://WhiteBoardAPI:10000/ucs/' + req.params.id+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente])
    .then(function(response) {
        const uc = response.data;
        if (uc.docentes.includes(String(req.params.idDocente))) {
            const novaAula = {
                horario: {
                    teoricas: req.body.horarioTeorico.split('\n').map(horario => horario.trim()).filter(horario => horario !== ''),
                    praticas: req.body.horarioPratico.split('\n').map(horario => horario.trim()).filter(horario => horario !== '')
                },
                avaliacao: req.body.avaliacao.split('\n'),
                datas: {
                    teste: req.body.dataTeste,
                    exame: req.body.dataExame,
                    projeto: req.body.dataProjeto
                },
            };
        
            axios.put('http://WhiteBoardAPI:10000/ucs/' + req.params.id+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente], novaAula)
            .then(function() {
                res.redirect("/ucs/"+req.params.id+"/docente/"+req.params.idDocente+"?token="+global.token)
            })
            .catch(function(erro) {
                if (erro.response && erro.response.status === 401) {
                    res.render('error', {token:req.query.token, message: erro.response.data.message});
                } else {
                    res.status(500).json({ error: 'Erro ao obter a UC' });
                }
            });
        }
        else {
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,  message: 'Docente não inscrito na UC'});
        }
    })
    .catch(function(erro){
        if (erro.response && erro.response.status === 401) {
            res.render('error', {token:req.query.token, message: erro.response.data.message});
        } else {
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,   message: 'Erro ao obter os dados da UC'});
        }
    });
});

router.get('/:id/docente/:idDocente/notas', function(req, res) {
    axios.get('http://WhiteBoardAPI:10000/ucs/' + req.params.id+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente])
    .then(function(response){
        const uc = response.data;
        if (uc.docentes.includes(String(req.params.idDocente))) {
            axios.get('http://WhiteBoardAPI:10000/docentes/' + req.params.idDocente+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente])
            .then(function(resposta){
                res.render('verNotasDocente', {uc: uc, docente: resposta.data, idAluno: req.params.idDocente, idUC: req.params.id});
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
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,  message: 'Docente não inscrito na UC'});
        }
    })
    .catch(function(erro){
        if (erro.response && erro.response.status === 401) {
            res.render('error', {token:req.query.token, message: erro.response.data.message});
        } else {
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,   message: 'Erro ao obter os dados da UC'});
        }
    });
});

router.get('/:id/docente/:idDocente/modificarNotas', function(req, res) {
    axios.get('http://WhiteBoardAPI:10000/ucs/' + req.params.id+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente])
    .then(function(response){
        const uc = response.data;
        if (uc.docentes.includes(String(req.params.idDocente))) {
            axios.get('http://WhiteBoardAPI:10000/docentes/' + req.params.idDocente+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente])
            .then(function(resposta){
                res.render('modificarNotas', {uc: uc, docente: resposta.data, idDocente: req.params.idDocente, idUC: req.params.id});
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
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,  message: 'Docente não inscrito na UC'});
        }

    })
    .catch(function(erro){
        if (erro.response && erro.response.status === 401) {
            res.render('error', {token:req.query.token, message: erro.response.data.message});
        } else {
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,   message: 'Erro ao obter os dados da UC'});
        }
    });
});

router.post('/:id/docente/:idDocente/modificarNotas', function(req, res) {
    axios.get('http://WhiteBoardAPI:10000/ucs/' + req.params.id+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente])
    .then(function(response) {
        const uc = response.data;
        if (uc.docentes.includes(String(req.params.idDocente))) {
            const formType = req.body.formType;

            if (formType === "form1") {
                const notas = req.body;
                const notasPorAluno = {}; // objeto para armazenar as notas por aluno

                for (const key in notas) {
                    // Divide a chave para obter o tipo de nota e o aluno
                    const [notaTipo, aluno] = key.split('-');

                    // Se a chave não estiver bem formada, pule para a próxima iteração
                    if (!notaTipo || !aluno) {
                        continue;
                    }

                    // Se não houver uma entrada para o aluno, criar
                    if (!notasPorAluno[aluno]) {
                        notasPorAluno[aluno] = { aluno };
                    }

                    switch (notaTipo) {
                        case 'notaTeste':
                            notasPorAluno[aluno]['teste'] = notas[key];
                            break;
                        case 'notaExame':
                            notasPorAluno[aluno]['exame'] = notas[key];
                            break;
                        case 'notaProjeto':
                            notasPorAluno[aluno]['projeto'] = notas[key];
                            break;
                    }
                }

                // Converta o objeto de notas por aluno em uma lista de notas
                const listaDeNotas = Object.values(notasPorAluno);

                const notasNovas = {
                    notas: listaDeNotas
                };

                axios.put('http://WhiteBoardAPI:10000/ucs/' + req.params.id+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente], notasNovas)
                .then(function() {
                    res.redirect("/ucs/" + req.params.id + "/docente/" + req.params.idDocente+"?token="+req.query.token);
                })
                .catch(function(erro) {
                    if (erro.response && erro.response.status === 401) {
                        res.render('error', {token:req.query.token, message: erro.response.data.message});
                    } else {
                        res.status(500).json({ error: 'Erro ao atualizar a UC' });
                    }
                });
            } else if (formType === "form2") {
                res.redirect(`/ucs/${req.params.id}/docente/${req.params.idDocente}/modificarNotas/aluno/${req.body.studentIdInput}?token=${req.query.token}`);
            } else {
                res.status(400).json({ error: 'Formulário desconhecido' });
            }
        }
        else {
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,  message: 'Docente não inscrito na UC'});
        }
    })
    .catch(function(erro){
        if (erro.response && erro.response.status === 401) {
            res.render('error', {token:req.query.token, message: erro.response.data.message});
        } else {
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,   message: 'Erro ao obter os dados da UC'});
        }
    });
});

router.get('/:id/docente/:idDocente/modificarNotas/aluno/:idAluno', function(req, res) {
    axios.get('http://WhiteBoardAPI:10000/ucs/' + req.params.id+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente])
    .then(function(response) {
        const uc = response.data;
        if (uc.docentes.includes(String(req.params.idDocente))) {
            axios.get('http://WhiteBoardAPI:10000/ucs/' + req.params.id+'/nota/aluno/'+req.params.idAluno+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente])
            .then(function(response){
                const notas = response.data[0];
                if (notas != undefined){
                    const token = req.query.token;
                    res.render('modificarNotasAluno', {notas: notas, uc:req.params.id, aluno: req.params.idAluno, docente:req.params.idDocente, token:token});
                }else{
                    res.render('error', {token:req.query.token, message: 'ID de aluno inválido', idUC:req.params.id, idUser:req.params.idDocente,token:req.query.token});
                }
            })
            .catch(function(erro){
                if (erro.response && erro.response.status === 401) {
                    res.render('error', {token:req.query.token, message: erro.response.data.message});
                } else {
                    res.render('error', {token:req.query.token, idUser: req.params.idDocente,   message: 'Erro ao obter os dados da UC'});
                }
            });
        }
        else {
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,  message: 'Docente não inscrito na UC'});
        }
    })
    .catch(function(erro){
        if (erro.response && erro.response.status === 401) {
            res.render('error', {token:req.query.token, message: erro.response.data.message});
        } else {
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,   message: 'Erro ao obter os dados da UC'});
        }
    });
})

router.post('/:id/docente/:idDocente/modificarNotas/aluno/:idAluno', function(req, res) {
    axios.get('http://WhiteBoardAPI:10000/ucs/' + req.params.id+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente])
    .then(function(response){
        const uc = response.data;
        if (uc.docentes.includes(String(req.params.idDocente))) {
            let notas = response.data.notas
            notas = notas.filter(nota => nota.aluno !== req.params.idAluno);

            const notasAlunoX = req.body;
            const notasNovas = {
                aluno: req.params.idAluno,
                teste: notasAlunoX[`notaTeste`],
                exame: notasAlunoX[`notaExame`],
                projeto: notasAlunoX[`notaProjeto`]
            };

            notas.push(notasNovas)

            const notasNovasFinais = {
                notas: notas
            }

            axios.put('http://WhiteBoardAPI:10000/ucs/' + req.params.id+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente], notasNovasFinais)
            .then(function(){
                res.redirect(`/ucs/${req.params.id}/docente/${req.params.idDocente}/modificarNotas?token=${req.query.token}`);
            })
            .catch(function(erro){
                if (erro.response && erro.response.status === 401) {
                    res.render('error', {token:req.query.token, message: erro.response.data.message});
                } else {
                    res.render('error', {token:req.query.token, idUser: req.params.idDocente,   message: 'Erro ao obter os dados da UC'});
                }
            });
        }
        else {
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,  message: 'Docente não inscrito na UC'});
        }

    })
    .catch(function(erro){
        if (erro.response && erro.response.status === 401) {
            res.render('error', {token:req.query.token, message: erro.response.data.message});
        } else {
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,   message: 'Erro ao obter os dados da UC'});
        }
    });

})

router.get('/:id/docente/:idDocente/adicionarAula', function(req, res) {
    axios.get('http://WhiteBoardAPI:10000/ucs/' + req.params.id+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente])
    .then(function(response) {
        const uc = response.data;
        if (uc.docentes.includes(String(req.params.idDocente))) {
            axios.get('http://WhiteBoardAPI:10000/docentes/' + req.params.idDocente+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente])
            .then(function(resposta){
                const idUC = req.params.id;
                res.render('novaAula', {docente: resposta.data, idUC: idUC, idDocente: req.params.idDocente});
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
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,  message: 'Docente não inscrito na UC'});
        }
    })
    .catch(function(erro){
        if (erro.response && erro.response.status === 401) {
            res.render('error', {token:req.query.token, message: erro.response.data.message});
        } else {
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,   message: 'Erro ao obter os dados da UC'});
        }
    });
})

router.post('/:id/docente/:idDocente/adicionarAula', function(req, res) {
    axios.get('http://WhiteBoardAPI:10000/ucs/' + req.params.id+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente])
    .then(function(response) {
        const uc = response.data;
        if (uc.docentes.includes(String(req.params.idDocente))) {
            // Crie um novo objeto para representar a nova aula
            const novaAula = {
                _id: (uc.contaAulas + 1).toString(),
                tipo: req.body.tipo,
                data: req.body.data,
                sumario: req.body.topicos.split('\n')
            };
    
            uc.aulas.push(novaAula);
    
            uc.contaAulas = uc.contaAulas + 1
    
            axios.put('http://WhiteBoardAPI:10000/ucs/' + req.params.id+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente], uc)
            .then(function() {
                res.redirect("/ucs/"+req.params.id+"/docente/"+req.params.idDocente+"?token="+req.query.token)
            })
            .catch(function(erro) {
                if (erro.response && erro.response.status === 401) {
                    res.render('error', {token:req.query.token, message: erro.response.data.message});
                } else {
                   res.status(500).json({ error: 'Erro ao atualizar a UC' });
                }
            });
        }
        else {
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,  message: 'Docente não inscrito na UC'});
        }
    })
    .catch(function(erro){
        if (erro.response && erro.response.status === 401) {
            res.render('error', {token:req.query.token, message: erro.response.data.message});
        } else {
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,   message: 'Erro ao obter os dados da UC'});
        }
    });
});

router.post('/:id/docente/:idDocente/eliminarAula/:idAula', function(req, res){
    axios.get('http://WhiteBoardAPI:10000/ucs/' + req.params.id+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente])
    .then(function(response) {
        const uc = response.data;
        if (uc.docentes.includes(String(req.params.idDocente))) {
            axios.delete("http://WhiteBoardAPI:10000/ucs/" + req.params.id + "/aula/" + req.params.idAula+"?userID="+req.params.idDocente+"&token="+global.tokens[req.params.idDocente])
            .then(function() {
                res.redirect("/ucs/"+req.params.id+"/docente/"+req.params.idDocente+"?token="+global.token)
            })
            .catch(function(erro) {
                if (erro.response && erro.response.status === 401) {
                    res.render('error', {token:req.query.token, message: erro.response.data.message});
                } else {
                    res.status(500).json({ error: 'Erro ao eliminar aula' });
                }
            });
        }
        else {
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,  message: 'Docente não inscrito na UC'});
        }
    })
    .catch(function(erro){
        if (erro.response && erro.response.status === 401) {
            res.render('error', {token:req.query.token, message: erro.response.data.message});
        } else {
            res.render('error', {token:req.query.token, idUser: req.params.idDocente,   message: 'Erro ao obter os dados da UC'});
        }
    });
});

module.exports = router;