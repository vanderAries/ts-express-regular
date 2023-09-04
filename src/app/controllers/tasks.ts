import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import taskService from '../services/tasks';
import { ErrorResponse } from '../models/errors';
import { TaskRequest } from '../models/tasks';

const createTask = (req: Request, res: Response) => {
  try {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      const errorRes: ErrorResponse = {
        title: 'Validation Error',
        detail:
          "Provided request body is invalid, check 'errors' for more info.",
        errors: validationError.array(),
      };

      return res.status(400).json(errorRes);
    }

    const taskInput = req.body as TaskRequest;

    const newTask = taskService.createTask(taskInput);
    return res.status(201).json(newTask);
  } catch (error) {
    console.log('Error in taskController');
    const errorRes: ErrorResponse = {
      title: 'Internal Server Error',
      detail:
        'Server encountered an unexpected problem',
    };
    return res.status(500).json(errorRes);
  }
};

const getAllTasks = (req: Request, res: Response) => {
  try {
    const tasks = taskService.getAllTasks();
    return res.status(200).json(tasks);
  } catch (error) {
    console.log('Error in taskController');
    const errorRes: ErrorResponse = {
      title: 'Internal Server Error',
      detail:
        'Server encountered an unexpected problem',
    };
    return res.status(500).json(errorRes);
  }
};

const getTaskById = (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const task = taskService.getTaskById(taskId);
    if (task === undefined) {
      const errorRes: ErrorResponse = {
        title: 'Not Found',
        detail: `Task with ID: '${taskId}' was not found.`,
      };
      return res.status(404).json(errorRes);
    }
    return res.status(200).json(task);
  } catch (error) {
    console.log('Error in taskController');
    const errorRes: ErrorResponse = {
      title: 'Internal Server Error',
      detail:
        'Server encountered an unexpected problem',
    };
    return res.status(500).json(errorRes);
  }
};

const updateTask = (req: Request, res: Response) => {
  try {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      const errorRes: ErrorResponse = {
        title: 'Validation Error',
        detail:
          "Provided request body is invalid, check 'errors' for more info.",
        errors: validationError.array(),
      };
      // check if it's better to use 'return' or 'else' statement
      return res.status(400).json(errorRes);
    }

    const taskId = req.params.id;
    const taskInput = req.body as TaskRequest;

    const updatedTask = taskService.updateTask(taskId, taskInput);

    if (updatedTask === undefined) {
      const errorRes: ErrorResponse = {
        title: 'Not Found',
        detail: `Task with ID: '${taskId}' was not found.`,
      };
      return res.status(404).json(errorRes);
    }

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.log('Error in taskController');
    const errorRes: ErrorResponse = {
      title: 'Internal Server Error',
      detail:
        'Server encountered an unexpected problem',
    };
    return res.status(500).json(errorRes);
  }
};

const deleteTask = (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;

    const deletedTask = taskService.deleteTask(taskId);

    if (deletedTask === undefined) {
      const errorRes: ErrorResponse = {
        title: 'Not Found',
        detail: `Task with ID: '${taskId}' was not found.`,
      };
      return res.status(404).json(errorRes);
    }

    return res.sendStatus(204);
  } catch (error) {
    console.log('Error in taskController');
    const errorRes: ErrorResponse = {
      title: 'Internal Server Error',
      detail:
        'Server encountered an unexpected problem',
    };
    return res.status(500).json(errorRes);
  }
};

export default {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
