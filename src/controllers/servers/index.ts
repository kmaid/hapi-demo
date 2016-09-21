import * as hapi from "hapi";
var joi = require('joi');
var boom = require('boom');

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host : '127.0.0.1',
        user : 'root',
        password : 'testing',
        database : 'hapi-demo_dev'
    }
});

const PATH = "/servers";

module.exports = [
    {
        method: "GET",
        path: PATH + "/",
        handler: (request: hapi.Request, reply: hapi.IReply) => {
            reply(knex('servers').select().then(function(servers: array){
                return servers;
            }))
        }
    },
    {
        method: "GET",
        path: PATH + "/{id}",
        handler: (request: hapi.Request, reply: hapi.IReply) => {
            reply(knex('servers').select().where('id', request.params.id).then(function(server) {
                if (server.length == 1) return server;
                else return boom.notFound();
            }))
        }
    },
    {
        method: "POST",
        path: PATH + "/",
        handler: (request:hapi.Request, reply:hapi.IReply) => {
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
                    name: joi.string().required().min(3).max(45),
                    ip: joi.string().required().max(45)
                }
            }
        }
    },
    {
        method: "POST",
        path: PATH + "/{id}",
        handler: (request: hapi.Request, reply: hapi.IReply) => {
            var server = {
                id: request.payload.id,
                name: request.payload.name,
                ip: request.payload.ip
            };
            knex('servers').where('id', request.params.id).update(server).then(function (result: array) {
                reply(server);
            });
        },
        config: {
            validate: {
                payload: {
                    id: joi.number().required(),
                    name: joi.string().required().min(3).max(45),
                    ip: joi.string().required().max(45)
                }
            }
        }
    },
    {
        method: "PATCH",
        path: PATH + "/{id}",
        handler: (request: hapi.Request, reply: hapi.IReply) => {
            reply(knex('servers').select().where('id', request.params.id).then(function(servers: Array<any>) {
                if (servers.length == 1) {
                    var server = servers[0];
                    _.forEach(request.payload, function(value, key) {
                        server[key] = value;
                    });
                    return knex('servers').where('id', request.params.id).update(server).then(function (result: array) {
                        return(server);
                    });
                }
                else return(boom.notFound());
            }))
        },
        config: {
            validate: {
                payload: {
                    id: joi.number(),
                    name: joi.string().min(3).max(45),
                    ip: joi.string().max(45)
                }
            }
        }
    },
    {
        method: "DELETE",
        path: PATH + "/{id}",
        handler: (request: hapi.Request, reply: hapi.IReply) => {
            knex('servers').where('id', request.params.id).del().then(function (result) {
                if (result >= 1) reply({"success": true})
                else reply (boom.notFound());
            })
        }
    }
];