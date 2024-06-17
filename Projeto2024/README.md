# Relatório do trabalho de Engenharia Web 2024
Trabalho escolhido:
- Proposta 5: Gerador de websites para UC

Equipa:
- CRUDers

Membros:
- Ema Maria Monteiro Martins (A97678)
- Henrique Nuno Marinho Malheiro (A97455)
- Marta Sofia Matos Castela Queirós Gonçalves (A100593)


# Introdução
Para este projeto decidimos implementar a WhiteBoard, uma plataforma inspirada na BlackBoard que conta com um processo de autenticação de alunos e docentes, dando-lhes depois acesso a informações sobre as Unidades Curriculares em que estão inscritos. Os docentes de cada UC conseguem alterar as informações acerca da mesma ou acrescentar conteúdo novo, como as aulas ou as notas dos alunos. Os alunos podem consultar as suas notas e as informações disponibilizadas nas UCs em que estão inscritos. Temos ainda os administradores que têm acesso a todos os dados, sendo capazes de proceder à sua importação e respetiva exportação.

# Importação de dados 

A importação de dados é feita através de um script python `WhiteBoardImport.py` por um administrador. Para isso espera-se ter uma pasta (data) que pode conter os ficheiros `alunos.json`, `docentes.json`, `ucs.json`. É ainda necessária a existência de um ficheiro `admins.json` nessa diretoria. As imagens necessárias devem estar guardadas numa pasta images na diretoria data.

O script formulado tenta realizar o POST ou PUT das informações, utilizando para isso o token de um dos administradores presentes no respetivo ficheiro após realizar diversas verificações:

- Ids dos alunos começam por 'a', dos docentes começam por 'd' e dos administradores por 'admin' já que é um critério utilizado na implementação para distinguir alunos, docentes e administradores;

- Estrutura json válida, percebendo-se se a estrutura recebida corresponde a uma entrada completa daquele tipo, a uma entrada parcial ou se não está de acordo com as informações pretendidas. Para isso utilizam-se sets de chaves obrigatórias e opcionais tentando-se perceber se as informações correspondem ou não ao que era esperado;

- O parâmetro foto, existindo, tem uma correspondência com esse nome na pasta images.

Após todas estas verificações tenta-se fazer um POST no caso de a entrada ser completa (podendo ser seguido de um PUT caso a entrada já exista) ou um PUT caso a entrada seja apenas parcial, de forma a substituir parte da informação já existente pois damos prioridade à informação importada sobre a que já se encontra no WhiteBoardMongo.

O script dá ainda algum feedback sobre a importação e possíveis erros que possam ter ocorrido, permitindo ao administrador identificar os problemas e corrigi-los mais facilmente se necessário.

# Exportação de dados

A exportação dos dados é feita através do script python `WhiteBoardExport.py`. Este após a autenticação de um admin, faz pedidos à api de modo a obter todos as informações sobre os admins, ucs, docentes e alunos para as guardar nos ficheiros `.json` respetivos, bem como as imagens dos alunos e dos docentes numa pasta images, originando uma pasta dataExport com todas as informações necessárias e uma organização idêntica à pasta necessária à importação dos dados, facilitando um posterior processo de importação desses dados.

# Mongo
A base de dados usada no nosso trabalho foi o mongodb. Nela construímos a **base de dados** denominada **WhiteBoard**, que é composta por **cinco coleções**, sendo estas a colecção **docentes**, a coleção **alunos**, a coleção **ucs**(unidades curriculares), a coleção **admins**(administradores) e a coleção **tokens**(usada na autenticação).

# WhiteBoardAPI
Esta aplicação é responsável por realizar pedidos à base de dados e as colocar disponíveis para posterior solicitação por parte da **WhiteBoardView**.

A nossa API de dados (WhiteBoardAPI) conecta-se à base de dados WhiteBoard do container WhiteBoardMongo através do mongoose.

A aplicação fica disponível na **porta 10000**.

