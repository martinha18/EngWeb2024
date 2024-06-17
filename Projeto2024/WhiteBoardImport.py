import os
import json
import sys
import requests
import mimetypes
import time

global tokenAdmin
global adminAutenticado

def load_json(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)


def validate_json_structure(data, required_keys, optional_keys, ObjectType):
    option = ""

    item_keys = set(data.keys())
    required_keys_set = set(required_keys)
    optional_keys_set = set(optional_keys)

    if item_keys.issubset(required_keys_set.union(optional_keys_set)) and required_keys_set.issubset(item_keys):
        option = "Entrada Completa"

    elif item_keys.issubset(required_keys_set.union(optional_keys_set)):
        option = "Entrada Parcial"

    if '_id' in data:
        if ObjectType == 'Docente' and not data['_id'].startswith('d'):
            option = "ID em formato inválido"

        if ObjectType == 'Aluno' and not data['_id'].startswith('a'):
            option = "ID em formato inválido"
        
        if ObjectType == 'Admin' and not data['_id'].startswith('admin'):
            option = "ID em formato inválido"
    else:
        option = "ID em formato inválido"

    return option

def post_docente(url, docente, image_path):
    try:
        mimetype = mimetypes.guess_type(image_path)[0]

        with open(image_path, 'rb') as img:
            files = {
                'foto': (image_path, img, mimetype)
            }
            data = {key: value for key, value in docente.items() if key != 'foto'}
            response = requests.post(url, files=files, data=data)

        return response.status_code == 200
    
    except Exception:
        time.sleep(1)
        return post_docente(url,docente,image_path)


def put_docente(url, docente, image_path):
    try:
        data = {key: value for key, value in docente.items() if key != 'foto'}
        
        if image_path:
            mimetype = mimetypes.guess_type(image_path)[0]
            with open(image_path, 'rb') as img:
                files = {
                    'foto': (image_path, img, mimetype)
                }
                response = requests.put(url, files=files, data=data)
        else:
            response = requests.put(url, data=data)

        return response.status_code == 200
    
    except Exception:
        time.sleep(1)
        return put_docente(url,docente,image_path)
    

def post_aluno(url, aluno, image_path):
    try:
        mimetype = mimetypes.guess_type(image_path)[0]

        with open(image_path, 'rb') as img:
            files = {
                'foto': (image_path, img, mimetype)
            }
            data = {key: value for key, value in aluno.items() if key != 'foto'}
            response = requests.post(url, files=files, data=data)

        return response.status_code == 200
    
    except Exception:
        time.sleep(1)
        return post_aluno(url,aluno,image_path)


def put_aluno(url, aluno, image_path):
    try:
        data = {key: value for key, value in aluno.items() if key != 'foto'}
        
        if image_path:
            with open(image_path, 'rb') as img:
                mimetype = mimetypes.guess_type(image_path)[0]
                files = {
                    'foto': (image_path, img, mimetype)
                    }
                response = requests.put(url, files=files, data=data)
        else:
            response = requests.put(url, data=data)

        return response.status_code == 200

    except Exception:
        time.sleep(1)
        return put_aluno(url,aluno,image_path)


def post_uc(url, uc):
    try:
        response = requests.post(url, json=uc)

        return response.status_code == 200
    
    except Exception:
        time.sleep(1)
        return post_uc(url,uc)


def put_uc(url, uc):
    try:
        response = requests.put(url, json=uc)

        return response.status_code == 200
   
    except Exception:
        time.sleep(1)
        return put_uc(url,uc)


def autenticar_admin(url):
    try:
        response = requests.get(url)

        return response.text
    
    except Exception:
        time.sleep(1)
        return autenticar_admin(url)
        

def post_admin(url, admin):
    try:
        response = requests.post(url, json=admin)

        return response.status_code == 200
    
    except Exception:
        time.sleep(1)
        return post_admin(url,admin)


def put_admin(url, admin):
    try:
        response = requests.put(url, json=admin)

        return response.status_code == 200
   
    except Exception:
        time.sleep(1)
        return put_admin(url,admin)


