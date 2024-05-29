const usuarios = require('express').Router();

const controlerUsuario = require('./controller-usuario')();

usuarios.get('/', controlerUsuario.listar);
usuarios.post('/', controlerUsuario.salvar);
usuarios.delete('/', controlerUsuario.excluir);

module.exports = usuarios;
