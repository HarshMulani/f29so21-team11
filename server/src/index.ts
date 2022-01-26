import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { v4 as uuidv4 } from 'uuid';
import { resolve } from "path";

const app = express();
// app.set("port", 80);

app.use(cors());
app.use(express.static(resolve("./dist/f29so-Project")))

const http = createServer(app);
// set up socket.io and bind it to our
// http server.
const io = new Server(http, { cors: { origin: '*' } });
// const io = new Server(http);

import { routes } from "./app/app"
import { server } from "./app/server"

import 'reflect-metadata';
import { createConnection } from "typeorm";
import { User } from "./entities/User";

createConnection({
  "type": "postgres",
  "url": "postgres://hejtorirdoiasa:fff3a90bf6e325dbae00f2aeb075b3c1a1805ab9f49844743faa0f97691094da@ec2-54-170-212-187.eu-west-1.compute.amazonaws.com:5432/d5vun71lh58dpi",
  "host": "ec2-54-170-212-187.eu-west-1.compute.amazonaws.com",
  "port": 5432,
  "username": "hejtorirdoiasa",
  "password": "fff3a90bf6e325dbae00f2aeb075b3c1a1805ab9f49844743faa0f97691094da",
  "database": "d5vun71lh58dpi",
  "synchronize": true,
  "logging": false,
  "entities": [
    __dirname + "/entities/**/*.js"
  ],
  "migrations": [
    "./migration/**/*.js"
  ],
  "subscribers": [
    "./subscriber/**/*.js"
  ],
  extra: {
    ssl: { rejectUnauthorized: false } 
  }
}).then(async connection => {
  let userRepo = connection.manager.getRepository(User);
  let U = await userRepo.find({ Username: 'TestUser' });
  if (U.length == 0) {
    let user = new User();
    user.ID = uuidv4();
    user.Username = 'TestUser';
    user.Password = 'TestPassword';
    user.Email = 'Test';
    await userRepo.save(user).catch((err) => console.log(err));
  }
  routes(app);
  server(io, connection);
}).catch(error => console.log(error))

const port = process.env.PORT || 5000;
const web_server = http.listen(port, function () {
  console.log(`listening on *:${port}`);
});

const app_server = app.listen(5000, function () {
  console.log(`listening on *:${5000}`);
})
