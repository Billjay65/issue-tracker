'use strict';

const { json } = require('body-parser');
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
      // get project param and query url parameters
      const project = req.params.project;
      const query = req.query;

      // add project to the query object
      const filter = { project, ...query };

      // convert open field to boolean if present
      // convert string to boolean
      if (filter.open !== undefined) {
        filter.open = filter.open === 'true'; 
      }

      // query the database with all filters
      Issue.find(filter, (err, issues) => {
        if (err) {
          return res.json({ 
            error: 'could not get issues for project' 
          });
        }
        
        // return as array
        return res.json(issues); 
      });
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
      // define separate variables to hold id and submitted fields to update
      const { _id, ...fieldsToUpdate} = req.body;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      // remove empty or undefined fields
      const updates = {};
      Object.keys(fieldsToUpdate).forEach(key => {
        if (fieldsToUpdate[key] !== '' && fieldsToUpdate[key] !== undefined) {
          updates[key] = fieldsToUpdate[key];
        }
      });

      // if no update fields submitted, return error
      if (Object.keys(updates).length === 0) {
        return res.json({ error: 'no update field(s) sent', _id });
      }

      // update timestamp before updating issue
      updates.updated_on = new Date();

      // update issue based on id
      Issue.findByIdAndUpdate(_id, updates, { new: true }, (err, updatedDoc) => {
        if (err || !updatedDoc) {
          return res.json({ error: 'could not update', _id });
        }

        return res.json({ result: 'successfully updated', _id });
      });
    })

    .delete(function (req, res) {
      // get submitted issue id
      const _id = req.body._id;

      // Check for missing _id
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      // try to delete the issue
      Issue.findByIdAndDelete(_id, (err, deletedDoc) => {
        if (err || !deletedDoc) {
          return res.json({ error: 'could not delete', _id });
        }

        return res.json({ result: 'successfully deleted', _id });
      });
    });

};
