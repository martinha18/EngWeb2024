import json

with open("filmes.json") as arquivo:
    bd = json.load(arquivo)

filmes = bd['filmes']

atores = []
atores_counter = 0

generos = []
generos_counter = 0

for f in filmes:
    print(f)
    id = f.pop('_id', None)
    f['id'] = id['$oid']

    new_cast = []
    for a in f['cast']:
        found = False
        for ator in atores:
            if ator['nome'] == a:
                found = True
                new_cast.append({"id":ator['id'],"nome":a})
        if not found:
            atores_counter += 1
            id_ator = f"A{atores_counter}"
            atores.append({"id":id_ator,"nome":a})
    f['cast'] = new_cast

    new_genres = []
    for g in f['genres']:
        found = False
        for genero in generos:
            if genero['nome'] == g:
                found = True
                new_genres.append({"id":genero['id'],"nome":g})
        if not found:
            generos_counter += 1
            id_genero = f"G{generos_counter}"
            generos.append({"id":id_genero,"nome":g})
    f['genres'] = new_genres

bd_final = {}
bd_final['filmes'] = filmes
bd_final['atores'] = atores
bd_final['generos'] = generos

with open("filmes_new.json", 'w') as arquivo:
    json.dump(bd_final, arquivo, indent=2)