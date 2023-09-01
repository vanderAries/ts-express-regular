/* eslint-disable @typescript-eslint/unbound-method */
import { Request, Response } from 'express';
import taskController from '../../../src/app/controllers/tasks';

import taskService from '../../../src/app/services/tasks';

describe('Task Services file operations error', () => {
  taskService.createTask = jest.fn(() => {
    throw new Error();
  });
  taskService.getAllTasks = jest.fn(() => {
    throw new Error();
  });
  taskService.getTaskById = jest.fn(() => {
    throw new Error();
  });
  taskService.updateTask = jest.fn(() => {
    throw new Error();
  });
  taskService.deleteTask = jest.fn(() => {
    throw new Error();
  });

  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  it('CreateTask | Should return 500 error', () => {
    req.body = {
      name: 'Sample Task',
      description: 'This is a sample task',
      category: 'work',
      state: 'active',
    };

    taskController.createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('getAllTasks | Should return 500 error', () => {
    taskController.getAllTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('getTaskById | Should return 500 error', () => {
    req.params = { id: 'xxx' };

    taskController.getTaskById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('updateTask | Should return 500 error', () => {
    req.params = { id: 'xxx' };
    req.body = {
      name: 'Sample Task',
      description: 'This is a sample task',
      category: 'work',
      state: 'active',
    };

    taskController.updateTask(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
  it('deleteTask | Should return 500 error', () => {
    req.params = { id: 'xxx' };

    taskController.deleteTask(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
