const usuario = require("./router-usuario");

const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use("/", usuario);

it("should save the user", done => {
  const payload = {nome: 'john', email: 'john@gmail.com', telefone: "41999999999", funcao: "veterinário", senha: 'Abc123@_', repetirSenha: 'Abc123@_'};
  request(app)
    .post("/")
    .send(payload)    
    .expect({nome: 'john', email: 'john@gmail.com', telefone: "41999999999", funcao: "veterinário", senha: 'Abc123@_', repetirSenha: 'Abc123@_'})
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

// Teste do método GET

it("should list the users", done => {
  request(app)
    .get("/")
    .expect("Content-Type", /json/)
    .expect([{nome: 'john', email: 'john@gmail.com', telefone: "41999999999", funcao: "veterinário", senha: 'Abc123@_', repetirSenha: 'Abc123@_'}])
    .expect(200, done);
});

// Testes do método DELETE

it("should delete the user", done => {
  const payload = {nome: 'john', email: 'john@gmail.com', telefone: "41999999999", funcao: "veterinário", senha: 'Abc123@_', repetirSenha: 'Abc123@_'};
  request(app)
    .delete("/")
    .send(payload)
    .expect({nome: 'john', email: 'john@gmail.com', telefone: "41999999999", funcao: "veterinário", senha: 'Abc123@_', repetirSenha: 'Abc123@_'})
    .expect(200, done);
});