---
### Models
O nosso trabalho contém cinco **models**, sendo eles o model do **aluno**, do **docente** da **uc**, do **token** e o do **admin**.

O model do aluno contém o **alunoSchema** que representa a informação relativa a um aluno.

| Atributo | Tipo    |
|----------|---------|
| _id      | String  |
| nome     | String  |
| foto     | String  |
| email    | String  |
| curso    | String  |
| password | String  |
| token    | String  |


O model do docente contém o **docenteSchema** que representa a informação relativa a um docente. A categoria representa a profissão do docente enquanto que a filiação relaciona o docente ao departamento em que executa as suas funções.

| Atributo  | Tipo    |
|-----------|---------|
| _id       | String  |
| nome      | String  |
| foto      | String  |
| categoria | String  |
| filiacao  | String  |
| email     | String  |
| webpage   | String  |
| password  | String  |
| token     | String  |

O model da uc é constituído pelo schema base **ucSchema**, o **horarioSchema**, o **dataSchema**, o **aulaSchema** e o **notaSchema**.

O ucSchema é o schema que pretende representar do que é composto os dados de uma UC.

| Atributo   | Tipo                     |
|------------|--------------------------|
| _id        | String                   |
| codUC      | String                   |
| título     | String                   |
| docentes   | Lista de Strings         |
| alunos     | Lista de Strings         |
| horario    | horarioSchema            |
| avaliação  | Lista de Strings         |
| datas      | dataSchema               |
| contaAulas | Número                   |
| aulas      | Lista de aulaSchema      |
| notas      | Lista de notaSchema      |

O horarioSchema é usado para reter informações relativas às aulas teóricas e práticas, como a hora e o local onde se realizarão as mesmas.

| Atributo  | Tipo              |
|-----------|-------------------|
| teoricas  | Lista de Strings  |
| práticas  | Lista de Strings  |

O aulaSchema pretende dar informações relativamente às aulas. O tipo representa se a aula é teórica, prática ou laboratorial, a data corresponde à data em que a aula se realizou. Contém ainda um sumário sobre a aula selecionada.


| Atributo  | Tipo             |
|-----------|------------------|
| _id       | String           |
| tipo      | String           |
| data      | String           |
| sumario   | Lista de Strings |

O dataSchema representa quando os diferentes elementos de avaliação estão marcados para serem realizados.

| Atributo  | Tipo    |
|-----------|---------|
| teste     | String  |
| exame     | String  |
| projeto   | String  |

O notaSchema pretende relacionar o aluno com os diferentes elementos de avaliação que constituirão as partes que o avaliarão.

| Atributo | Tipo   |
|----------|--------|
| aluno    | String |
| teste    | String |
| exame    | String |
| projeto  | String |

O model token contém o **tokenSchema** que representa como um token é constituído.

| Atributo  | Tipo          | Descrição                                      |
|-----------|---------------|------------------------------------------------|
| token     | String        | Obrigatório                                    |
| userId    | String        | Obrigatório                                    |
| userType  | String        | Enum: ['Docente', 'Aluno', 'Admin'], Obrigatório        |
| createdAt | Date          | Default: Date.now, Expira em 1 dia             |

Por fim, o model admins apresenta o **admin** com as informações acerca do administrador

| Atributo | Tipo    |
|----------|---------|
| _id      | String  |
| password | String  |
| token    | String  |

Os dados estão no formato jsonArray de forma a serem importados para o mongo, sendo que as fotos são guardadas nestes modelos apenas através de uma string que corresponde ao nome do ficheiro. Optamos por guardar as imagens com um nome que corresponde ao identificador do utilizador seguido do mimetype da imagem de forma a garantir que não aparecem imagens com nomes repetidos. As imagens em si são guardadas na pasta FileStore e através do nome conseguimos acesso às mesmas.

---

### Controllers 

Existem quatro controllers, sendo eles o **aluno**, **docente**, **uc** e **admin**, que farão queries à base de dados.

