"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const path_1 = require("path");
var routes = (app) => {
    app.get("/", (req, res) => {
        res.sendFile((0, path_1.resolve)('/client/dist/f29so-Project/index.html'));
    });
};
exports.routes = routes;
