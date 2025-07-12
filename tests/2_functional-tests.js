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
    // #6
    test('Test GET request to /api/issues/{project} view issues with a multiple filters',
      function (done) {
        chai
          .request(server)
          .get('/api/issues/test-project?created_by=Sikeh Japhet&open=true')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.equal(res.body[0].created_by, 'Sikeh Japhet');
            assert.equal(res.body[0].open, true);
            done();
          });
      });
    // #7
    test('Test PUT request to /api/issues/{project} update one field on an issue', function (done) {
      // first, create an issue to update
      chai
        .request(server)
        .post('/api/issues/test-project')
        .send({
          issue_title: 'Update test',
          issue_text: 'Testing update field',
          created_by: 'Sikeh Japhet'
        })
        .end(function (err, res) {
          const idToUpdate = res.body._id;

          // now perform the PUT request with one field update
          chai
            .request(server)
            .put('/api/issues/test-project')
            .send({
              _id: idToUpdate,
              issue_text: 'Updated text'
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.result, 'successfully updated');
              assert.equal(res.body._id, idToUpdate);
              done();
            });
        });
    });
    // #8
    test('Test PUT request to /api/issues/{project} update multiple fields on an issue', function (done) {
      // first, create an issue to update
      chai
        .request(server)
        .post('/api/issues/test-project')
        .send({
          issue_title: 'Update test',
          issue_text: 'Testing update field',
          created_by: 'Sikeh Japhet'
        })
        .end(function (err, res) {
          const idToUpdate = res.body._id;

          // now perform the PUT request with one field update
          chai
            .request(server)
            .put('/api/issues/test-project')
            .send({
              _id: idToUpdate,
              issue_text: 'Updated text',
              created_by: 'Updated Jimmy'
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.result, 'successfully updated');
              assert.equal(res.body._id, idToUpdate);
              done();
            });
        });
    });
    // #9
    test('Test PUT request to /api/issues/{project} update an issue with missing _id', function (done) {
      // first, create an issue to update
      chai
        .request(server)
        .post('/api/issues/test-project')
        .send({
          issue_title: 'Update test',
          issue_text: 'Testing update field',
          created_by: 'Sikeh Japhet'
        })
        .end(function (err, res) {
          const idToUpdate = '';

          // now perform the PUT request with missing id
          chai
            .request(server)
            .put('/api/issues/test-project')
            .send({
              _id: idToUpdate,
              issue_text: 'Updated text'
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, 'missing _id');
              done();
            });
        });
    });
    // #10
    test('Test PUT request to /api/issues/{project} update an issue with no fields to update', function (done) {
      // first, create an issue to update
      chai
        .request(server)
        .post('/api/issues/test-project')
        .send({
          issue_title: 'Update test',
          issue_text: 'Testing update field',
          created_by: 'Sikeh Japhet'
        })
        .end(function (err, res) {
          const idToUpdate = res.body._id;

          // now perform the PUT request with missing id
          chai
            .request(server)
            .put('/api/issues/test-project')
            .send({
              _id: idToUpdate
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, 'no update field(s) sent');
              done();
            });
        });
    });
    // #11
    test('Test PUT request to /api/issues/{project} update an issue with invalid _id', function (done) {
      // define invalid _id
      const idToUpdate = '12we';

      // now perform the PUT request with missing id
      chai
        .request(server)
        .put('/api/issues/test-project')
        .send({
          _id: idToUpdate,
          issue_title: 'Update test',
          issue_text: 'Testing invalid id',
          created_by: 'Sikeh Japhet'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not update');
          done();
        });
    });
  });
  //12
  test('Test DELETE request to /api/issues/{project} delete an issue', function (done) {
    // first, create an issue to delete
    chai
      .request(server)
      .post('/api/issues/test-project')
      .send({
        issue_title: 'Delete test',
        issue_text: 'Testing delete field',
        created_by: 'Sikeh Japhet'
      })
      .end(function (err, res) {
        const idToDelete = res.body._id;

        // now perform the DELETE request
        chai
          .request(server)
          .delete('/api/issues/test-project')
          .send({
            _id: idToDelete
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully deleted');
            done();
          });
      });
  });
  //13
  test('Test DELETE request to /api/issues/{project} delete an issue with invalid _id', function (done) {
    const idToDelete = 'invalid id';

    // now perform the DELETE request
    chai
      .request(server)
      .delete('/api/issues/test-project')
      .send({
        _id: idToDelete
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not delete');
        done();
      });
  });
  //14
  test('Test DELETE request to /api/issues/{project} delete an issue with missing _id', function (done) {
    // define missing id
    const idToDelete = '';

    // now perform the DELETE request
    chai
      .request(server)
      .delete('/api/issues/test-project')
      .send({
        _id: idToDelete
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });


});

