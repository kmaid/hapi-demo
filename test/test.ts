const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

const app = require("../index")

describe('Example Server', () => {
    it('GET /docs', (done) => {
        app.inject('/docs', (res) => {
            expect(res.statusCode).to.equal(200);
            done();
        })
    });
});