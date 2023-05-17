/**
 * Defining the List of dependencies/modules
 */
var express = require('express');
const dbService = require('./dbService');
const cors = require('cors');

var app = express();

app.use(cors());
app.options('*', cors());

/**
 * API to get the task details from the database using the database
 */
app.get('/tasks', function (req, res) {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllData();

  result
    .then(data => res.json({ data: data }))
    .catch(err => console.log(err));
});

// API to add a task into the database
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/upload', function (req, res) {
  const db = dbService.getDbServiceInstance();
  const { task_name } = req.body;
  const result = db.insertNewName(task_name);

  result
    .then(data => {
      if (data && data.task_id) {
        res.json({ data: data });
      } else {
        console.log('Error inserting new name');
      }
    })
    .catch(err => console.log(err));
});

// API for deleting a task from the database
app.delete('/remove/:task_id', (req, res) => {
  const { task_id } = req.params;
  const db = dbService.getDbServiceInstance();

  const result = db.deleteRowById(task_id);

  result
    .then(data => res.json({ success: data }))
    .catch(err => console.log(err));
});

// API for updating the Database
app.patch('/update', (req, res) => {
  const { task_id, task_name } = req.body;
  const db = dbService.getDbServiceInstance();

  const result = db.updateNameById(task_id, task_name);

  result
    .then(data => res.json({ success: data }))
    .catch(err => console.log(err));
});

// API for searching the task based on the task_name
app.get('/search/:task_name', (request, response) => {
  const { task_name } = request.params;
  const db = dbService.getDbServiceInstance();

  const result = db.searchByName(task_name);

  result
    .then(data => response.json({ data: data }))
    .catch(err => console.log(err));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
