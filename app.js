const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { validateTask } = require('./middleware');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const getTasks = () => {
  const rawData = fs.readFileSync(path.join(__dirname, 'tasks.json'));
  return JSON.parse(rawData);
};

const saveTasks = (tasks) => {
  fs.writeFileSync(path.join(__dirname, 'tasks.json'), JSON.stringify(tasks, null, 2));
};

app.post('/tasks', validateTask, (req, res) => {
  const tasks = getTasks();
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    status: req.body.status,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

app.get('/tasks', (req, res) => {
  const tasks = getTasks();
  res.status(200).json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === parseInt(req.params.id));

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(200).json(task);
});

app.put('/tasks/:id', validateTask, (req, res) => {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const updatedTask = { 
    ...tasks[taskIndex], 
    title: req.body.title, 
    status: req.body.status
  };

  tasks[taskIndex] = updatedTask;
  saveTasks(tasks);

  res.status(200).json(updatedTask);
});

app.delete('/tasks/:id', (req, res) => {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  saveTasks(tasks);

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
