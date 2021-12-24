import { Express } from "express";
import * as path from "path";

var routes = (app: Express) => {

    app.get("/", (req, res) => {
        res.send("message");
    });
}

export { routes };