import { Express } from "express";
import * as path from "path";
import { resolve } from "path";

var routes = (app: Express) => {

    app.get("/", (req, res) => {
        res.sendFile(resolve('./client/src/index.html'))
    });
}

export { routes };