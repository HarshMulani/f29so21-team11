import { Express } from "express";
import * as path from "path";

var routes = (app: Express) => {

    app.get("/", (req, res) => {
        res.sendFile(path.resolve('/client/dist/f29so-Project/index.html'))
    });
}

export { routes };