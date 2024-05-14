# Cenas gerais que podem vir a ser úteis

- var d = new Date().toISOString().substring(0,16)




# Express e pugs -> Aula5 / TPC5

## Criar API node
- json-server ficheiro.json

- npx express-generator --view=pug nome_pasta

- cd nome_pasta
- npm i (instala todas as dependências)
- npm start

- localhost/(porta indicada)

## Changes

### www
- Alterar última função para: console.log("Servidor à escuta na porta " + port + "...")
- Alterar porta se aplicável

(Assinaladas com //!)

### public

stylesheets -> acrescentar w3.css

### routes
- Delete users
- index.js -> Adicionar gets e posts

### views
Criar ficheiros .pug

- layout -> chamar stylesheet correta
- error =
- index -> página inicial
- outras páginas

### app.js
Apagar cenas dos users
(Assinaladas com //!)