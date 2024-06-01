const procedimento = require("./router-procedimento");

const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", procedimento);

// ---------------------------------------------------------------------
// Testes do método POST

it("should save the procedure", done => {
  const payload = { nome: 'cirurgia', especialidade: 'ortopedia', tempo: "2:00", necessidadeEquipe: "sim", equipe: 'anestesista' };
  request(app)
    .post("/")
    .send(payload)
    .expect(res => {
      if (res.body.nome !== payload.nome) {
        throw new Error(`Expected 'nome' to be '${payload.nome}', but got '${res.body.nome}'`);
      }
      if (res.body.especialidade !== payload.especialidade) {
        throw new Error(`Expected 'especialidade' to be '${payload.especialidade}', but got '${res.body.especialidade}'`);
      }
      if (res.body.tempo !== payload.tempo) {
        throw new Error(`Expected 'tempo' to be '${payload.tempo}', but got '${res.body.tempo}'`);
      }
      if (res.body.necessidadeEquipe !== payload.necessidadeEquipe) {
        throw new Error(`Expected 'necessidadeEquipe' to be '${payload.necessidadeEquipe}', but got '${res.body.necessidadeEquipe}'`);
      }
      if (res.body.equipe !== payload.equipe) {
        throw new Error(`Expected 'equipe' to be '${payload.equipe}', but got '${res.body.equipe}'`);
      }
    })
    .expect(201, done);
});

// Testes de validação do "nome"

it("should return an error when procedure 'nome' is empty", done => {
  const payload = { nome: '', especialidade: 'ortopedia', tempo: "2:00", necessidadeEquipe: "sim", equipe: 'anestesista' };
  request(app)
    .post("/")
    .send(payload)
    .expect({ erro: 'O nome é obrigatório' })
    .expect(400, done);
});

