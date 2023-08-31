import { validationResult } from 'express-validator';
import { Request } from 'express';
import validateTaskData from '../../../src/app/middleware/taskValidation';

describe('Validation Middleware', () => {
  let req: Request;

  beforeEach(() => {
    req = {} as Request;
  });

  it('Should pass validation with description', async () => {
    req.body = {
      name: 'Sample Task',
      description: 'This is a sample task',
      category: 'work',
      state: 'active',
    };

    await validateTaskData.run(req);
    const validationError = validationResult(req);

    expect(validationError.isEmpty()).toBeTruthy();
  });

  it('Should pass validation without description', async () => {
    req.body = {
      name: 'Sample Task',
      category: 'work',
      state: 'active',
    };

    await validateTaskData.run(req);
    const validationError = validationResult(req);

    expect(validationError.isEmpty()).toBeTruthy();
  });

  it.todo('Should return \'name\' type error', async () => {
  });
  it.todo('Should return \'name\' required parameter error', async () => {
  });
  it.todo('Should return \'description\' type error', async () => {
  });
  it.todo('Should return \'category\' required parameter error', async () => {
  });
  it.todo('Should return \'category\' enum error', async () => {
  });
  it.todo('Should return \'state\' required parameter error', async () => {
  });
  it.todo('Should return \'state\' enum error', async () => {
  });
});
