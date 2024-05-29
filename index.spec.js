const index = require("./index");

const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/", index);

it("should return the user info", done => {
  request(app)
    .get("/api/getUserInfo")
    .expect("Content-Type", /json/)
    .expect({ name: "john" })
    .expect(200, done);
});

it("should fail when the url is none", done => {
  request(app)
    .get("/api/getUserInfoo")
    .expect(404, done);
});