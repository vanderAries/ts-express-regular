import fs from 'fs';
import taskService from '../../../src/app/services/tasks';
import { TaskRequest } from '../../../src/app/models/tasks';

jest.mock('fs');

describe('Task Services', () => {
  // Learn more about mocks!!!!
  // Maybe refactor to test only readTasksFromFile and writeTasksToFile.
  // We have integration tests for actual services functions.
  // If not, then test all services functions: getall, getone, create, update, delete
  const mockReadFileSync = jest.spyOn(fs, 'readFileSync');
  const mockWriteFileSync = jest.spyOn(fs, 'writeFileSync');

  afterEach(() => {
    mockReadFileSync.mockClear();
    mockWriteFileSync.mockClear();
  });

  it('should throw an error when reading tasks from file', () => {
    mockReadFileSync.mockImplementation(() => {
      throw new Error('Mocked read error');
    });

    expect(() => taskService.getAllTasks()).toThrow('Mocked read error');
  });

  it('should throw an error when writing tasks to file', () => {
    mockReadFileSync.mockReturnValue('[]');
    mockWriteFileSync.mockImplementation(() => {
      throw new Error('Mocked write error');
    });

    const taskInput: TaskRequest = {
      name: 'Sample Task',
      description: 'This is a sample task',
      category: 'work',
      state: 'active',
    };

    expect(() => taskService.createTask(taskInput)).toThrow('Mocked write error');
  });
});
