module.exports = () => {
    const controller = {};
    const usuarios = [];    

    controller.listar = (req, res) => {        
        res.status(200).json(usuarios);
    };

    controller.salvar = (req, res) => {    
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

        const caracteresInvalidos = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\0123456789]/;
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

        usuarios.push(usuario)        
        res.status(201).json(usuario);
    };

    controller.excluir = (req, res) => {        
        const usuario = req.body;
        usuarios.pop(usuario)        
        res.status(200).json(usuario);
    };
    
    return controller;
}
