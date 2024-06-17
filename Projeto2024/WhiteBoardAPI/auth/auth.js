var axios = require('axios')
var DocenteController = require('../controllers/docente');
var AlunoController = require('../controllers/aluno');
var AdminController = require('../controllers/admin');
var Token = require('../models/token');
var jwt = require('jsonwebtoken');
var secretKey = 'EW2024';

// Função para gerar e armazenar o token
const generateAndStoreToken = async function(userId, userType) {
    const payload = {
        userId: userId,
        userType: userType
    };

    const token = jwt.sign(payload, secretKey, {expiresIn: '1d'});

    const tokenDocument = new Token({
        token: token,
        userId: userId,
        userType: userType
    });

    if (userType === 'Aluno') {
        await AlunoController.insertToken(userId, token);
    } else if (userType === 'Docente') {
        await DocenteController.insertToken(userId, token);
    } else if (userType === 'Admin') {
        await AdminController.insertToken(userId, token);
    }

    await tokenDocument.save();
    return token;
}

// Função para autenticar user
module.exports.authenticateUser = async function(userId, password, userType) {
    let user;
    if (userType == 'Docente') {
        user = await DocenteController.findById(userId);
    } else if (userType == 'Aluno') {
        user = await AlunoController.findById(userId);
    } else if (userType == 'Admin') {
        user = await AdminController.findById(userId);
    } else {
        throw new Error("Tipo de utilizador inválido!");
    }

    if (user && (password == user.password)) {
        return await generateAndStoreToken(userId, userType);
    } else {
        throw new Error("ID ou PassWord inválidos!");
    }
}

// Função para verificar o token
module.exports.verifyToken = async function(userID, token) {
    try {
        if (userID == undefined || token == undefined){
            throw new Error("Token não existente")
        } 

        let user;
        if (userID.includes('admin')) {
            user = await AdminController.findById(userID);
        } else if (userID[0]=='a') {
            user = await AlunoController.findById(userID);
        } else if (userID[0]=='d') {
            user = await DocenteController.findById(userID);
        } else {
            throw new Error("Tipo de utilizador inválido!");
        }

        token = token.replace(/^"(.*)"$/, '$1');
        return token == user.token
    } catch (error) {
        return false;
    }
}