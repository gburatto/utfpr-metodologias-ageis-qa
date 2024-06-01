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

    return controller;
}