it("should return an error when procedure 'nome' is too long", done => {
  const payload = { nome: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', especialidade: 'ortopedia', tempo: "2:00", necessidadeEquipe: "sim", equipe: 'anestesista' };
  request(app)
    .post("/")
    .send(payload)
    .expect({ erro: 'O nome deve conter no máximo 30 caracteres' })
    .expect(400, done);
});

// Testes de validação da "especialidade"

it("should return an error when procedure 'especialidade' is empty", done => {
  const payload = { nome: 'cirurgia', especialidade: '', tempo: "2:00", necessidadeEquipe: "sim", equipe: 'anestesista' };
  request(app)
    .post("/")
    .send(payload)
    .expect({ erro: 'A especialidade é obrigatória' })
    .expect(400, done);
});

it("should return an error when procedure 'especialidade' is too long", done => {
  const payload = { nome: 'cirurgia', especialidade: 'aaaaaaaaaaaaaaaa', tempo: "2:00", necessidadeEquipe: "sim", equipe: 'anestesista' };
  request(app)
    .post("/")
    .send(payload)
    .expect({ erro: 'A especialidade não pode conter palavras com mais de 15 caracteres' })
    .expect(400, done);
});

// Testes de validação do "tempo médio"

it("should return an error when procedure 'tempo médio' is empty", done => {
  const payload = { nome: 'cirurgia', especialidade: 'ortopedia', tempo: "", necessidadeEquipe: "sim", equipe: 'anestesista' };
  request(app)
    .post("/")
    .send(payload)
    .expect({ erro: 'O tempo médio é obrigatório' })
    .expect(400, done);
});

it("should return an error when procedure 'tempo médio' is in the wrong format", done => {
  const payload = { nome: 'cirurgia', especialidade: 'ortopedia', tempo: "2h00", necessidadeEquipe: "sim", equipe: 'anestesista' };
  request(app)
    .post("/")
    .send(payload)
    .expect({ erro: 'O tempo médio deve estar no formato HH:MM, limitado a 24 horas' })
    .expect(400, done);
});

it("should return an error when procedure 'tempo médio' is not in 30 minute intervals", done => {
  const payload = { nome: 'cirurgia', especialidade: 'ortopedia', tempo: "2:15", necessidadeEquipe: "sim", equipe: 'anestesista' };
  request(app)
    .post("/")
    .send(payload)
    .expect({ erro: 'Somente são aceitos intervalos de 30 em 30 minutos' })
    .expect(400, done);
});

it("should return an error when procedure 'tempo médio' is lower than 30 minutes", done => {
  const payload = { nome: 'cirurgia', especialidade: 'ortopedia', tempo: "0:00", necessidadeEquipe: "sim", equipe: 'anestesista' };
  request(app)
    .post("/")
    .send(payload)
    .expect({ erro: 'O tempo médio não pode ser menor do que 30 minutos' })
    .expect(400, done);
});

it("should return an error when procedure 'tempo médio' is higher than 24 hours", done => {
  const payload = { nome: 'cirurgia', especialidade: 'ortopedia', tempo: "24:30", necessidadeEquipe: "sim", equipe: 'anestesista' };
  request(app)
    .post("/")
    .send(payload)
    .expect({ erro: 'O tempo médio não pode ser maior do que 24 horas' })
    .expect(400, done);
});

// Testes de validação da "necessidade de equipe"

it("should return an error when procedure 'necessidade de equipe' is empty", done => {
  const payload = { nome: 'cirurgia', especialidade: 'ortopedia', tempo: "2:00", necessidadeEquipe: "" };
  request(app)
    .post("/")
    .send(payload)
    .expect({ erro: 'O campo \'Necessidade de Equipe\' é obrigatório' })
    .expect(400, done);
});

it("should return an error when procedure 'necessidade de equipe' is different than 'sim' or 'não'", done => {
  const payload = { nome: 'cirurgia', especialidade: 'ortopedia', tempo: "2:00", necessidadeEquipe: "talvez", equipe: 'anestesista' };
  request(app)
    .post("/")
    .send(payload)
    .expect({ erro: 'O campo \'Necessidade de Equipe\' deve ser \'sim\' ou \'não\'' })
    .expect(400, done);
});

// Testes de validação da "equipe"

it("should return an error when procedure 'necessidade de equipe' is 'sim' but 'equipe' is empty", done => {
  const payload = { nome: 'cirurgia', especialidade: 'ortopedia', tempo: "2:00", necessidadeEquipe: "sim", equipe: '' };
  request(app)
    .post("/")
    .send(payload)
    .expect({ erro: 'A equipe necessária não pode ser nula se o campo \'Necessidade de Equipe\' for igual a \'sim\'' })
    .expect(400, done);
});

it("should set 'equipe' to 'undefined' if 'necessidade de equipe' is 'não'", done => {
  const payload = { nome: 'cirurgia', especialidade: 'ortopedia', tempo: "2:00", necessidadeEquipe: "não", equipe: 'anestesista' };
  request(app)
    .post("/")
    .send(payload)
    .expect(res => {
      if (res.body.necessidadeEquipe !== payload.necessidadeEquipe) {
        throw new Error(`Expected 'necessidadeEquipe' to be '${payload.necessidadeEquipe}', but got '${res.body.necessidadeEquipe}'`);
      }
      if (res.body.equipe !== undefined) {
        throw new Error(`Expected 'equipe' to be 'undefined', but got '${res.body.equipe}'`);
      }
    })
    .expect(201, done);
});

// ---------------------------------------------------------------------
// Teste do método GET

it("should list the procedures", done => {
  const expected = { nome: 'cirurgia', especialidade: 'ortopedia', tempo: "2:00", necessidadeEquipe: "sim", equipe: 'anestesista' };
  request(app)
    .get("/")
    .expect("Content-Type", /json/)
    .expect(res => {
      const listedProcedure = res.body[0];

      if (listedProcedure.nome !== expected.nome) {
        throw new Error(`Expected 'nome' to be '${expected.nome}', but got '${listedProcedure.nome}'`);
      }
      if (listedProcedure.especialidade !== expected.especialidade) {
        throw new Error(`Expected 'especialidade' to be '${expected.especialidade}', but got '${listedProcedure.especialidade}'`);
      }
      if (listedProcedure.tempo !== expected.tempo) {
        throw new Error(`Expected 'tempo' to be '${expected.tempo}', but got '${listedProcedure.tempo}'`);
      }
      if (listedProcedure.necessidadeEquipe !== expected.necessidadeEquipe) {
        throw new Error(`Expected 'necessidadeEquipe' to be '${expected.necessidadeEquipe}', but got '${listedProcedure.necessidadeEquipe}'`);
      }
      if (listedProcedure.equipe !== expected.equipe) {
        throw new Error(`Expected 'equipe' to be '${expected.equipe}', but got '${listedProcedure.equipe}'`);
      }

    })
    .expect(200, done);
});

// ---------------------------------------------------------------------
// Testes do método PATCH

it("should update the procedure", done => {
  const payload = { nome: 'consulta', especialidade: 'cardiologia', tempo: "0:30", necessidadeEquipe: "não" };
  request(app)
    .patch("/1")
    .send(payload)
    .expect(res => {
      if (res.body.nome !== payload.nome) {
        throw new Error(`Expected 'nome' to be '${payload.nome}', but got '${res.body.nome}'`);
      }
      if (res.body.especialidade !== payload.especialidade) {
        throw new Error(`Expected 'especialidade' to be '${payload.especialidade}', but got '${res.body.especialidade}'`);
      }
      if (res.body.tempo !== payload.tempo) {
        throw new Error(`Expected 'tempo' to be '${payload.tempo}', but got '${res.body.tempo}'`);
      }
      if (res.body.necessidadeEquipe !== payload.necessidadeEquipe) {
        throw new Error(`Expected 'necessidadeEquipe' to be '${payload.necessidadeEquipe}', but got '${res.body.necessidadeEquipe}'`);
      }
      if (res.body.equipe !== payload.equipe) {
        throw new Error(`Expected 'equipe' to be '${payload.equipe}', but got '${res.body.equipe}'`);
      }
    })
    .expect(200, done);
});

it("should return an error when updating a non-existent procedure", done => {
  const nonExistentId = 999;
  const payload = { nome: 'consulta', especialidade: 'cardiologia', tempo: "0:30", necessidadeEquipe: "não" };
  request(app)
    .patch(`/${nonExistentId}`)
    .send(payload)
    .expect(404)
    .expect({ erro: 'Procedimento não encontrado' }, done);
});

it("should return an error when trying to update procedure 'nome' with empty value", done => {
  const payload = { nome: '', especialidade: 'ortopedia', tempo: "2:00", necessidadeEquipe: "sim", equipe: 'anestesista' };
  request(app)
    .patch("/1")
    .send(payload)
    .expect({ erro: 'O nome é obrigatório' })
    .expect(400, done);
});

it("should return an error when trying to update procedure 'nome' with too long value", done => {
  const payload = { nome: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', especialidade: 'ortopedia', tempo: "2:00", necessidadeEquipe: "sim", equipe: 'anestesista' };
  request(app)
    .patch("/1")
    .send(payload)
    .expect({ erro: 'O nome deve conter no máximo 30 caracteres' })
    .expect(400, done);
});

// ---------------------------------------------------------------------
// Testes do método DELETE

it("should delete the procedure by id", done => {
  const payload = { nome: 'cirurgia', especialidade: 'ortopedia', tempo: "2:00", necessidadeEquipe: "sim", equipe: 'anestesista' };
  request(app)
    .post("/")
    .send(payload)
    .expect(201)
    .then(res => {
      const procedimentoId = res.body.id;

      return request(app)
        .delete(`/${procedimentoId}`)
        .expect(204)
        .then(() => {
          return request(app)
            .get("/")
            .expect(200)
            .expect(res => {
              const procedimento = res.body.find(p => p.id === procedimentoId);
              if (procedimento) {
                throw new Error(`Expected procedure with id '${procedimentoId}' to be deleted`);
              }
            });
        });
    })
    .then(() => done())
    .catch(done);
});

it("should return an error when trying to delete a non-existent procedure", done => {
  const nonExistentId = 999;
  request(app)
    .delete(`/${nonExistentId}`)
    .expect(404)
    .expect({ erro: 'Procedimento não encontrado' }, done);
});
