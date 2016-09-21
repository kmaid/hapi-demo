"use strict";
import * as Hapi from "hapi";

const Inert = require('inert');
const Lout = require('lout');
const Vision = require('vision');
const Fs = require('fs');
const Path = require('path');


const server: Hapi.Server = new Hapi.Server();
server.connection({ port: 3000 });

server.register([Vision, Inert, Lout], (err) => {
    if (err) {
        throw err;
    }
    var controllerPath = "./src/controllers/";
    var controllers = Fs.readdirSync(controllerPath);
    controllers.forEach(function (controller) {
        if (Path.extname(controllerPath + controller) === '.js') {
            server.route(require(controllerPath + controller));
        }
    });
    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log("server running at 3000");
    });
});
