import request from 'supertest';
import server from '../index';

describe('Tasks Endpoints', () => {
  describe('GET /tasks', () => {
    it('Should return status 200', async () => {
      const res = await request(server).get('/tasks');
      expect(res.statusCode).toEqual(200);
    });
    it('Should return list of Tasks', async () => {
      const res = await request(server).get('/tasks');
      expect(res.body).toBeInstanceOf(Array);
    });
  });
});

server.close(() => {
  console.log('Server is closed');
});