O controller do aluno contém as seguintes funções:

- **find:** Devolve uma lista com todos os alunos da base de dados.

- **findByID:** Devolve o aluno com o id passado como argumento.

- **insert:** Insere um aluno na base de dados.

- **update:** Atualiza o aluno cujo id foi passado como argumento, na base de dados, como os dados atualizados passados por argumento.

- **delete:** Dado um id, elimina o aluno com essa id.

- **insertToken:** Dado um token, associa o token ao id passado como argumento, armazenando-o na base de dados.

O controller do docente e admin contêm as mesmas funções que o controller do aluno, sendo apenas relativo ao docente/admin ao invés do aluno

O controller da UC contém as funções apresentadas no controller do aluno, à exceção da função insertToken já que não há autenticação no caso das UCs. Estas foram ajustadas para serem relativas às UCs. Contém ainda as seguintes funções:

- **findGradesByID:** Dado o id de um aluno, devolve as notas do mesmo a todas as UCs em que está inscrito.

- **findGradesByIDAndUC:** Dado o id de um aluno e o id de uma UC, devolve as notas do aluno a essa UC.

- **deleteAula:** Dado o id da UC, remove da UC que contém esse id a aula que corresponde ao id da aula passado por argumento.

- **ucsAluno:** Dado o id do aluno, verifica em que UCS este se encontra inscrito.

- **ucsDocente:** Dado o id do docente, verifica em que UCS este se encontra inscrito.

- **addDocente:** Dado o id do docente, adiciona-o aos docentes da UC associada ao UC passado como argumento.

- **addAluno:** Dado o id do aluno, adiciona-o aos alunos da UC associada ao UC passado como argumento.

---
### Rotas

Para a nossa API optamos por usar 4 routers diferentes:

- ucRouter para rotas relacionadas com as UCs e começadas por /ucs

- alunoRouter para rotas relacionadas com os alunos e começadas por /alunos

- docenteRouter para rotas relacionadas com os docentes e começadas por /docentes

- adminRouter para rotas relacionadas com os administradores e começadas por /admins

Todos estes routers têm em comum os seguintes pedidos para as rotas especificadas e que utilizam diferentes funções dos respetivos controllers. Na maioria dos casos, o procedimento nestes pedidos é verificar a autenticação, chamar a função correspondente e verificar se foi executada sem erros.

| Tipo   | Rota               | Função      |
|--------|--------------------|-------------|
| GET    | /                  | find        |
| POST   | /                  | insert      |
| GET    | /:id               | findByID    |
| PUT    | /:id               | update      |
| DELETE | /:id               | delete      |
| GET    | /:id/autenticar    | insertToken |

Note-se que o último pedido desta tabela não se aplica no caso das UCs pois estas não necessitam de autenticação.

Além disso, no caso dos alunos e dos docentes os POST, PUT e DELETE têm a particularidade de envolver o tratamento de ficheiros pois possuem uma foto. O POST atribui à imagem o nome do id do utilizador e guarda-a na FileStore, deixando o seu nome guardado nas informações do utilizador, o PUT verifica a existência de um ficheiro e procede da mesma forma, e o delete utiliza o nome que está guardado para eliminar a foto além de eliminar o utilizador em si.

As UCs, apresentam ainda os seguintes pedidos:

| Tipo   | Rota                              | Função              |
|--------|-----------------------------------|---------------------|
| GET    | /aluno/:id                        | ucsAluno            |
| GET    | /docente/:id                      | ucsDocente          |
| PUT    | /addDocente/:idUC/:idDocente      | addDocente          |
| PUT    | /addAluno/:idUC/:idAluno          | addAluno            |
| DELETE | /:id/aula/:idAula                 | deleteAula          |
| GET    | /notas/aluno/:idAluno             | findGradesByID      |
| GET    | /:id/nota/aluno/:idAluno          | findGradesByIDAndUC |

### Autenticação 

