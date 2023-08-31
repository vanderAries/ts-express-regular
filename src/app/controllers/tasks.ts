import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import taskService from '../services/tasks';
import { ErrorResponse } from '../models/errors';
import { TaskRequest } from '../models/tasks';

const createTask = (req: Request, res: Response) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const error: ErrorResponse = {
        title: 'Validation Error',
        detail:
          "Provided request body is invalid, check 'errors' for more info.",
        errors: result.array(),
      };

      return res.status(400).json(error);
    }

    const taskInput = req.body as TaskRequest;

    const newTask = taskService.createTask(taskInput);
    return res.status(201).json(newTask);
  } catch {
    const error: ErrorResponse = {
      title: 'Internal Server Error',
      detail:
        'Server encountered an unexpected problem',
    };
    return res.status(500).json(error);
  }
};

const getAllTasks = (req: Request, res: Response) => {
  const tasks = taskService.getAllTasks();
  res.status(200).json(tasks);
};

const getTaskById = (req: Request, res: Response) => {
  const taskId = req.params.id;
  const task = taskService.getTaskById(taskId);
  if (task === undefined) {
    const error: ErrorResponse = {
      title: 'Not Found',
      detail: `Task with ID: '${taskId}' was not found.`,
    };
    return res.status(404).json(error);
  }
  return res.status(200).json(task);
};

const updateTask = (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error: ErrorResponse = {
      title: 'Validation Error',
      detail:
        "Provided request body is invalid, check 'errors' for more info.",
      errors: result.array(),
    };
    // check if it's better to use 'return' or 'else' statement
    return res.status(400).json(error);
  }

  const taskId = req.params.id;
  const taskInput = req.body as TaskRequest;

  const updatedTask = taskService.updateTask(taskId, taskInput);

  if (updatedTask === undefined) {
    const error: ErrorResponse = {
      title: 'Not Found',
      detail: `Task with ID: '${taskId}' was not found.`,
    };
    return res.status(404).json(error);
  }

  return res.status(200).json(updatedTask);
};

const deleteTask = (req: Request, res: Response) => {
  const taskId = req.params.id;

  const deletedTask = taskService.deleteTask(taskId);

  if (deletedTask === undefined) {
    const error: ErrorResponse = {
      title: 'Not Found',
      detail: `Task with ID: '${taskId}' was not found.`,
    };
    return res.status(404).json(error);
  }

  return res.sendStatus(204);
};

export default {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
