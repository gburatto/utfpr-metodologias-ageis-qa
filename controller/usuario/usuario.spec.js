const usuario = require("./router-usuario");

const request = require("supertest");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use("/", usuario);

// ---------------------------------------------------------------------
// Testes do método POST

it("should save the user", done => {
  const payload = {nome: 'john', email: 'john@gmail.com', telefone: "41999999999", funcao: "veterinário", senha: 'Abc123@_', repetirSenha: 'Abc123@_'};
  hash = bcrypt.hash(payload.senha, 1);
  request(app)
    .post("/")
    .send(payload)
    .expect(res => {
      if (res.body.nome !== payload.nome) {
        throw new Error(`Expected 'nome' to be '${payload.nome}', but got '${res.body.nome}'`);
      }
      if (res.body.email !== payload.email) {
        throw new Error(`Expected 'email' to be '${payload.email}', but got '${res.body.email}'`);
      }
      if (res.body.telefone !== payload.telefone) {
        throw new Error(`Expected 'telefone' to be '${payload.telefone}', but got '${res.body.telefone}'`);
      }
      if (res.body.funcao !== payload.funcao) {
        throw new Error(`Expected 'funcao' to be '${payload.funcao}', but got '${res.body.funcao}'`);
      }
      if (!bcrypt.compareSync(payload.senha, res.body.senha)) {
        throw new Error("Password does not match");
      }
      if (!bcrypt.compareSync(payload.repetirSenha, res.body.repetirSenha)) {
        throw new Error("Repeated password does not match");
      }
    })
    .expect(201, done);
});

// Testes de validação do "nome"

it("should return an error when user 'nome' is empty", done => {
  const payload = {nome: '', email: 'john@gmail.com', telefone: "41999999999", funcao: "veterinário", senha: 'Abc123@_', repetirSenha: 'Abc123@_'};
  request(app)
    .post("/")
    .send(payload)
    .expect({ erro: 'O nome é obrigatório' })
    .expect(400, done);
});

