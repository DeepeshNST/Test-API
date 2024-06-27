const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, connection } = require('../src/index');
const should = chai.should();
const mysql = require('mysql2');
chai.use(chaiHttp);


describe('Usernames API', () => {

    beforeEach((done) => {
        connection.query('DELETE FROM usernames', (err) => {
            if (err) throw err;
            done();
        });
    });

    describe('POST /usernames', () => {
        it('should create a new username', (done) => {
            chai.request(app)
                .post('/usernames')
                .send({ username: 'test_user' })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.text.should.equal('Username added');

                    connection.query('SELECT * FROM usernames WHERE username = ?', ['test_user'], (err, results) => {
                        if (err) throw err;
                        results.should.be.a('array');
                        results.length.should.be.eql(1);
                        results[0].username.should.equal('test_user');
                        done();
                    });
                });
        });
    });

    describe('GET /usernames', () => {
        it('should get all usernames', (done) => {
            const seedDataQuery = `
            INSERT INTO usernames (username)
            VALUES 
                ('john_doe'),
                ('jane_smith'),
                ('alice_johnson')
            `;
            connection.query(seedDataQuery, (err, results) => {
                if (err) throw err;

                chai.request(app)
                    .get('/usernames')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(3);
                        done();
                    });
            });
        });
    });

    describe('PUT /usernames/:id', () => {
        it('should update a username by id', (done) => {
            const seedQuery = 'INSERT INTO usernames (username) VALUES (?)';
            connection.query(seedQuery, ['original_user'], (err, results) => {
                if (err) throw err;
                const id = results.insertId;
                chai.request(app)
                    .put(`/usernames/${id}`)
                    .send({ username: 'updated_user' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.text.should.equal('Username updated');

                        // Verify the database
                        connection.query('SELECT * FROM usernames WHERE id = ?', [id], (err, results) => {
                            if (err) throw err;
                            results.should.be.a('array');
                            results.length.should.be.eql(1);
                            results[0].username.should.equal('updated_user');
                            done();
                        });
                    });
            });
        });
    });

    describe('DELETE /usernames/:id', () => {
        it('should delete a username by id', (done) => {
            const seedQuery = 'INSERT INTO usernames (username) VALUES (?)';
            connection.query(seedQuery, ['delete_user'], (err, results) => {
                if (err) throw err;
                const id = results.insertId;
                chai.request(app)
                    .delete(`/usernames/${id}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.text.should.equal('Username deleted');

                        connection.query('SELECT * FROM usernames WHERE id = ?', [id], (err, results) => {
                            if (err) throw err;
                            results.should.be.a('array');
                            results.length.should.be.eql(0);
                            done();
                        });
                    });
            });
        });
    });
});
