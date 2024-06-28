const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('User Routes', () => {
    it('should register a new user', (done) => {
        chai.request(app)
            .post('/api/users/register')
            .send({ username: 'testuser', password: 'testpassword', role_id: 2 }) // fail
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('id');
                done();
            });
    });
});