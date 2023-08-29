import express, { Application, Request, Response } from 'express';
import fs from 'fs';

// Models
type Category = 'work' | 'home';
type State = 'active' | 'finished';

interface TaskRequest {
  name: string;
  description: string | null;
  category: Category;
  state: State;
}

interface TaskState {
  state: State;
}

interface TaskModel {
  id: string;
  name: string;
  description: string;
  category: Category;
  state: State;
  createdAt: Date;
  updatedAt: Date;
}

// Boot express
const app: Application = express();
const port = 3000;

app.use(express.json());

// Application routing
// Create new Task
app.post('/tasks', (req: Request, res: Response) => {
  const body = req.body as TaskRequest;

  res.status(201).json({
    message: 'New Task was created',
    task: body,
  });
});

// Get list of Tasks
app.get('/tasks', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'List of Tasks',
  });
});

// Get one Task
app.get('/tasks/:taskId', (req: Request, res: Response) => {
  res.status(200).json({
    message: `Task with ID: ${req.params.taskId}`,
  });
});

// Edit whole Task
app.put('/tasks/:taskId', (req: Request, res: Response) => {
  const body = req.body as TaskRequest;
  res.status(200).json({
    message: `Task with ID: ${req.params.taskId} was updated`,
    task: body,
  });
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
  res.status(204).json({
    message: `Task with ID: ${req.params.taskId} was deleted`,
  });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server is listening on port http://localhost:${port}`);
});

export default server;
