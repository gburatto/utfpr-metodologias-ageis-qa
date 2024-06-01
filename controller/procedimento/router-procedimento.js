const procedimentos = require('express').Router();

const controlerProcedimento = require('./controller-procedimento')();

procedimentos.get('/', controlerProcedimento.listar);
procedimentos.post('/', controlerProcedimento.salvar);
procedimentos.delete('/procedimentos/:id', controlerProcedimento.delete);
procedimentos.patch('/procedimentos/:id', controlerProcedimento.editar);

module.exports = procedimentos;