Para realizar a autenticação dos diversos utilizador possíveis (admins, alunos e docentes) ao WhiteBoardAPI, recorreu-se à autenticação por tokens (usando o **jsonwebtoken**).

Assim, na rota /:id/autenticar dos admins, alunos e docentes, há a criação (aleatória) do token, bem como a sua assinatura (para garantir uma maior segurança), isto se a password fornecida na query string for a correta.
O token gerado é então enviado como resposta ao utilizador que enviou o pedido.

Todas as restantes rotas do WhiteBoardAPI, ficam então condicionadas ao fornecimento na query string do **userID** e **token** do mesmo, sendo o pedido unicamente realizado caso o token fornecido corresponda ao token gerado aquando da sua última autenticação. Caso contrário, será enviada uma mensagem de erro a solicitar que o utilizador realize a sua autenticação.

# WhiteBoardView
Esta aplicação é responsável por realizar pedidos à WhiteBoardAPI e disponibiliza os resultados a partir de uma interface. Essa aplicação pode ser acedida na **porta 10001**.

---

### Views
O **layout** apresenta as configurações base das diversas páginas que se seguem.

O **login** apresenta ao utilizador 2 caixas de texto onde devem ser colocados o identificador do aluno ou docente e a sua palavra-passe, para que o utilizador se possa autenticar. Após se autenticar, o utilizador será reencaminhado para a página inicial.

A **paginaInicial** exibe ao utilizador todas as UCs em que está inscrito. Quando clicar numa UC, o utilizador é redirecionado para a página dessa UC. Caso o utilizador clique na sua foto, que é apresentada no canto superior direito, então será direcionado para o seu perfil.

A **perfil** exibe as informações do utilizador como a sua foto, o seu nome, email... As informações são ajustadas consoante o utilizador é um docente ou aluno, pois estes contém informações diferentes. Esta página contém um botão que redireciona o utilizador para uma página onde se poderá registar em UCS e outro botão que redireciona o utilizador para um página onde pode modificar as suas informações. No caso de ser um aluno, será ainda exibido outro botão, que encaminhá-lo-á para uma página onde poderá ver as suas notas. É apresentado um botão que permite ao utilizador sair da aplicação, direcionando-o para a página de login. Existe ainda um botão que permite o utilizador retroceder, voltando para a página inicial.

A **alunoVerNotas** exibe ao aluno as notas que este teve às diferentes UCS a que está inscrito. Existe um botão que permite ao aluno retroceder, voltando para o perfil.

A **increverUC** pede ao utilizador que introduza o identificador e o código da UC. Se as informações foram introduzidas corretamente, o utilizador será reencaminhado para o perfil. Caso as informações dadas estejam erradas, então o utilizador é reencaminhado para uma página em que lhe será exibido o erro que ocorreu. Existe ainda um botão que permite ao utilizador retroceder, voltando para o perfil.

A **editarPerfil** exibe as informações atuais do utilizador, permitindo alterá-las. Existe um botão para o utilizador submeter as alterações realizadas ao seu perfil. Existe ainda um botão que permite o utilizador retroceder e, assim, voltar ao seu perfil.

A **InformacaoesUC** exibe as informações relativas a uma UC (como as datas dos teste, horas das aulas...) e as informações relativas às diversas aulas. No caso do docente, existem quatro botões adicionais, um que permite editar as informações gerais da UC, outro que redireciona o docente para uma página onde poderá visualizar as notas dos seus alunos, outra em que permite dar notas aos alunos e um último que permite adicionar aulas. Existe ainda um botão que permite o utilizador retroceder, voltando à página principal.

A **editarPerfil** exibe as informações atuais UC, permitindo alterá-las. Existe um botão para o docente submeter as alterações realizadas a esta UC. Existe ainda um botão que permite ao docente retroceder e, assim, voltar à página da UC.

