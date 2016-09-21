"use strict";
import * as Hapi from "hapi";
var Joi = require('joi');
var Boom = require('boom');

const server: Hapi.Server = new Hapi.Server();
server.connection({ port: 3000 });

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log("server running at 3000");
});

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host : '127.0.0.1',
        user : 'root',
        password : 'testing',
        database : 'hapi-demo_dev'
    }
});

server.route({
    method: "GET",
    path: "/",
    handler: (request: Hapi.Request, reply: Hapi.IReply) => {
        reply(knex('servers').select().then(function(servers: array){
            return servers;
        }))
    }
});

server.route({
    method: "GET",
    path: "/{id}",
    handler: (request: Hapi.Request, reply: Hapi.IReply) => {
        reply(knex('servers').select().where('id', request.params.id).then(function(server) {
            if (server.length == 1) return server;
            else return Boom.notFound();
        }))
    }
});

server.route({
    method: "POST",
    path: "/",
    handler: (request:Hapi.Request, reply:Hapi.IReply) => {
        var server = {
            name: request.payload.name,
            ip: request.payload.ip
        };
        knex('servers').insert(server).then( function (result: array) {
            server['id'] = result[0];
            reply(server);
        });
    },
    config: {
        validate: {
            payload: {
                name: Joi.string().required().min(3).max(45),
                ip: Joi.string().required().max(45)
            }
        }
    }
});

server.route({
    method: "POST",
    path: "/{id}",
    handler: (request: Hapi.Request, reply: Hapi.IReply) => {
        var server = {
            id: request.payload.id,
            name: request.payload.name,
            ip: request.payload.ip
        };
        knex('servers').where('id', params.request.params.id).update(server).then(function (result: array) {
            reply(server);
        });
    },
    config: {
        validate: {
            payload: {
                id: Joi.integer().required(),
                name: Joi.string().required().min(3).max(45),
                ip: Joi.string().required().max(45)
            }
        }
    }
});

server.route({
    method: "PATCH",
    path: "/{id}",
    handler: (request: Hapi.Request, reply: Hapi.IReply) => {
        reply('update')
    }
});

server.route({
    method: "DELETE",
    path: "/{id}",
    handler: (request: Hapi.Request, reply: Hapi.IReply) => {
        knex('servers').where('id', params.request.params.id).del().then(function (result) {
            reply(result);
        })
    }
});
