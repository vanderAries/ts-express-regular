import request, { Response } from 'supertest';
import server from '../../../src/server';

export async function postRequest(
  path: string,
  body: object,
): Promise<Response> {
  const response = await request(server).post(path).send(body);
  return response;
}

export async function getRequest(path: string): Promise<Response> {
  const response = await request(server).get(path);
  return response;
}

export async function putRequest(
  path: string,
  body: object,
): Promise<Response> {
  const response = await request(server).put(path).send(body);
  return response;
}

export async function deleteRequest(path: string): Promise<Response> {
  const response = await request(server).delete(path);
  return response;
}

export function closeConnection(): void {
  server.close(() => {
    console.log('Server is closed');
  });
}
