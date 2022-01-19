import { Express } from "express";
import * as path from "path";

var routes = (app: Express) => {

    app.get("/", (req, res) => {
        res.sendFile(path.resolve('/client/src/index.html'))
    });
}

export { routes };