type Category = 'work' | 'home';
type State = 'active' | 'finished';

export interface TaskRequest {
  name: string;
  description?: string;
  category: Category;
  state: State;
}

export interface TaskModel {
  id: string;
  name: string;
  description?: string;
  category: Category;
  state: State;
  createdAt: string;
  updatedAt: string;
}
