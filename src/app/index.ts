import express, { Application } from 'express';
import tasks from './routes/tasks';

// Boot express
const app: Application = express();

app.use(express.json());

// app.use('/users', users);
app.use('/tasks', tasks);

export default app;
