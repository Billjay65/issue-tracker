const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(5000);

  suite('Integration tests with chai-http', function () {
    // #1
    test('Test POST request to /api/issues/{project} with issue with every field', 
    function (done) {
      chai
        .request(server)
        .post('/api/issues/test-project') 
        .send({
          issue_title: 'Error Issue Tracker',
          issue_text: 'I am facing an error with issue tracker',
          created_by: 'Sikeh Japhet',
          assigned_to: 'Japhet Dev',
          status_text: 'In progress',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Error Issue Tracker');
          assert.equal(res.body.issue_text, 'I am facing an error with issue tracker');
          assert.equal(res.body.created_by, 'Sikeh Japhet');
          assert.equal(res.body.assigned_to, 'Japhet Dev');
          assert.equal(res.body.status_text, 'In progress');
          assert.property(res.body, '_id');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.equal(res.body.open, true);
          done();
        });
    });
    // #2
    test('Test POST request to /api/issues/{project} an issue with only required fields',
    function (done) {
      chai
        .request(server)
        .post('/api/issues/test-project')
        .send({ 
          issue_title: 'Error Issue Tracker',
          issue_text: 'I am facing an error with issue tracker',
          created_by: 'Sikeh Japhet',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Error Issue Tracker');
          assert.equal(res.body.issue_text, 'I am facing an error with issue tracker');
          assert.equal(res.body.created_by, 'Sikeh Japhet');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'status_text');
          assert.property(res.body, '_id');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.equal(res.body.open, true);
          done();
        });
    });
    // #3
    test('Test POST request to /api/issues/{project} an issue with missing required fields',
    function (done) {
      chai
        .request(server)
        .post('/api/issues/test-project')
        .send({ 
          issue_title: 'Error Issue Tracker',
          issue_text: 'I am facing an error with issue tracker',
          created_by: '', // missing field
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
    });
    // #4
    test('Test GET request to /api/issues/{project} view issues on a project',
    function (done) {
      chai
        .request(server)
        .get('/api/issues/test-project')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });
    // #5
    test('Test GET request to /api/issues/{project} view issues with a filter',
    function (done) {
      chai
        .request(server)
        .get('/api/issues/test-project?created_by=Sikeh Japhet')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body[0].created_by, 'Sikeh Japhet');
          done();
        });
    });

  });
});
