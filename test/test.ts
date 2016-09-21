const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;
const knex = require('../src/database')(process.env.NODE_ENV);

const app = require("../index")

Promise.all([
    knex.raw('truncate table servers'),
    knex.insert({"id":1, "name":"test1", "ip":"127.0.0.1"}).into("servers"),
    knex.insert({"id":2, "name":"testd", "ip":"192.168.0.1"}).into("servers"),
    knex.insert({"id":3, "name":"test3", "ip":"255.255.255.255"}).into("servers")
]);
var transaction = knex.transaction(function(t) {
    return t;
});

describe('Hapi Demo', () => {
    lab.beforeEach((done) => {
        transaction.rollback;
        done();
    });

    it('GET /docs', (done) => {
        app.inject('/docs', (res) => {
            expect(res.statusCode).to.equal(200);
            done();
        })
    });

    it('GET /invalid-url', (done) => {
        app.inject('/invalid-url', (response) => {
            expect(response.statusCode).to.equal(404);
            expect(response.result).to.equal({statusCode: 404, error: 'Not Found'});
            done();
        })
    });

    describe('/servers endpoint', () => {
        describe('GET /servers', () => {
            it('Return list of servers', (done) => {
                app.inject('/servers', (response) => {
                    expect(response.statusCode).to.equal(200);
                    done();
                })
            });
        })  
})});