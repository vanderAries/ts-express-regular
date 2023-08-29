import express, { Application, Request, Response } from 'express';
import { checkSchema, validationResult } from 'express-validator';
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

const taskValidationSchema = {
  name: {
    exists: {
      errorMessage: 'Task name is required',
    },
    isString: {
      errorMessage: 'Task name should be string',
    },
  },
  description: {
    optional: true,
    isString: {
      errorMessage: 'Task description should be string',
    },
  },
  category: {
    exists: {
      errorMessage: 'Task category is required',
    },
    isIn: {
      options: [['work', 'home']],
      errorMessage: 'Invalid category. Has to be \'work\' or \'home\'',
    },
  },
  state: {
    exists: {
      errorMessage: 'Task state is required',
    },
    isIn: {
      options: [['active', 'finished']],
      errorMessage: 'Invalid state. Has to be \'active\' or \'finished\'',
    },
  },
};

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
  errors?: object[];
}

// Boot express
const app: Application = express();
const port = 3000;

app.use(express.json());

// temporary list of tasks
const tasks: TaskList = [];

// Application routing
// Create new Task
app.post('/tasks', checkSchema(taskValidationSchema), (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error: ErrorResponse = {
      title: 'Validation Error',
      detail: 'Provided request body is invalid, check \'errors\' for more info.',
      errors: result.array(),
    };
    res.status(400).json(error);
  }

  const taskInput = req.body as TaskRequest;

  // Generate ID for the new task
  const id = crypto.randomUUID();

  // Create the new TaskModel object with the provided data and generated values
  const newTask: TaskModel = {
    id,
    name: taskInput.name,
    description: taskInput.description,
    category: taskInput.category,
    state: taskInput.state,
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
      detail: `Task with ID: '${taskId}' was not found.`,
    };
    res.status(404).json(error);
  }
});

// Edit whole Task
app.put('/tasks/:taskId', checkSchema(taskValidationSchema), (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error: ErrorResponse = {
      title: 'Validation Error',
      detail: 'Provided request body is invalid, check \'errors\' for more info.',
      errors: result.array(),
    };
    res.status(400).json(error);
  }

  const { taskId } = req.params;
  const taskInput = req.body as TaskRequest;

  const task = tasks.find((taskRecord) => taskRecord.id === taskId);
  if (task !== undefined) {
    // Create the new TaskModel object with the provided data and generated values
    const updatedTask: TaskModel = {
      id: task.id,
      name: taskInput.name,
      description: taskInput.description,
      category: taskInput.category,
      state: taskInput.state,
      createdAt: task.createdAt,
      updatedAt: new Date(),
    };

    const taskIndex = tasks.indexOf(task);

    tasks[taskIndex] = updatedTask;

    res.status(200).json(updatedTask);
  } else {
    const error: ErrorResponse = {
      title: 'Not Found',
      detail: `Task with ID: '${taskId}' was not found.`,
    };
    res.status(404).json(error);
  }
});

// Change Task state
app.patch('/tasks/:taskId', (req: Request, res: Response) => {
  const taskInput = req.body as TaskState;
  res.status(200).json({
    message: `Task with ID: ${req.params.taskId} was updated.`,
    task: taskInput,
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
      detail: `Task with ID: '${taskId}' was not found.`,
    };
    res.status(404).json(error);
  }
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server is listening on port http://localhost:${port}`);
});

export default server;
