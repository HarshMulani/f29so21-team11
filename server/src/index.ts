import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { v4 as uuidv4 } from 'uuid';

const app = express();
// app.set("port", process.env.PORT || 3000);

app.use(cors());
app.use(express.static(path.resolve('/client/dist')))

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
import path from "path";

createConnection({
  "type": "postgres",
  "url": process.env.DBURL,
  "host": "ec2-52-209-134-160.eu-west-1.compute.amazonaws.com",
  "port": 5432,
  "username": "esrukslydhjkkj",
  "password": "d110f5da1d18386f5a6c2f22ab6893bc58dfca07f5817f9c5c8ff018c805a942",
  "database": "defadgioqb5462",
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

// const web_server = http.listen(3000, function () {
//   console.log("listening on *:3000");
// });

const port_num = http.listen(process.env.PORT || 3000)
app.listen(port_num)