A **novaAula** permite ao docente adicionar uma aula. Para tal, tem de preencher o tipo, a data e p sumário da aula para a poder submeter. Existe assim um botão para submeter a aula. Existe ainda um botão que permite o docente voltar à página da UC.

A **verNotasDocentes** apresenta ao docente as notas de todos os alunos aos diferentes elementos de avaliação e apresenta ainda algumas informações relativas às notas, como a média, a percentagem de reprovados e a percentagem de alunos que ainda não foram avaliados a cada um dos elementos de avaliação. Apresenta um botão que permite que o docente volte à página da UC.

A **modificarNotas** apresenta ao docente todos os campos das notas dos alunos, para que possam introduzir notas ou as modificar. Existe uma barra de pesquisa que permite que o docente pesquise por um aluno. Caso o aluno exista, o docente é reencaminhado para uma página onde apenas serão exibidas as informações desse aluno. Caso o aluno não exista, o docente é reencaminhado para uma página que lhe informa que o aluno não existe. Existe um botão que permite ao docente submeter as diversas notas que, quando clicado, redireciona-o para a página da UC e outro que permite ao docente voltar à página da UC.

A **modificarNotasAluno** exibe as notas do aluno, caso este as tenha, e permite ao docente modificar as mesmas ou adicioná-las. Existe um botão para o docente submeter as notas que quando clicado redireciona o docente para a página onde atribui as notas aos diversos alunos. Existe ainda um botão para que o utilizador possa retroceder, redirecionando-o para a mesma página.

A **error** é a página que é exibida quando algum erro ocorre. Essa página exibe o erro que ocorreu e contém um botão para que o utilizador possa voltar à página em que se encontrava.


### Rotas

Através dos routes, é possível associar a cada rota uma página que deve ser renderizada e fazer pedidos à API de modo a obter as informações necessárias à página. Estes pedidos são realizados através do axios.

À exceção da rota '/' que corresponde ao login, todas as rotas apresentam uma query token utilizada para confirmar a autenticação do utilizador.

Em caso de erro é renderizada a página `error` com uma mensagem a indicar o que pode ter corrido mal.

Neste caso, optamos por criar apenas 3 routers: inicio, perfil e ucs. Cada um apresenta as diversas rotas, às quais está associada uma página e uma determinada funcionalidade

O router inicio (inicioRouter) tem prefixo '/' e apresenta as seguintes rotas:
- / -> login, permite realizar a autenticação do utilizador
- /paginaInicial/:idDocente?token=tokenDocente -> paginaInicial, apresenta as unidades curriculares em que o docente está inscrito e a sua foto que o leve ao seu perfil;
- /paginaInicial/:idAluno?token=tokenAluno -> paginaInicial, apresenta as unidades curriculares em que o aluno está inscrito  e a sua foto que o leve ao seu perfil;

O router uc (ucRouter) tem prefixo '/ucs' e apresenta as seguintes rotas:
- /ucs/:idUC/aluno/:idAluno?token=tokenAluno -> informacoesUC, apresenta a UC com um certo id apenas para observação e com as aulas ordenadas da mais recente para a mais antiga;
- /ucs/:idUC/docente/:idDocente?token=tokenDocente -> informacoesUC, apresenta a UC com um certo id com opções de editar ou acrescentar novas informações e com as aulas ordenadas da mais recente para a mais antiga;
- /ucs/:idUC/docente/:idDocente/editar?token=tokenDocente -> editarUC, permite que o docente edite diferentes informações sobre a unidade curricular;
- /ucs/:idUC/docente/:idDocente/notas?token=tokenDocente -> verNotasDocente, permite que o docente consulte as notas dos alunos de uma determinada UC  
- /ucs/:idUC/docente/:idDocente/modificarNotas?token=tokenDocente -> modificarNotas, o docente consegue atribuir ou alterar as classificações dos alunos que aparecem ordenados alfabeticamente, ou selecionar um único aluno;
- /ucs/:id/docente/:idDocente/modificarNotas/aluno/:idAluno?token=tokenDocente -> modificarNotasAluno, permite atribuir ou alterar as classificações de um aluno em concreto;
- /ucs/:idUC/docente/:idDocente/adicionarAula?token=tokenDocente -> novaAula, o docente pode adicionar uma nova aula a uma determinada UC;
- /ucs/:idUC/docente/:idDocente/eliminarAula/:idAula?token=tokenDocente -> permite apenas eliminar uma aula, não levando a nenhuma página em concreto mas redirecionando para a página da uc;

