var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function() {

  describe('movie route', function() {

    describe('GET /movie', function() {

        it('should return an empty array', function (done) {

            request(server)
                .get('/movies')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);

                    res.body.should.have.property("movies");

                    done();
                });
        });
    });

    describe('POST /movie', function() {
      it('should accept a movie', function(done) {

        request(server)
          .post('/movies')
          .send({ title: 'Underworld', year: 2003})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.description.should.eql('Movie added to the list!');

            done();
          });
      });

    });

  });

});