def validate_structure(urlBase, folder_path):
    # Importa o tokenAdmin e adminAutenticado para o scope local da função
    global tokenAdmin
    global adminAutenticado

    # Load JSON files
    alunos_path = os.path.join(folder_path, 'alunos.json')
    docentes_path = os.path.join(folder_path, 'docentes.json')
    ucs_path = os.path.join(folder_path, 'ucs.json')
    admins_path = os.path.join(folder_path, 'admins.json')

    # Images Path
    images_folder_path = os.path.join(folder_path, 'images')

    if (os.path.isfile(admins_path)): 
        required_keys_admins = ["_id", "password"]
        admins = load_json(admins_path)

        # Faz a autenticação do primeiro admin
        option = validate_json_structure(admins[0], required_keys_admins, [], 'Admin')
        if option == "Entrada Completa":
            if post_admin(urlBase+'/admins?adminPasse=WhiteBoard1234', admins[0]):
                tokenAdmin = autenticar_admin(urlBase+'/admins/'+admins[0]['_id']+'/autenticar?password='+admins[0]['password'])
                adminAutenticado = admins[0]['_id']
                print(f"POST ADMIN {admins[0]['_id']}")
            else: # ADMIN já existe
                tokenAdmin = autenticar_admin(urlBase+'/admins/'+admins[0]['_id']+'/autenticar?password='+admins[0]['password'])
                adminAutenticado = admins[0]['_id']
                put_admin(urlBase+'/admins/'+admins[0]['_id']+'?userID='+adminAutenticado+'&token='+tokenAdmin, admins[0])
                print(f"PUT ADMIN {admins[0]['_id']}")
        elif option == "Entrada Parcial":
            tokenAdmin = autenticar_admin(urlBase+'/admins/'+admins[0]['_id']+'/autenticar?password='+admins[0]['password'])
            adminAutenticado = admins[0]['_id']
            if put_admin(urlBase+'/admins/'+admins[0]['_id']+'?userID='+adminAutenticado+'&token='+tokenAdmin, admins[0]):
                print(f"PUT ADMIN {admins[0]['_id']}")
            else: 
                print(f"ADMIN {admins[0]['_id']} não existente -> forneça todos os campos necessários.")    
        elif option == 'ID em formato inválido':
            print(option)   
        else:
            print(f"ADMIN {admins[0]['_id']} não se encontra num formato válido!!")

        # Adiciona ou atualiza a informação sobre os restantes admins
        for admin in admins[1:]:
            option = validate_json_structure(admin, required_keys_admins, [], 'Admin')
            if option == "Entrada Completa":
                if post_admin(urlBase+'/admins?adminPasse=WhiteBoard1234', admin):
                    print(f"POST ADMIN {admin['_id']}")
                else: # ADMIN já existe
                    put_admin(urlBase+'/admins/'+admin['_id']+'?userID='+adminAutenticado+'&token='+tokenAdmin, admin)
                    print(f"PUT ADMIN {admin['_id']}")
            elif option == "Entrada Parcial":
                if put_admin(urlBase+'/admins/'+admin['_id']+'?userID='+adminAutenticado+'&token='+tokenAdmin, admin):
                    print(f"PUT ADMIN {admin['_id']}")
                else: 
                    print(f"ADMIN {admin['_id']} não existente -> forneça todos os campos necessários.")   
            elif option == 'ID em formato inválido':
                print(option)        
            else:
                print(f"ADMIN {admin['_id']} não se encontra num formato válido!!")

    
        if (os.path.isfile(alunos_path)): 
            required_keys_alunos = ["_id", "nome", "foto", "email", "curso", "password"]
            alunos = load_json(alunos_path)

            for aluno in alunos:
                option = validate_json_structure(aluno, required_keys_alunos, [], 'Aluno')
                if option == "Entrada Completa":
                    image_path = os.path.join(images_folder_path, aluno['foto'])
                    if post_aluno(urlBase+'/alunos?userID='+adminAutenticado+'&token='+tokenAdmin, aluno, image_path):
                        print(f"POST ALUNO {aluno['_id']}")
                    else: # Aluno já existe
                        if aluno['foto']:
                            image_path = os.path.join(images_folder_path, aluno['foto'])
                            if put_aluno(urlBase+'/alunos/'+aluno['_id']+'?userID='+adminAutenticado+'&token='+tokenAdmin, aluno, image_path):
                                print(f"PUT ALUNO {aluno['_id']}")
                        else:
                            put_aluno(urlBase+'/alunos/'+aluno['_id']+'?userID='+adminAutenticado+'&token='+tokenAdmin, aluno, None)
                            print(f"PUT ALUNO {aluno['_id']}")
                elif option == "Entrada Parcial":
                    if aluno['foto']:
                        image_path = os.path.join(images_folder_path, aluno['foto'])
                        if put_aluno(urlBase+'/alunos/'+aluno['_id']+'?userID='+adminAutenticado+'&token='+tokenAdmin, aluno, image_path):
                            print(f"PUT ALUNO {aluno['_id']}")
                        else: 
                            print(f"ALUNO {aluno['_id']} não existente -> forneça todos os campos necessários.")
                    else:
                        if put_aluno(urlBase+'/alunos/'+aluno['_id']+'?userID='+adminAutenticado+'&token='+tokenAdmin, aluno, None):
                            print(f"PUT ALUNO {aluno['_id']}")
                        else:
                            print(f"ALUNO {aluno['_id']} não existente -> forneça todos os campos necessários.")
                elif option == 'ID em formato inválido':
                    print(option)  
                else:
                    print(f"Aluno {aluno['_id']} não se encontra num formato válido!!")

        if (os.path.isfile(docentes_path)): 
            required_keys_docentes = ["_id", "nome", "foto", "categoria", "filiacao", "email", "password"]
            optional_keys_docentes = ["webpage"]
            docentes = load_json(docentes_path)

            for docente in docentes:
                option = validate_json_structure(docente, required_keys_docentes, optional_keys_docentes, 'Docente')
                if option == "Entrada Completa":
                    image_path = os.path.join(images_folder_path, docente['foto'])
                    if post_docente(urlBase+'/docentes?userID='+adminAutenticado+'&token='+tokenAdmin, docente, image_path):
                        print(f"POST DOCENTE {docente['_id']}")
                    else: # Docente já existe
                        if docente['foto']:
                            image_path = os.path.join(images_folder_path, docente['foto'])
                            put_docente(urlBase+'/docentes/'+docente['_id']+'?userID='+adminAutenticado+'&token='+tokenAdmin, docente, image_path)
                            print(f"PUT DOCENTE {docente['_id']}")
                        else:
                            put_docente(urlBase+'/docentes/'+docente['_id']+'?userID='+adminAutenticado+'&token='+tokenAdmin, docente, None)
                            print(f"PUT DOCENTE {docente['_id']}")
                elif option == "Entrada Parcial":
                    if docente['foto']:
                        image_path = os.path.join(images_folder_path, docente['foto'])
                        if put_docente(urlBase+'/docentes/'+docente['_id']+'?userID='+adminAutenticado+'&token='+tokenAdmin, docente, image_path):
                            print(f"PUT DOCENTE {docente['_id']}")
                        else: 
                            print(f"DOCENTE {docente['_id']} não existente -> forneça todos os campos necessários.")
                    else:
                        if put_docente(urlBase+'/docentes/'+docente['_id']+'?userID='+adminAutenticado+'&token='+tokenAdmin, docente, None):
                            print(f"PUT DOCENTE {docente['_id']}")
                        else:
                            print(f"DOCENTE {docente['_id']} não existente -> forneça todos os campos necessários.")   
                elif option == 'ID em formato inválido':
                    print(option)       
                else:
                    print(f"Docente {docente['_id']} não se encontra num formato válido!!")


        if (os.path.isfile(ucs_path)): 
            required_keys_ucs = ["_id", "codUC", "titulo", "docentes", "alunos", "horario", "avaliacao", "datas", "contaAulas", "aulas", "notas"]
            ucs = load_json(ucs_path)

            for uc in ucs:
                option = validate_json_structure(uc, required_keys_ucs, [], 'UC')
                if option == "Entrada Completa":
                    if post_uc(urlBase+'/ucs?userID='+adminAutenticado+'&token='+tokenAdmin, uc):
                        print(f"POST UC {uc['_id']}")
                    else: # UC já existe
                        put_uc(urlBase+'/ucs/'+uc['_id']+'?userID='+adminAutenticado+'&token='+tokenAdmin, uc)
                        print(f"PUT UC {uc['_id']}")
                elif option == "Entrada Parcial":
                    if put_uc(urlBase+'/ucs/'+uc['_id']+'?userID='+adminAutenticado+'&token='+tokenAdmin, uc):
                        print(f"PUT UC {uc['_id']}")
                    else: 
                        print(f"UC {uc['_id']} não existente -> forneça todos os campos necessários.")        
                else:
                    print(f"UC {uc['_id']} não se encontra num formato válido!!")
    
    
if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Uso: python3 WhiteBoardImport.py <pastaData> <mode>")
        sys.exit(1)

    if sys.argv[2] == "setup":
        urlBase = 'http://WhiteBoardAPI:10000'
    elif sys.argv[2] == "import":
        urlBase = 'http://localhost:10000'
    else:
        print("Introduza um <mode> correto -> setup ou import")
        sys.exit(1)

    validate_structure(urlBase,sys.argv[1])