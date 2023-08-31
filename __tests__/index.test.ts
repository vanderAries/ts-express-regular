import { Response } from 'supertest';
import { ErrorResponse } from '../src/app/models/errors';

import { TaskRequest, TaskModel } from '../src/app/models/tasks';

import {
  postRequest,
  getRequest,
  putRequest,
  deleteRequest,
  closeConnection,
} from './requestHelper';

describe('Tasks Endpoints', () => {
  const newTask: TaskRequest = {
    name: 'Task 1',
    description: 'First task to do in home',
    category: 'home',
    state: 'active',
  };
  const updatedTask: TaskRequest = {
    name: 'Updated Task 1',
    description: 'Updated task to do in work',
    category: 'work',
    state: 'active',
  };
  let tempTaskId: string;
  let newTaskResponse: TaskModel;
  describe('POST /tasks', () => {
    describe('Success', () => {
      let response: Response;
      let task: TaskModel;
      beforeAll(async () => {
        response = await postRequest('/tasks', newTask);

        task = response.body as TaskModel;
        newTaskResponse = response.body as TaskModel;
        tempTaskId = task.id;
      });

      it('Should return status 201', () => {
        expect(response.statusCode).toEqual(201);
      });
      it('Should return new Task', () => {
        expect(task).toBeInstanceOf(Object);
        expect(typeof task.id).toBe('string');
        expect(task.name).toEqual(newTask.name);
        expect(task.description).toEqual(newTask.description);
        expect(task.category).toEqual(newTask.category);
        expect(task.state).toEqual(newTask.state);
        expect(typeof task.createdAt).toBe('string');
        expect(typeof task.updatedAt).toBe('string');
      });
    });

    describe('Validation Error', () => {
      let response: Response;
      let error: ErrorResponse;
      const newInvalidTask = {
        name: 'Invalid task',
        information: 'Should be description',
        category: 'hobby',
      };
      beforeAll(async () => {
        response = await postRequest('/tasks', newInvalidTask);
        error = response.body as ErrorResponse;
      });

      it('Should return status 400', () => {
        expect(response.statusCode).toEqual(400);
      });
      it('Should return Validation Error', () => {
        expect(error).toBeInstanceOf(Object);
        expect(error).toHaveProperty('title');
        expect(error).toHaveProperty('detail');
        // TODO
      });
    });
  });

  describe('GET /tasks', () => {
    describe('Success', () => {
      let response: Response;
      let tasks: TaskModel[];
      beforeAll(async () => {
        response = await getRequest('/tasks');
        tasks = response.body as TaskModel[];
      });

      it('Should return status 200', () => {
        expect(response.statusCode).toEqual(200);
      });
      it('Should return list of Tasks', () => {
        expect(tasks).toBeInstanceOf(Array);
      });
      it('Should have new Task in Task List', () => {
        expect(tasks).toContainEqual(newTaskResponse);
      });
    });
  });

  describe('GET /tasks/:taskId', () => {
    describe('Success', () => {
      let response: Response;
      let task: TaskModel;
      beforeAll(async () => {
        response = await getRequest(`/tasks/${tempTaskId}`);
        task = response.body as TaskModel;
      });

      it('Should return status 200', () => {
        expect(response.statusCode).toEqual(200);
      });
      it('Should have same ID', () => {
        expect(task).toBeInstanceOf(Object);
        expect(typeof task.id).toBe('string');
        expect(task.id).toEqual(tempTaskId);
      });
      it('Should return specific Task', () => {
        expect(task).toBeInstanceOf(Object);
        expect(task.name).toEqual(newTask.name);
        expect(task.description).toEqual(newTask.description);
        expect(task.category).toEqual(newTask.category);
        expect(task.state).toEqual(newTask.state);
        expect(typeof task.createdAt).toBe('string');
        expect(typeof task.updatedAt).toBe('string');
      });
    });

    describe('Not Found', () => {
      let response: Response;
      let error: ErrorResponse;
      beforeAll(async () => {
        response = await getRequest('/tasks/xxx');
        error = response.body as ErrorResponse;
      });

      it('Should return status 404', () => {
        expect(response.statusCode).toEqual(404);
      });
      it('Should return Not Found Error', () => {
        expect(error).toBeInstanceOf(Object);
        expect(error).toHaveProperty('title');
        expect(error).toHaveProperty('detail');
      });
    });
  });

  describe('PUT /tasks/:taskId', () => {
    describe('Success', () => {
      let response: Response;
      let task: TaskModel;
      beforeAll(async () => {
        response = await putRequest(`/tasks/${tempTaskId}`, updatedTask);
        task = response.body as TaskModel;
      });

      it('Should return status 200', () => {
        expect(response.statusCode).toEqual(200);
      });
      it('Should have same ID', () => {
        expect(task).toBeInstanceOf(Object);
        expect(typeof task.id).toBe('string');
        expect(task.id).toEqual(tempTaskId);
      });
      it('Should return new Task', () => {
        expect(task).toBeInstanceOf(Object);
        expect(task.name).toEqual(updatedTask.name);
        expect(task.description).toEqual(updatedTask.description);
        expect(task.category).toEqual(updatedTask.category);
        expect(task.state).toEqual(updatedTask.state);
        expect(typeof task.createdAt).toBe('string');
        expect(typeof task.updatedAt).toBe('string');
      });
      it('Should have Task with correct "updatedAt"', () => {
        expect(task.createdAt).toEqual(newTaskResponse.createdAt);
        expect(task.updatedAt).not.toEqual(newTaskResponse.updatedAt);
      });
    });

    describe('Validation Error', () => {
      let response: Response;
      let error: ErrorResponse;
      const updatedInvalidTask = {
        name: 'Updated Invalid task',
        information: 'Should be description',
        category: 'hobby',
      };
      beforeAll(async () => {
        response = await putRequest(`/tasks/${tempTaskId}`, updatedInvalidTask);
        error = response.body as ErrorResponse;
      });

      it('Should return status 400', () => {
        expect(response.statusCode).toEqual(400);
      });
      it('Should return Validation Error', () => {
        expect(error).toBeInstanceOf(Object);
        expect(error).toHaveProperty('title');
        expect(error).toHaveProperty('detail');
      });
    });

    describe('Not Found', () => {
      let response: Response;
      let error: ErrorResponse;
      beforeAll(async () => {
        response = await putRequest('/tasks/xxx', updatedTask);
        error = response.body as ErrorResponse;
      });

      it('Should return status 404', () => {
        expect(response.statusCode).toEqual(404);
      });
      it('Should return Not Found Error', () => {
        expect(error).toBeInstanceOf(Object);
        expect(error).toHaveProperty('title');
        expect(error).toHaveProperty('detail');
      });
    });
  });
  describe('DELETE /tasks/:taskId', () => {
    describe('Success', () => {
      let response: Response;
      beforeAll(async () => {
        response = await deleteRequest(`/tasks/${tempTaskId}`);
      });

      it('Should return status 204', () => {
        expect(response.statusCode).toEqual(204);
      });
    });

    describe('Not Found', () => {
      let response: Response;
      let error: ErrorResponse;
      beforeAll(async () => {
        response = await deleteRequest('/tasks/xxx');
        error = response.body as ErrorResponse;
      });

      it('Should return status 404', () => {
        expect(response.statusCode).toEqual(404);
      });
      it('Should return Not Found Error', () => {
        expect(error).toBeInstanceOf(Object);
        expect(error).toHaveProperty('title');
        expect(error).toHaveProperty('detail');
      });
    });
  });
});

closeConnection();
