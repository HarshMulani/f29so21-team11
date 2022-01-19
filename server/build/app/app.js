"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
var routes = (app) => {
    app.get("*", (req, res) => {
        res.sendFile(__dirname + '../../../client/src/index.html');
    });
};
exports.routes = routes;
