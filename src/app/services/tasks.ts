import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { TaskModel, TaskRequest } from '../models/tasks';

const dbFilePath = path.join(__dirname, '../../db/tasks.json');

const readTasksFromFile = (): TaskModel[] => {
  try {
    const data = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(data) as TaskModel[];
  } catch (error) {
    console.log('Error reading tasks from file:', error);
    throw error;
  }
};

const writeTasksToFile = (tasks: TaskModel[]) => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.log('Error writing tasks to file:', error);
    throw error;
  }
};

const createTask = (taskInput: TaskRequest) => {
  const tasks = readTasksFromFile();

  // Generate ID for the new task
  const id = crypto.randomUUID();

  // Create the new TaskModel object with the provided data and generated values
  const newTask: TaskModel = {
    id,
    name: taskInput.name,
    description: taskInput.description,
    category: taskInput.category,
    state: taskInput.state,
    createdAt: `${Date.now()}`,
    updatedAt: `${Date.now()}`,
  };

  tasks.push(newTask);
  writeTasksToFile(tasks);
  return newTask;
};

const getAllTasks = (): TaskModel[] => readTasksFromFile();

const getTaskById = (taskId: string): TaskModel | undefined => {
  const tasks = readTasksFromFile();
  return tasks.find((taskRecord) => taskRecord.id === taskId);
};

const updateTask = (taskId: string, taskInput: TaskRequest) => {
  const tasks = readTasksFromFile();
  const task = tasks.find((taskRecord) => taskRecord.id === taskId);

  if (task === undefined) {
    return undefined;
  }

  // Create the new TaskModel object with the provided data and generated values
  const updatedTask: TaskModel = {
    id: task.id,
    name: taskInput.name,
    description: taskInput.description,
    category: taskInput.category,
    state: taskInput.state,
    createdAt: task.createdAt,
    updatedAt: `${Date.now()}`,
  };

  const taskIndex = tasks.indexOf(task);

  tasks[taskIndex] = updatedTask;
  writeTasksToFile(tasks);
  return updatedTask;
};

const deleteTask = (taskId: string) => {
  const tasks = readTasksFromFile();
  const taskIndex = tasks.findIndex((taskRecord) => taskRecord.id === taskId);

  if (taskIndex === -1) {
    return undefined;
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  writeTasksToFile(tasks);
  return deletedTask;
};

const taskService = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  readTasksFromFile,
  writeTasksToFile,
};

export default taskService;
