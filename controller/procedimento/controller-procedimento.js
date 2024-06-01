module.exports = () => {
    const controller = {};
    const procedimentos = [];
    id = 0;

    controller.listar = (req, res) => {
        res.status(200).json(procedimentos);
    };

    controller.salvar = async (req, res) => {
        const procedimento = req.body;

        // Validação do Nome
        if (!procedimento.nome) {
            res.status(400).json({ erro: 'O nome é obrigatório' });
            return;
        }

        if (procedimento.nome.length > 30) {
            res.status(400).json({ erro: 'O nome deve conter no máximo 30 caracteres' });
            return;
        }

        // Validação da Especialidade
        if (!procedimento.especialidade) {
            res.status(400).json({ erro: 'A especialidade é obrigatória' });
            return;
        }

        const especialidadePalavras = procedimento.especialidade.split(/\s+/);
        for (const palavra of especialidadePalavras) {
            if (palavra.length > 15) {
                res.status(400).json({ erro: 'A especialidade não pode conter palavras com mais de 15 caracteres' });
                return;
            }
        }

        // Validação do Tempo Médio
        if (!procedimento.tempo) {
            res.status(400).json({ erro: 'O tempo médio é obrigatório' });
            return;
        }

        const horario = /^([01]?[0-9]|2[0-4]):[0-5][0-9]$/;
        if (!horario.test(procedimento.tempo)) {
            res.status(400).json({ erro: 'O tempo médio deve estar no formato HH:MM, limitado a 24 horas' });
            return;
        }

        const [horas, minutos] = procedimento.tempo.split(":").map(Number);
        if (minutos !== 0 && minutos !== 30) {
            res.status(400).json({ erro: 'Somente são aceitos intervalos de 30 em 30 minutos' });
            return;
        }

        if (horas === 0 && minutos < 30) {
            res.status(400).json({ erro: 'O tempo médio não pode ser menor do que 30 minutos' });
            return;
        }

        if (horas === 24 && minutos > 0) {
            res.status(400).json({ erro: 'O tempo médio não pode ser maior do que 24 horas' });
            return;
        }

        // Validação da Necessidade de Equipe
        if (!procedimento.necessidadeEquipe) {
            res.status(400).json({ erro: 'O campo \'Necessidade de Equipe\' é obrigatório' });
            return;
        }

        if (procedimento.necessidadeEquipe !== 'sim' && procedimento.necessidadeEquipe !== 'não') {
            res.status(400).json({ erro: 'O campo \'Necessidade de Equipe\' deve ser \'sim\' ou \'não\'' });
            return;
        }

        // Validação da Equipe
        if (procedimento.necessidadeEquipe === 'sim' && (!procedimento.equipe)) {
            res.status(400).json({ erro: 'A equipe necessária não pode ser nula se o campo \'Necessidade de Equipe\' for igual a \'sim\'' });
            return;
        }

        id++;
        procedimento.id = id;

        procedimentos.push(procedimento);
        res.status(201).json(procedimento);
    };

    controller.patch = async (req, res) => {
        const procedimentoId = parseInt(req.params.id);
        const procedimentoIndex = procedimentos.findIndex(p => p.id === procedimentoId);

        if (procedimentoIndex === -1) {
            res.status(404).json({ erro: 'Procedimento não encontrado' });
            return;
        }

        const procedimentoAtualizado = { ...procedimentos[procedimentoIndex], ...req.body };

        if (procedimentoAtualizado.nome && procedimentoAtualizado.nome.length > 30) {
            res.status(400).json({ erro: 'O nome deve conter no máximo 30 caracteres' });
            return;
        }

        if (procedimentoAtualizado.especialidade) {
            const especialidadePalavras = procedimentoAtualizado.especialidade.split(/\s+/);
            for (const palavra of especialidadePalavras) {
                if (palavra.length > 15) {
                    res.status(400).json({ erro: 'A especialidade não pode conter palavras com mais de 15 caracteres' });
                    return;
                }
            }
        }

        if (procedimentoAtualizado.tempo) {
            const horario = /^([01]?[0-9]|2[0-4]):[0-5][0-9]$/;
            if (!horario.test(procedimentoAtualizado.tempo)) {
                res.status(400).json({ erro: 'O tempo médio deve estar no formato HH:MM, limitado a 24 horas' });
                return;
            }

            const [horas, minutos] = procedimentoAtualizado.tempo.split(":").map(Number);
            if (minutos !== 0 && minutos !== 30) {
                res.status(400).json({ erro: 'Somente são aceitos intervalos de 30 em 30 minutos' });
                return;
            }

            if (horas === 0 && minutos < 30) {
                res.status(400).json({ erro: 'O tempo médio não pode ser menor do que 30 minutos' });
                return;
            }

            if (horas === 24 && minutos > 0) {
                res.status(400).json({ erro: 'O tempo médio não pode ser maior do que 24 horas' });
                return;
            }
        }

        if (procedimentoAtualizado.necessidadeEquipe) {
            if (procedimentoAtualizado.necessidadeEquipe !== 'sim' && procedimentoAtualizado.necessidadeEquipe !== 'não') {
                res.status(400).json({ erro: 'O campo \'Necessidade de Equipe\' deve ser \'sim\' ou \'não\'' });
                return;
            }

            if (procedimentoAtualizado.necessidadeEquipe === 'sim' && (!procedimentoAtualizado.equipe)) {
                res.status(400).json({ erro: 'A equipe necessária não pode ser nula se o campo \'Necessidade de Equipe\' for igual a \'sim\'' });
                return;
            }
        }

        procedimentos[procedimentoIndex] = procedimentoAtualizado;
        res.status(200).json(procedimentoAtualizado);
    };

    controller.delete = (req, res) => {
        const procedimentoId = parseInt(req.params.id);
        const procedimentoIndex = procedimentos.findIndex(p => p.id === procedimentoId);

        if (procedimentoIndex === -1) {
            res.status(404).json({ erro: 'Procedimento não encontrado' });
            return;
        }

        procedimentos.splice(procedimentoIndex, 1);
        res.status(204).send();
    };

    controller.editar = async (req, res) => {
        const usuario = req.body;

        /*
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
        */
    }

    controller.excluir = (req, res) => {
        /*const usuario = req.body;

        const userIndex = usuarios.findIndex((usuarioExistente) => usuarioExistente.id === usuario.id);
        if (userIndex === -1) {
            res.status(404).json({ erro: 'Usuário não encontrado' });
            return;
        }

        usuarios.splice(userIndex, 1);        
        res.status(204).end();*/
    };

    return controller;
}
