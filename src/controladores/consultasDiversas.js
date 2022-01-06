const bancoDeDados = require('../dados/bancodedados');

function consultandoContas (req, res) {

    const senha = req.query.senha_banco;
    const { banco } = bancoDeDados;

    if(!senha || senha !== banco.senha) {
        res.status(400).json({"mensagem": "Senha inválida!"});
        return
    }

    res.status(200).json(bancoDeDados.contas);
}

function consultandoSaldo (req, res) {
    const { contas } = bancoDeDados;
    const{ numero_conta, senha } = req.query;
    const numeroDaConta = contas.find(conta => conta.numero === Number(numero_conta));

    if (!numero_conta || !senha) {
        return res.status(400).json({mensagem: 'O campos: Numero da conta e Senha, são Obrigatórios'});
    }

    if (!numeroDaConta) {
        return res.status(400).json({mensagem: `A conta de numero ${numero_conta} não existe!`});
    }

    if (numeroDaConta.usuario.senha !== senha) {
        return res.status(400).json({mensagem: 'Senha incorreta!'});
    }

    res.status(200).json({
        saldo: numeroDaConta.saldo
    })
}

function consultandoExtrato (req, res) {
    const { contas, saques, depositos, transferencias } = bancoDeDados;
    const{ numero_conta, senha } = req.query;
    const numeroDaConta = contas.find(conta => conta.numero === Number(numero_conta));

    if (!numero_conta || !senha) {
        return res.status(400).json({mensagem: 'O campos: Numero da conta e Senha, são Obrigatórios'});
    }

    if (!numeroDaConta) {
        return res.status(400).json({mensagem: `A conta de numero ${numero_conta} não existe!`});
    }

    if (numeroDaConta.usuario.senha !== senha) {
        return res.status(400).json({mensagem: 'Senha incorreta!'});
    }

    const contaDepositos = depositos.filter(conta => conta.numero_conta === Number(numero_conta));
    const contaSaques = saques.filter(conta => conta.numero_conta === Number(numero_conta));
    const contaTransferenciasOrigem = transferencias.filter(conta => conta.numero_conta_origem === Number(numero_conta));
    const contaTranferenciasDestino = transferencias.filter(conta => conta.numero_conta_destino === Number(numero_conta));

    res.status(200).json({
        depositos: contaDepositos,
        saques: contaSaques,
        transferenciasEnviadas: contaTransferenciasOrigem,
        transferenciasRecebidas: contaTranferenciasDestino
    })
}



module.exports = {
    consultandoContas,
    consultandoSaldo,
    consultandoExtrato,
}