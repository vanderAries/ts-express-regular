import express, { Application, Request, Response } from 'express';
import crypto from 'crypto';
import fs from 'fs';

// Models
type Category = 'work' | 'home';
type State = 'active' | 'finished';

export interface TaskRequest {
  name: string;
  description: string | null;
  category: Category;
  state: State;
}

interface TaskState {
  state: State;
}

export interface TaskModel {
  id: string;
  name: string;
  description: string | null;
  category: Category;
  state: State;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskList = TaskModel[];

export interface ErrorResponse {
  title: string;
  detail: string;
}

// Boot express
const app: Application = express();
const port = 3000;

app.use(express.json());

// temporary list of tasks
const tasks: TaskList = [];

// Application routing
// Create new Task
app.post('/tasks', (req: Request, res: Response) => {
  const body = req.body as TaskRequest;

  // Generate ID for the new task
  const id = crypto.randomUUID();

  // Create the new TaskModel object with the provided data and generated values
  const newTask: TaskModel = {
    id,
    name: body.name,
    description: body.description,
    category: body.category,
    state: body.state,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// Get list of Tasks
app.get('/tasks', (req: Request, res: Response) => {
  res.status(200).json(tasks);
});

// Get one Task
app.get('/tasks/:taskId', (req: Request, res: Response) => {
  const { taskId } = req.params;
  const task = tasks.find((taskRecord) => taskRecord.id === taskId);
  if (task !== undefined) {
    res.status(200).json(task);
  } else {
    const error: ErrorResponse = {
      title: 'Not Found',
      detail: `Task with ID: '${taskId}' was not found`,
    };
    res.status(404).json(error);
  }
});

// Edit whole Task
app.put('/tasks/:taskId', (req: Request, res: Response) => {
  const { taskId } = req.params;
  const body = req.body as TaskRequest;

  const task = tasks.find((taskRecord) => taskRecord.id === taskId);
  if (task !== undefined) {
    // Create the new TaskModel object with the provided data and generated values
    const updatedTask: TaskModel = {
      id: task.id,
      name: body.name,
      description: body.description,
      category: body.category,
      state: body.state,
      createdAt: task.createdAt,
      updatedAt: new Date(),
    };

    const taskIndex = tasks.indexOf(task);

    tasks[taskIndex] = updatedTask;

    res.status(200).json(updatedTask);
  } else {
    const error: ErrorResponse = {
      title: 'Not Found',
      detail: `Task with ID: '${taskId}' was not found`,
    };
    res.status(404).json(error);
  }
});

// Change Task state
app.patch('/tasks/:taskId', (req: Request, res: Response) => {
  const body = req.body as TaskState;
  res.status(200).json({
    message: `Task with ID: ${req.params.taskId} was updated`,
    task: body,
  });
});

// Delete Task
app.delete('/tasks/:taskId', (req: Request, res: Response) => {
  const { taskId } = req.params;
  const taskIndex = tasks.findIndex((taskRecord) => taskRecord.id === taskId);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    res.sendStatus(204);
  } else {
    const error: ErrorResponse = {
      title: 'Not Found',
      detail: `Task with ID: '${taskId}' was not found`,
    };
    res.status(404).json(error);
  }
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server is listening on port http://localhost:${port}`);
});

export default server;
