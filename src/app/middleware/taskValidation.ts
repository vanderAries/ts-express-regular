import { checkSchema, Schema } from 'express-validator';

const taskSchema: Schema = {
  name: {
    exists: {
      errorMessage: 'Task name is required',
    },
    isString: {
      errorMessage: 'Task name should be string',
    },
  },
  description: {
    optional: true,
    isString: {
      errorMessage: 'Task description should be string',
    },
  },
  category: {
    exists: {
      errorMessage: 'Task category is required',
    },
    isIn: {
      options: [['work', 'home']],
      errorMessage: "Invalid category. Has to be 'work' or 'home'",
    },
  },
  state: {
    exists: {
      errorMessage: 'Task state is required',
    },
    isIn: {
      options: [['active', 'finished']],
      errorMessage: "Invalid state. Has to be 'active' or 'finished'",
    },
  },
};

const validateTaskData = checkSchema(taskSchema);
export default validateTaskData;
