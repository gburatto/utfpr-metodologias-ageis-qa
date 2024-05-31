module.exports = () => {
    const controller = {};
    const usuarios = [];
    id = 0;
    const bcrypt = require('bcrypt');    

    controller.listar = (req, res) => {        
        res.status(200).json(usuarios);
    };

    controller.salvar = async (req, res) => {    
        const usuario = req.body;

        // Validação do Nome

        if (usuario.nome == null || usuario.nome == '') {
            res.status(400).json({erro: 'O nome é obrigatório'});
            return;
        }

        if (usuario.nome.length > 35) {
            res.status(400).json({erro: 'O nome deve conter no máximo 35 caracteres'});
            return;
        }

        if (usuario.nome.split(" ").length > 3) {
            res.status(400).json({erro: 'O nome deve conter no máximo 3 palavras'});
            return;
        }

        const caracteresInvalidos = /[_!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\0123456789]/;
        if (caracteresInvalidos.test(usuario.nome)){
            res.status(400).json({erro: 'O nome não deve conter símbolos ou números'});
            return;
        }

        // Validação do Email

        if (usuario.email == null || usuario.email == '') {
            res.status(400).json({erro: 'O email é obrigatório'});
            return;
        }

        if (!usuario.email.endsWith("@gmail.com") &&
            !usuario.email.endsWith("@hotmail.com") &&
            !usuario.email.endsWith("@outlook.com") &&
            !usuario.email.endsWith("@yahoo.com") &&
            !usuario.email.endsWith("@yahoo.com.br")) {
            res.status(400).json({erro: 'O domínio do email não é válido (deve ser gmail, hotmail, outlook ou yahoo)'});
            return;
        }

        // Validação do Telefone

        if (usuario.telefone == null || usuario.telefone == '') {
            res.status(400).json({erro: 'O número de telefone é obrigatório'});
            return;
        }

        const numeros = /^\d+$/
        if (!numeros.test(usuario.telefone)) {
            res.status(400).json({erro: 'O número de telefone deve conter apenas números'});
            return;
        }

        if (usuario.telefone.length < 10 || usuario.telefone.length > 11) {
            res.status(400).json({erro: 'O número de telefone deve ter de 10 a 11 dígitos'});
            return;
        }

        // Validação da Função

        if (usuario.funcao == null || usuario.funcao == '') {
            res.status(400).json({erro: 'A função não pode ser nula'});
            return;
        }

        if (usuario.funcao != "veterinário" && usuario.funcao != "secretário") {
            res.status(400).json({erro: 'Função inválida (deve ser apenas "veterinário" ou "secretário")'});
            return;
        }

        // Validação da Senha

        if (usuario.senha == null || usuario.senha == '') {
            res.status(400).json({erro: 'A senha não pode ser nula'});
            return;
        }

        if (usuario.senha.length < 6) {
            res.status(400).json({erro: 'A senha deve ter pelo menos 6 caracteres'});
            return;
        }

        const espaco = /[ ]/;
        if (espaco.test(usuario.senha)) {
            res.status(400).json({erro: 'A senha não pode ter espaços'});
            return;
        }

        const maiusculas = /[A-Z]/;
        if (!maiusculas.test(usuario.senha)) {
            res.status(400).json({erro: 'A senha deve ter pelo menos 1 letra maiúscula'});
            return;
        }

        const caracteresEspeciais = usuario.senha.match(/[_!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/g);
        if (!caracteresEspeciais || caracteresEspeciais.length < 2) {
            res.status(400).json({erro: 'A senha deve ter pelo menos 2 caracteres especiais'});
            return;
        }

        // Validação do "Repetir Senha"

        if (usuario.repetirSenha != usuario.senha) {
            res.status(400).json({erro: 'As senhas não conferem'});
            return;
        }

        // Criptografia da senha

        const hash = await bcrypt.hash(usuario.senha, 1)
        usuario.senha = hash;
        usuario.repetirSenha = hash;

        id++;
        usuario.id = id;

        usuarios.push(usuario)        
        res.status(201).json(usuario);
    };

    controller.editar = async (req, res) => {
        const usuario = req.body;

        // Procurar o usuário

        const userIndex = usuarios.findIndex((usuarioExistente) => usuarioExistente.id === usuario.id);
        if (userIndex === -1) {
            res.status(404).json({ erro: 'Usuário não encontrado' });
            return;
        }

        usuarioExistente = usuarios[userIndex];

        // Atualização do Nome

        if (usuario.nome != usuarioExistente.nome) {
            if (usuario.nome == null || usuario.nome == '') {
                res.status(400).json({erro: 'O nome é obrigatório'});
                return;
            }
    
            if (usuario.nome.length > 35) {
                res.status(400).json({erro: 'O nome deve conter no máximo 35 caracteres'});
                return;
            }
    
            if (usuario.nome.split(" ").length > 3) {
                res.status(400).json({erro: 'O nome deve conter no máximo 3 palavras'});
                return;
            }
    
            const caracteresInvalidos = /[_!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\0123456789]/;
            if (caracteresInvalidos.test(usuario.nome)){
                res.status(400).json({erro: 'O nome não deve conter símbolos ou números'});
                return;
            }

            usuarios[userIndex].nome = usuario.nome;
        }

        // Atualização do Email

        if (usuario.email != usuarioExistente.email) {
            if (usuario.email == null || usuario.email == '') {
                res.status(400).json({erro: 'O email é obrigatório'});
                return;
            }

            if (!usuario.email.endsWith("@gmail.com") &&
                !usuario.email.endsWith("@hotmail.com") &&
                !usuario.email.endsWith("@outlook.com") &&
                !usuario.email.endsWith("@yahoo.com") &&
                !usuario.email.endsWith("@yahoo.com.br")) {
                res.status(400).json({erro: 'O domínio do email não é válido (deve ser gmail, hotmail, outlook ou yahoo)'});
                return;
            }

            usuarios[userIndex].email = usuario.email;
        }

        // Atualização do Telefone

        if (usuario.telefone != usuarioExistente.telefone) {
            if (usuario.telefone == null || usuario.telefone == '') {
                res.status(400).json({erro: 'O número de telefone é obrigatório'});
                return;
            }
    
            const numeros = /^\d+$/
            if (!numeros.test(usuario.telefone)) {
                res.status(400).json({erro: 'O número de telefone deve conter apenas números'});
                return;
            }
    
            if (usuario.telefone.length < 10 || usuario.telefone.length > 11) {
                res.status(400).json({erro: 'O número de telefone deve ter de 10 a 11 dígitos'});
                return;
            }

            usuarios[userIndex].telefone = usuario.telefone;
        }

        // Atualização da Função

        if (usuario.funcao != usuarioExistente.funcao) {
            if (usuario.funcao == null || usuario.funcao == '') {
                res.status(400).json({erro: 'A função não pode ser nula'});
                return;
            }
    
            if (usuario.funcao != "veterinário" && usuario.funcao != "secretário") {
                res.status(400).json({erro: 'Função inválida (deve ser apenas "veterinário" ou "secretário")'});
                return;
            }

            usuarios[userIndex].funcao = usuario.funcao;
        }

        // Atualização da Senha

        if (!bcrypt.compareSync(usuario.senha, usuarioExistente.senha)) {
            if (usuario.senha == null || usuario.senha == '') {
                res.status(400).json({erro: 'A senha não pode ser nula'});
                return;
            }

            if (usuario.senhaAtual == null || usuario.senhaAtual == '') {
                res.status(400).json({erro: 'Informe a senha atual'});
                return;
            }

            if (!bcrypt.compareSync(usuario.senhaAtual, usuarioExistente.senha)) {
                res.status(400).json({erro: 'A senha atual não confere'});
                return;
            }
    
            if (usuario.senha.length < 6) {
                res.status(400).json({erro: 'A senha deve ter pelo menos 6 caracteres'});
                return;
            }

            const espaco = /[ ]/;
            if (espaco.test(usuario.senha)) {
                res.status(400).json({erro: 'A senha não pode ter espaços'});
                return;
            }
    
            const maiusculas = /[A-Z]/;
            if (!maiusculas.test(usuario.senha)) {
                res.status(400).json({erro: 'A senha deve ter pelo menos 1 letra maiúscula'});
                return;
            }
    
            const caracteresEspeciais = usuario.senha.match(/[_!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/g);
            if (!caracteresEspeciais || caracteresEspeciais.length < 2) {
                res.status(400).json({erro: 'A senha deve ter pelo menos 2 caracteres especiais'});
                return;
            }

            if (usuario.repetirSenha != usuario.senha) {
                res.status(400).json({erro: 'As senhas não conferem'});
                return;
            }

            // Criptografia da senha

            const hash = await bcrypt.hash(usuario.senha, 1)
            usuario.senha = hash;
            usuario.repetirSenha = hash;

            usuarios[userIndex].senha = usuario.senha;
            usuarios[userIndex].repetirSenha = usuario.repetirSenha;
        }

        res.status(200).json(usuarios[userIndex]);
    }

    controller.excluir = (req, res) => {        
        const usuario = req.body;

        const userIndex = usuarios.findIndex((usuarioExistente) => usuarioExistente.id === usuario.id);
        if (userIndex === -1) {
            res.status(404).json({ erro: 'Usuário não encontrado' });
            return;
        }

        usuarios.splice(userIndex, 1);        
        res.status(204).end();
    };
    
    return controller;
}
