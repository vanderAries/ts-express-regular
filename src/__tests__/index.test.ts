import request, { Response } from 'supertest';
import server, { TaskRequest, TaskModel, TaskList, ErrorResponse } from '../index';

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
        response = await request(server).post('/tasks').send(newTask);
        task = response.body as TaskModel;
        newTaskResponse = response.body as TaskModel;
        tempTaskId = task.id;
        console.log('POST ID', tempTaskId);
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
        expect(new Date(task.createdAt)).toBeInstanceOf(Date);
        expect(new Date(task.updatedAt)).toBeInstanceOf(Date);
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
        response = await request(server).post('/tasks').send(newInvalidTask);
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
      let tasks: TaskList;
      beforeAll(async () => {
        response = await request(server).get('/tasks');
        tasks = response.body as TaskList;
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
        response = await request(server).get(`/tasks/${tempTaskId}`);
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
        expect(new Date(task.createdAt)).toBeInstanceOf(Date);
        expect(new Date(task.updatedAt)).toBeInstanceOf(Date);
        // TODO
      });
    });

    describe('Not Found', () => {
      let response: Response;
      let error: ErrorResponse;
      beforeAll(async () => {
        response = await request(server).get('/tasks/xxx');
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
        response = await request(server)
          .put(`/tasks/${tempTaskId}`)
          .send(updatedTask);
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
        expect(new Date(task.createdAt)).toBeInstanceOf(Date);
        expect(new Date(task.updatedAt)).toBeInstanceOf(Date);
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
        response = await request(server)
          .put(`/tasks/${tempTaskId}`)
          .send(updatedInvalidTask);
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
        response = await request(server)
          .put('/tasks/xxx')
          .send(updatedTask);
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
        response = await request(server).delete(`/tasks/${tempTaskId}`);
      });

      it('Should return status 204', () => {
        expect(response.statusCode).toEqual(204);
      });
    });

    describe('Not Found', () => {
      let response: Response;
      let error: ErrorResponse;
      beforeAll(async () => {
        response = await request(server).delete('/tasks/xxx');
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

server.close(() => {
  console.log('Server is closed');
});