O router perfil (perfilRouter) tem prefixo '/perfil' e apresenta as seguintes rotas:
- /perfil/:idUser?token=tokenUser -> perfil, o utilizador pode ver os dados que constam do seu perfil;
- /perfil/:idUser/editar?token=tokenUser -> editarPerfil, o utilizador consegue editar informações do seu perfil;
- /perfil/:idUser/inscreverUC?token=tokenUser -> inscreverUC, permite que um utilizador se inscreva numa UC utilizando o respetivo código;
- /perfil/:idAluno/notas?token=tokenUser -> alunoVerNotas, permite que o aluno consulte as suas notas;

# Docker

De modo a faciltar o processo de setup da aplicação, recorremos ao Docker. Assim, criamos um `Dockerfile` para a **WhiteBoardAPI**, um para a **WhiteBoardView** e outro para o **WhiteBoardImport** para serem instaladas as dependências necessárias antes de iniciar a aplicação e informar a porta em que cada uma delas está à escuta.

Elaboramos ainda o `docker-compose.yml` que realiza 4 serviços:

- **mongodb:** cria o container WhiteBoardMongo usando a imagem mongo onde ficará a nossa base de dados WhiteBoard e as respetivas coleções, estando exposta na porta 27027.

- **whiteboardapi:** cria o container WhiteBoardAPI onde vai correr a nossa API de dados na porta 10000. Esta depende do MongoDB.

- **whiteboardview:** cria o container WhiteBoardView onde ficará a aplicação que fornece uma interface para a API, dependendo desta. Esta estará exposta na porta 10001.

- **whiteboardimport:** cria o container WhiteBoardImport onde é corrido o script de importação no modo setup de forma a que os dados da pasta data sejam importados corretamente.

# Comandos para correr a aplicação

Para colocar a aplicação a correr, deve se executar o seguinte comando, dentro da pasta EW:
~~~
docker compose up --build -d
~~~

Para parar os containers e os remover automaticamente, basta correr o seguinte comando na pasta EW:
~~~
docker compose down
~~~

Para realizar a importação dos dados utiliza-se o comando a seguir apresentado:
~~~
python3 WhiteBoardImport.py <pastaData> import
~~~

Para realizar a exportação dos dados utiliza-se o comando a seguir apresentado:
~~~
python3 WhiteBoardExport.py <adminID> <adminPalavraPasse>
~~~

# Conclusão 
Este trabalho permitiu-nos interligar todos os conteúdos abordados na UC. 

Como resultado, desenvolvemos a WhiteBoard, uma aplicação completa que, do nosso ponto de vista, cumpriu todos os requisitos estabelecidos para o projeto, utilizando uma API para selecionar e alterar as informações das diferentes coleções da base de dados e uma interface para mostrar e recolher essas informações dos utilizadores, permitindo uma fácil navegação e várias funcionalidades de grande utilidade aos utilizadores.

Este projeto proporcionou-nos a oportunidade de trabalhar com JsonWebToken (JWT), destacando a importância da autenticação para adequar as funcionalidades da aplicação ao utilizador autenticado.

Além disso, permitiu-nos trabalhar com Docker, uma ferramenta amplamente utilizada no mercado de trabalho, sendo, portanto uma mais valia para nós saber usá-la. O Docker permitiu que todos os membros da equipa trabalhassem num ambiente de desenvolvimento idêntico, eliminando problemas de configurações e melhorando o processo de desenvolvimento.