it("should return an error when user 'nome' is too long", done => {
  const payload = {nome: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', email: 'john@gmail.com', telefone: "41999999999", funcao: "veterinário", senha: 'Abc123@_', repetirSenha: 'Abc123@_'};
  request(app)
    .post("/")
    .send(payload)
    .expect({ erro: 'O nome deve conter no máximo 35 caracteres' })
    .expect(400, done);
});

it("should return an error when user 'nome' has more than 3 words", done => {
  const payload = {nome: 'joão pedro da silva', email: 'john@gmail.com', telefone: "41999999999", funcao: "veterinário", senha: 'Abc123@_', repetirSenha: 'Abc123@_'};
  request(app)
    .post("/")
    .send(payload)
    .expect({ erro: 'O nome deve conter no máximo 3 palavras' })
    .expect(400, done);
});

it("should return an error when user 'nome' contains special characters or numbers", done => {
  const payload = {nome: 'john123', email: 'john@gmail.com', telefone: "41999999999", funcao: "veterinário", senha: 'Abc123@_', repetirSenha: 'Abc123@_'};
  request(app)
    .post("/")
    .send(payload)
    .expect({ erro: 'O nome não deve conter símbolos ou números' })
    .expect(400, done);
});

// Testes de validação do "email"

it("should return an error when user 'email' is empty", done => {
  const payload = {nome: 'john', email: '', telefone: "41999999999", funcao: "veterinário", senha: 'Abc123@_', repetirSenha: 'Abc123@_'};
  request(app)
    .post("/")
    .send(payload)
    .expect({ erro: 'O email é obrigatório' })
    .expect(400, done);
});

it("should return an error when user 'email' has an invalid domain", done => {
  const payload = {nome: 'john', email: 'john@exemplo.com', telefone: "41999999999", funcao: "veterinário", senha: 'Abc123@_', repetirSenha: 'Abc123@_'};
  request(app)
    .post("/")
    .send(payload)
    .expect({ erro: 'O domínio do email não é válido (deve ser gmail, hotmail, outlook ou yahoo)' })
    .expect(400, done);
});

// Testes de validação do "telefone"

it("should return an error when user 'telefone' is empty", done => {
  const payload = {nome: 'john', email: 'john@gmail.com', telefone: "", funcao: "veterinário", senha: 'Abc123@_', repetirSenha: 'Abc123@_'};
  request(app)
    .post("/")
    .send(payload)    
    .expect({ erro: 'O número de telefone é obrigatório' })
    .expect(400, done);
});

it("should return an error when user 'telefone' has invalid characters", done => {
  const payload = {nome: 'john', email: 'john@gmail.com', telefone: "4199999abcd", funcao: "veterinário", senha: 'Abc123@_', repetirSenha: 'Abc123@_'};
  request(app)
    .post("/")
    .send(payload)    
    .expect({ erro: 'O número de telefone deve conter apenas números' })
    .expect(400, done);
});

it("should return an error when user 'telefone' has a wrong number of digits", done => {
  const payload = {nome: 'john', email: 'john@gmail.com', telefone: "419999912345", funcao: "veterinário", senha: 'Abc123@_', repetirSenha: 'Abc123@_'};
  request(app)
    .post("/")
    .send(payload)    
    .expect({ erro: 'O número de telefone deve ter de 10 a 11 dígitos' })
    .expect(400, done);
});

// Testes de validação da "funcao"

it("should return an error when user 'funcao' is empty", done => {
  const payload = {nome: 'john', email: 'john@gmail.com', telefone: "41999999999", funcao: "", senha: 'Abc123@_', repetirSenha: 'Abc123@_'};
  request(app)
    .post("/")
    .send(payload)    
    .expect({ erro: 'A função não pode ser nula' })
    .expect(400, done);
});

it("should return an error when user 'funcao' is not 'veterinário' or 'secretário'", done => {
  const payload = {nome: 'john', email: 'john@gmail.com', telefone: "41999999999", funcao: "outro", senha: 'Abc123@_', repetirSenha: 'Abc123@_'};
  request(app)
    .post("/")
    .send(payload)    
    .expect({ erro: 'Função inválida (deve ser apenas "veterinário" ou "secretário")' })
    .expect(400, done);
});

// Testes de validação da "senha"
it("should return an error when user 'senha' is empty", done => {
  const payload = {nome: 'john', email: 'john@gmail.com', telefone: "41999999999", funcao: "veterinário", senha: '', repetirSenha: ''};
  request(app)
    .post("/")
    .send(payload)    
    .expect({ erro: 'A senha não pode ser nula' })
    .expect(400, done);
});

it("should return an error when user 'senha' has less than 6 characters", done => {
  const payload = {nome: 'john', email: 'john@gmail.com', telefone: "41999999999", funcao: "veterinário", senha: 'Abc@_', repetirSenha: 'Abc@_'};
  request(app)
    .post("/")
    .send(payload)    
    .expect({ erro: 'A senha deve ter pelo menos 6 caracteres' })
    .expect(400, done);
});

it("should return an error when user 'senha' has spaces", done => {
  const payload = {nome: 'john', email: 'john@gmail.com', telefone: "41999999999", funcao: "veterinário", senha: 'Abc 123@_', repetirSenha: 'Abc 123@_'};
  request(app)
    .post("/")
    .send(payload)    
    .expect({ erro: 'A senha não pode ter espaços' })
    .expect(400, done);
});

it("should return an error when user 'senha' has no uppercase letters", done => {
  const payload = {nome: 'john', email: 'john@gmail.com', telefone: "41999999999", funcao: "veterinário", senha: 'abc123@_', repetirSenha: 'abc123@_'};
  request(app)
    .post("/")
    .send(payload)    
    .expect({ erro: 'A senha deve ter pelo menos 1 letra maiúscula' })
    .expect(400, done);
});

it("should return an error when user 'senha' has less than 2 special characters", done => {
  const payload = {nome: 'john', email: 'john@gmail.com', telefone: "41999999999", funcao: "veterinário", senha: 'Abc123_', repetirSenha: 'Abc123_'};
  request(app)
    .post("/")
    .send(payload)    
    .expect({ erro: 'A senha deve ter pelo menos 2 caracteres especiais' })
    .expect(400, done);
});

// Testes de validação do "repetir senha"

it("should return an error when user 'repetir senha' is different than 'senha'", done => {
  const payload = {nome: 'john', email: 'john@gmail.com', telefone: "41999999999", funcao: "veterinário", senha: 'Abc123@_', repetirSenha: 'outrasenha'};
  request(app)
    .post("/")
    .send(payload)    
    .expect({ erro: 'As senhas não conferem' })
    .expect(400, done);
});

// ---------------------------------------------------------------------
// Teste do método GET

it("should list the users", done => {
  const expected = {nome: 'john', email: 'john@gmail.com', telefone: "41999999999", funcao: "veterinário", senha: 'Abc123@_', repetirSenha: 'Abc123@_'};
  request(app)
    .get("/")
    .expect("Content-Type", /json/)
    .expect(res => {
      listedUser = res.body[0];
      
      if (listedUser.nome !== expected.nome) {
        throw new Error(`Expected 'nome' to be '${expected.nome}', but got '${res.body.nome}'`);
      }
      if (listedUser.email !== expected.email) {
        throw new Error(`Expected 'email' to be '${expected.email}', but got '${res.body.email}'`);
      }
      if (listedUser.telefone !== expected.telefone) {
        throw new Error(`Expected 'telefone' to be '${expected.telefone}', but got '${res.body.telefone}'`);
      }
      if (listedUser.funcao !== expected.funcao) {
        throw new Error(`Expected 'funcao' to be '${expected.funcao}', but got '${res.body.funcao}'`);
      }
      if (!bcrypt.compareSync(expected.senha, listedUser.senha)) {
        throw new Error("Password does not match");
      }
      if (!bcrypt.compareSync(expected.repetirSenha, listedUser.repetirSenha)) {
        throw new Error("Repeated password does not match");
      }
      
    })
    .expect(200, done);
});

// ---------------------------------------------------------------------
// Testes do método PATCH

it("should save the user", done => {
  const payload = {id: 1, nome: 'joão', email: 'joao@hotmail.com', telefone: "4133333333", funcao: "secretário", senha: 'Def456@_', repetirSenha: 'Def456@_', senhaAtual: 'Abc123@_'};
  hash = bcrypt.hash(payload.senha, 1);
  request(app)
    .patch("/")
    .send(payload)
    .expect(res => {
      if (res.body.nome !== payload.nome) {
        throw new Error(`Expected 'nome' to be '${payload.nome}', but got '${res.body.nome}'`);
      }
      if (res.body.email !== payload.email) {
        throw new Error(`Expected 'email' to be '${payload.email}', but got '${res.body.email}'`);
      }
      if (res.body.telefone !== payload.telefone) {
        throw new Error(`Expected 'telefone' to be '${payload.telefone}', but got '${res.body.telefone}'`);
      }
      if (res.body.funcao !== payload.funcao) {
        throw new Error(`Expected 'funcao' to be '${payload.funcao}', but got '${res.body.funcao}'`);
      }
      if (!bcrypt.compareSync(payload.senha, res.body.senha)) {
        throw new Error("Password does not match");
      }
      if (!bcrypt.compareSync(payload.repetirSenha, res.body.repetirSenha)) {
        throw new Error("Repeated password does not match");
      }
    })
    .expect(200, done);
});


it("should return an error when user is not found", done => {
  const payload = {id: 100, nome: 'joão', email: 'joao@hotmail.com', telefone: "4133333333", funcao: "secretário", senha: 'Def456@_', repetirSenha: 'Def456@_', senhaAtual: 'Abc123@_'};
  request(app)
    .patch("/")
    .send(payload)
    .expect({ erro: 'Usuário não encontrado' })
    .expect(404, done);
});

// Testes de validação do "nome"

it("should return an error when user 'nome' is empty", done => {
  const payload = {id: 1, nome: '', email: 'joao@hotmail.com', telefone: "4133333333", funcao: "secretário", senha: 'Def456@_', repetirSenha: 'Def456@_'};
  request(app)
    .patch("/")
    .send(payload)
    .expect({ erro: 'O nome é obrigatório' })
    .expect(400, done);
});

it("should return an error when user 'nome' is too long", done => {
  const payload = {id: 1, nome: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', email: 'joao@hotmail.com', telefone: "4133333333", funcao: "secretário", senha: 'Def456@_', repetirSenha: 'Def456@_'};
  request(app)
    .patch("/")
    .send(payload)
    .expect({ erro: 'O nome deve conter no máximo 35 caracteres' })
    .expect(400, done);
});

it("should return an error when user 'nome' has more than 3 words", done => {
  const payload = {id: 1, nome: 'joão pedro da silva', email: 'joao@hotmail.com', telefone: "4133333333", funcao: "secretário", senha: 'Def456@_', repetirSenha: 'Def456@_'};
  request(app)
    .patch("/")
    .send(payload)
    .expect({ erro: 'O nome deve conter no máximo 3 palavras' })
    .expect(400, done);
});

it("should return an error when user 'nome' contains special characters or numbers", done => {
  const payload = {id: 1, nome: 'john123', email: 'joao@hotmail.com', telefone: "4133333333", funcao: "secretário", senha: 'Def456@_', repetirSenha: 'Def456@_'};
  request(app)
    .patch("/")
    .send(payload)
    .expect({ erro: 'O nome não deve conter símbolos ou números' })
    .expect(400, done);
});

// Testes de validação do "email"

it("should return an error when user 'email' is empty", done => {
  const payload = {id: 1, nome: 'joão', email: '', telefone: "4133333333", funcao: "secretário", senha: 'Def456@_', repetirSenha: 'Def456@_'};
  request(app)
    .patch("/")
    .send(payload)
    .expect({ erro: 'O email é obrigatório' })
    .expect(400, done);
});

it("should return an error when user 'email' has an invalid domain", done => {
  const payload = {id: 1, nome: 'joão', email: 'joao@exemplo.com', telefone: "4133333333", funcao: "secretário", senha: 'Def456@_', repetirSenha: 'Def456@_'};
  request(app)
    .patch("/")
    .send(payload)
    .expect({ erro: 'O domínio do email não é válido (deve ser gmail, hotmail, outlook ou yahoo)' })
    .expect(400, done);
});

// Testes de validação do "telefone"

it("should return an error when user 'telefone' is empty", done => {
  const payload = {id: 1, nome: 'joão', email: 'joao@hotmail.com', telefone: "", funcao: "secretário", senha: 'Def456@_', repetirSenha: 'Def456@_'};
  request(app)
    .patch("/")
    .send(payload)    
    .expect({ erro: 'O número de telefone é obrigatório' })
    .expect(400, done);
});

it("should return an error when user 'telefone' has invalid characters", done => {
  const payload = {id: 1, nome: 'joão', email: 'joao@hotmail.com', telefone: "4199999abcd", funcao: "secretário", senha: 'Def456@_', repetirSenha: 'Def456@_'};
  request(app)
    .patch("/")
    .send(payload)    
    .expect({ erro: 'O número de telefone deve conter apenas números' })
    .expect(400, done);
});

it("should return an error when user 'telefone' has a wrong number of digits", done => {
  const payload = {id: 1, nome: 'joão', email: 'joao@hotmail.com', telefone: "419999912345", funcao: "secretário", senha: 'Def456@_', repetirSenha: 'Def456@_'};
  request(app)
    .patch("/")
    .send(payload)    
    .expect({ erro: 'O número de telefone deve ter de 10 a 11 dígitos' })
    .expect(400, done);
});

// Testes de validação da "funcao"

it("should return an error when user 'funcao' is empty", done => {
  const payload = {id: 1, nome: 'joão', email: 'joao@hotmail.com', telefone: "4133333333", funcao: "", senha: 'Def456@_', repetirSenha: 'Def456@_'};
  request(app)
    .patch("/")
    .send(payload)    
    .expect({ erro: 'A função não pode ser nula' })
    .expect(400, done);
});

it("should return an error when user 'funcao' is not 'veterinário' or 'secretário'", done => {
  const payload = {id: 1, nome: 'joão', email: 'joao@hotmail.com', telefone: "4133333333", funcao: "outro", senha: 'Def456@_', repetirSenha: 'Def456@_'};
  request(app)
    .patch("/")
    .send(payload)    
    .expect({ erro: 'Função inválida (deve ser apenas "veterinário" ou "secretário")' })
    .expect(400, done);
});

// Testes de validação da "senha"
it("should return an error when user 'senha' is empty", done => {
  const payload = {id: 1, nome: 'joão', email: 'joao@hotmail.com', telefone: "4133333333", funcao: "secretário", senha: '', repetirSenha: '', senhaAtual: 'Def456@_'};
  request(app)
    .patch("/")
    .send(payload)    
    .expect({ erro: 'A senha não pode ser nula' })
    .expect(400, done);
});

it("should return an error when user 'senha' has less than 6 characters", done => {
  const payload = {id: 1, nome: 'joão', email: 'joao@hotmail.com', telefone: "4133333333", funcao: "secretário", senha: 'Abc@_', repetirSenha: 'Abc@_', senhaAtual: 'Def456@_'};
  request(app)
    .patch("/")
    .send(payload)    
    .expect({ erro: 'A senha deve ter pelo menos 6 caracteres' })
    .expect(400, done);
});

it("should return an error when user 'senha' has spaces", done => {
  const payload = {id: 1, nome: 'joão', email: 'joao@hotmail.com', telefone: "4133333333", funcao: "secretário", senha: 'Abc 123@_', repetirSenha: 'Abc 123@_', senhaAtual: 'Def456@_'};
  request(app)
    .patch("/")
    .send(payload)    
    .expect({ erro: 'A senha não pode ter espaços' })
    .expect(400, done);
});

it("should return an error when user 'senha' has no uppercase letters", done => {
  const payload = {id: 1, nome: 'joão', email: 'joao@hotmail.com', telefone: "4133333333", funcao: "secretário", senha: 'abc123@_', repetirSenha: 'abc123@_', senhaAtual: 'Def456@_'};
  request(app)
    .patch("/")
    .send(payload)    
    .expect({ erro: 'A senha deve ter pelo menos 1 letra maiúscula' })
    .expect(400, done);
});

it("should return an error when user 'senha' has less than 2 special characters", done => {
  const payload = {id: 1, nome: 'joão', email: 'joao@hotmail.com', telefone: "4133333333", funcao: "secretário", senha: 'Abc123_', repetirSenha: 'Abc123_', senhaAtual: 'Def456@_'};
  request(app)
    .patch("/")
    .send(payload)    
    .expect({ erro: 'A senha deve ter pelo menos 2 caracteres especiais' })
    .expect(400, done);
});

it("should return an error when a new user 'senha' is informed but the current 'senhaAtual' is not informed", done => {
  const payload = {id: 1, nome: 'joão', email: 'joao@hotmail.com', telefone: "4133333333", funcao: "secretário", senha: 'Ghi789@_', repetirSenha: 'Ghi789@_'};
  request(app)
    .patch("/")
    .send(payload)    
    .expect({ erro: 'Informe a senha atual' })
    .expect(400, done);
});

it("should return an error when a new user 'senha' is informed but the current 'senhaAtual' is not correct", done => {
  const payload = {id: 1, nome: 'joão', email: 'joao@hotmail.com', telefone: "4133333333", funcao: "secretário", senha: 'Ghi789@_', repetirSenha: 'Ghi789@_', senhaAtual: 'Jkl123@_'};
  request(app)
    .patch("/")
    .send(payload)    
    .expect({ erro: 'A senha atual não confere' })
    .expect(400, done);
});

// Testes de validação do "repetir senha"

it("should return an error when user 'repetir senha' is different than 'senha'", done => {
  const payload = {id: 1, nome: 'joão', email: 'joao@hotmail.com', telefone: "4133333333", funcao: "secretário", senha: 'Ghi789@_', repetirSenha: 'outrasenha', senhaAtual: 'Def456@_'};
  request(app)
    .patch("/")
    .send(payload)    
    .expect({ erro: 'As senhas não conferem' })
    .expect(400, done);
});

// Teste para quando nenhum dado é alterado
it("should return the user if the data is the same", done => {
  const payload = {id: 1, nome: 'joão', email: 'joao@hotmail.com', telefone: "4133333333", funcao: "secretário", senha: 'Def456@_', repetirSenha: 'Def456@_'};
  hash = bcrypt.hash(payload.senha, 1);
  request(app)
    .patch("/")
    .send(payload)
    .expect(res => {
      if (res.body.nome !== payload.nome) {
        throw new Error(`Expected 'nome' to be '${payload.nome}', but got '${res.body.nome}'`);
      }
      if (res.body.email !== payload.email) {
        throw new Error(`Expected 'email' to be '${payload.email}', but got '${res.body.email}'`);
      }
      if (res.body.telefone !== payload.telefone) {
        throw new Error(`Expected 'telefone' to be '${payload.telefone}', but got '${res.body.telefone}'`);
      }
      if (res.body.funcao !== payload.funcao) {
        throw new Error(`Expected 'funcao' to be '${payload.funcao}', but got '${res.body.funcao}'`);
      }
      if (!bcrypt.compareSync(payload.senha, res.body.senha)) {
        throw new Error("Password does not match");
      }
      if (!bcrypt.compareSync(payload.repetirSenha, res.body.repetirSenha)) {
        throw new Error("Repeated password does not match");
      }
    })
    .expect(200, done);
});

// ---------------------------------------------------------------------
// Testes do método DELETE

it("should delete the user", done => {
  const payload = {id: 1};
  request(app)
    .delete("/")
    .send(payload)
    .expect(204, done);
});

it("should return an error when user is not found", done => {
  const payload = {id: 100};
  request(app)
    .delete("/")
    .send(payload)
    .expect({ erro: 'Usuário não encontrado' })
    .expect(404, done);
});