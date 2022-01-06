const bancoDeDados = require('../dados/bancodedados');

let proximoNumeroDeConta = 1;


function validandoDados (body) {
    const { contas } = bancoDeDados;

    const cpfJaExiste = contas.find( x => x.usuario.cpf === body.cpf);
    const emailJaExiste = contas.find( x => x.usuario.email === body.email);

    if (cpfJaExiste) {
            return `O CPF ${body.cpf} já está cadastrado no Banco!`;
    }

    if (emailJaExiste) {
            return `O Email ${body.email} já está cadastrado no Banco!`;
    }

    if (!body.nome || !body.cpf ||!body.data_nascimento || !body.telefone || !body.email || !body.senha) {
          return 'Todos os campos precisam estar preenchidos!'
    }

}

function criandoUmaNovaConta (req, res) {
    const { contas } = bancoDeDados;
    const {nome, cpf, data_nascimento, telefone, email, senha} = req.body;

    const mensagem = validandoDados(req.body);

    if (mensagem) {
        res.status(400).json({mensagem});
        return
    }
    
    const contaNova = {
        numero: proximoNumeroDeConta++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha,
        },
  }

    contas.push(contaNova);
    res.status(201).json();
}

function atualizarUsuarioDaConta (req, res) {
    const { contas } = bancoDeDados;
    const {nome, cpf, data_nascimento, telefone, email, senha} = req.body;

    const usuarioAtualizado = contas.find( conta => conta.numero === Number(req.params.numeroConta));

    if(!Number(req.params.numeroConta)) {
        return res.status(404).json({mensagem: "Número da conta está em formato inválido!"})
    }
    
    if(!usuarioAtualizado) {
        res.status(400).json(`mensagem: A conta ${req.params.numeroConta} não existe!`);
    }

    if (!req.body.nome && !req.body.cpf && !req.body.data_nascimento && !req.body.telefone && !req.body.email && !req.body.senha) {
        res.status(400).json({mensagem: 'Os dados para atualização devem ser informados!'})
    }

    const mensagem = validandoDados(req.body);

    if (mensagem) {
        res.status(400).json({mensagem});
        return
    }

    usuarioAtualizado.usuario.nome = nome;
    usuarioAtualizado.usuario.cpf = cpf; 
    usuarioAtualizado.usuario.data_nascimento = data_nascimento; 
    usuarioAtualizado.usuario.telefone = telefone; 
    usuarioAtualizado.usuario.email = email; 
    usuarioAtualizado.usuario.senha = senha;
    
    res.status(200).json();

}

function excluirConta (req, res) {
    const numeroConta = req.params.numeroConta;
    const { contas } = bancoDeDados;

    const usuarioASerExcluido = contas.find(conta => conta.numero === Number(numeroConta));

    const indice = contas.indexOf(usuarioASerExcluido);

    if(!Number(req.params.numeroConta)) {
        return res.status(404).json({mensagem: "Número da conta está em formato inválido!"})
    }

    if(!usuarioASerExcluido) {
        res.status(400).json(`mensagem: A conta ${req.params.numeroConta} não existe!`);
    }

    if(usuarioASerExcluido.saldo !== 0) {
        res.status(400).json({mensagem: "A conta só pode ser removida se o saldo for zero!"});
    }

    contas.splice(indice, 1);
    res.status(200).json();
}




module.exports = {
    criandoUmaNovaConta,
    atualizarUsuarioDaConta,
    excluirConta
}