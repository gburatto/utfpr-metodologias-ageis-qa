const procedimentos = require('express').Router();

const controlerProcedimento = require('./controller-procedimento')();

procedimentos.get('/', controlerProcedimento.listar);
procedimentos.post('/', controlerProcedimento.salvar);
procedimentos.delete('/:id', controlerProcedimento.delete);
procedimentos.patch('/:id', controlerProcedimento.patch);

module.exports = procedimentos;
