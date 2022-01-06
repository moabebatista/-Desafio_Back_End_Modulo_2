const bancodedados = require('../dados/bancodedados');
const { format } = require("date-fns");

function deposito (req, res) {
    const { contas, depositos } = bancodedados;
    const { numero_conta, valor } = req.body;
    const contaDeposito = contas.find(conta => conta.numero === Number(numero_conta));

    if (!numero_conta || valor === undefined) {
        return res.status(400).json({mensagem: "O número da conta e o valor são obrigatórios!"})
    }

    if (!contaDeposito) {
        res.status(400).json({mensagem: "Não existe conta com este número no Banco."})
    }

    if (valor <= 0) {
        return res.status(400).json({mensagem: "O valor precisa ser maior que zero!"})
    }

    contaDeposito.saldo += valor;
    depositos.push({
        data: format(new Date(), "yyyy'-'MM'-'dd' 'HH':'mm':'ss"),
        numero_conta,
        valor,
    });

    res.status(200).json();
}

function saque (req, res) {
    const { contas, saques } = bancodedados;
    const { numero_conta, valor, senha } = req.body;
    const contaSaque = contas.find(conta => conta.numero === Number(numero_conta));

    if (!numero_conta || valor === undefined || !senha) {
        return res.status(400).json({mensagem: "Devem ser informado: o número da conta, valor e senha!"})
    }

    if (!contaSaque) {
        return res.status(400).json({mensagem: "Não existe conta com este número no Banco."})
    }

    if (contaSaque.usuario.senha !== senha) {
        return res.status(400).json({mensagem: "Senha incorreta!"});
    }

    if (valor <= 0) {
        return res.status(400).json({mensagem: "O valor precisa ser maior que zero!"})
    }

    if (contaSaque.saldo < valor) {
        return res.status(400).json({mensagem: `O limite máximo para saque é de R$ ${contaSaque.saldo}.`})
    }

    contaSaque.saldo -= valor;
    saques.push({
        data: format(new Date(), "yyyy'-'MM'-'dd' 'HH':'mm':'ss"),
        numero_conta,
        valor,
    });

    res.status(200).json()
}

function transferencia (req, res) {
    const { contas, transferencias } = bancodedados;
    const { numero_conta_origem, numero_conta_destino, valor, senha} = req.body;

    const contaOrigem = contas.find( conta => conta.numero === Number(numero_conta_origem));
    const contaDestino = contas.find( conta => conta.numero === Number(numero_conta_destino));

    if (numero_conta_origem === numero_conta_destino) {
        return res.status(400).json({mensagem: 'Você não pode fazer transferencia para um mesmo numero de conta!'});
    }

    if (!numero_conta_origem || !numero_conta_destino || valor === undefined || !senha) {
        return res.status(400).json({mensagem: 'Você precisa preencher todos os campos, corretamente!'});
    }

    if (!contaOrigem) {
        return res.status(400).json({mensagem: `A conta de numero ${numero_conta_origem} não existe!`});
    }

    if (!contaDestino) {
        return res.status(400).json({mensagem: `A conta de numero ${numero_conta_destino} não existe!`});
    }

    if (contaOrigem.usuario.senha !== senha) {
        return res.status(400).json({mensagem: 'Senha incorreta!'});
    }

    if (contaOrigem.saldo <= 0) {
        return res.status(400).json({mensagem: `Seu saldo atual é de ${contaOrigem.saldo}.`});
    }

    if (valor <= 0) {
        return res.status(400).json({mensagem: `O valor de ${valor}, não pode ser transferido!`});
    }

    if (contaOrigem.saldo < valor) {
        return res.status(400).json({mensagem: `O valor de ${valor}, não pode ser transferido, pois seu saldo atual é ${contaOrigem.saldo}.`});
    }

    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    transferencias.push({
        data: format(new Date(), "yyyy'-'MM'-'dd' 'HH':'mm':'ss"),
        numero_conta_origem,
        numero_conta_destino,
        valor,
    });

    res.status(200).json();

}


module.exports = {
    deposito,
    saque,
    transferencia,
}