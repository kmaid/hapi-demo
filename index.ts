"use strict";
import * as hapi from "hapi";

const inert = require('inert');
const lout = require('lout');
const vision = require('vision');
const fs = require('fs');
const knex = require('./src/database')(process.env.NODE_ENV);

const server: hapi.Server = new hapi.Server();
server.connection({ port: 3000 });

server.register([vision, inert, lout], (err) => {
    if (err) {
        throw err;
    }
    var controllerPath = "./src/controllers/";
    var controllers = fs.readdirSync(controllerPath);
    controllers.forEach(function (controller: string) {
        server.route(require(controllerPath + controller)(knex));
    });
    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log("server running at 3000");
    });
});

module.exports = server;
