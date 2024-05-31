const procedimentos = require('express').Router();

const controlerProcedimento = require('./controller-procedimento')();

procedimentos.get('/', controlerProcedimento.listar);
procedimentos.post('/', controlerProcedimento.salvar);
procedimentos.delete('/', controlerProcedimento.excluir);
procedimentos.patch('/', controlerProcedimento.editar);

module.exports = procedimentos;
