'use strict';

const Issue = require('../models/Issue'); 

module.exports = function (app) {
  /* my version */
  // define method locally in this file
  const createAndSaveIssue = (issueData, done) => {
    const issue = new Issue(issueData);

    issue.save((err, savedIssue) => {
      if (err) return done(err);
      return done(null, savedIssue);
    })
  };

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;

    })

    .post(function (req, res) {
      let project = req.params.project;
      console.log(project);
      // get submitted form data  
      const issueTitle = req.body.issue_title;
      const issueText = req.body.issue_text;
      const createdBy = req.body.created_by;
      const assignedTo = req.body.assigned_to;
      const statusText = req.body.status_text;

      // check required fields and return error
      if (!issueTitle || !issueText || !createdBy) {
        console.log('Missing required field!');
        return res.json({
          error: 'required field(s) missing'
        });
      }
      
      // build issueData object with input
      const issueData = {
        project: project,
        issue_title: issueTitle,
        issue_text: issueText,
        created_by: createdBy,
        assigned_to: assignedTo || '',
        status_text: statusText || '',
        created_on: new Date(),
        updated_on: new Date(),
        open: true
      }
      // create and save issue in database
      createAndSaveIssue(issueData, (err, saved) => {
        if (err) {
          return res.json({ error: 'could not save issue' });
        }

        res.json({
          _id: saved._id,
          issue_title: saved.issue_title,
          issue_text: saved.issue_text,
          created_on: saved.created_on,
          updated_on: saved.updated_on,
          created_by: saved.created_by,
          assigned_to: saved.assigned_to,
          open: saved.open,
          status_text: saved.status_text,
        })
      });
    })

    .put(function (req, res) {
      let project = req.params.project;

    })

    .delete(function (req, res) {
      let project = req.params.project;

    });

};
