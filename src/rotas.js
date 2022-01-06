const express = require('express');
const consultas = require('./controladores/consultasDiversas');
const criacaoOuAtualizacao = require('./controladores/criandoOuAtualizandoContas');
const transacoes = require('./controladores/transacoesBancarias');

const rotas = express();

rotas.get('/contas', consultas.consultandoContas);
rotas.post('/contas', criacaoOuAtualizacao.criandoUmaNovaConta);
rotas.put('/contas/:numeroConta/usuario', criacaoOuAtualizacao.atualizarUsuarioDaConta);
rotas.delete('/contas/:numeroConta', criacaoOuAtualizacao.excluirConta);
rotas.post('/transacoes/depositar', transacoes.deposito);
rotas.post('/transacoes/sacar', transacoes.saque);
rotas.post('/transacoes/transferir', transacoes.transferencia);
rotas.get('/contas/saldo', consultas.consultandoSaldo);
rotas.get('/contas/extrato', consultas.consultandoExtrato);

module.exports = rotas;
