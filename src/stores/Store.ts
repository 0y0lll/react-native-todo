import {configure, makeAutoObservable} from 'mobx';

configure({
  enforceActions: 'never',
});

type ID = number;

interface TodoItem {
  id: ID;
  contents: string;
  isCompleted: boolean;
}

class TodoStoreClass {
  private todoList = new Array<TodoItem>();

  constructor() {
    makeAutoObservable(this);
  }

  get todos(): TodoItem[] {
    return this.todoList;
  }

  getTodoItem = (id: ID) => {
    this.todoList.filter(todo => todo.id === id)[0];
  };

  setTodoList = (todoItem: TodoItem) => {
    this.todoList.push(todoItem);
  };

  setTodoItem = (idx: number, todoItem: TodoItem) => {
    this.todoList[idx] = {
      ...this.todoList[idx],
      contents: todoItem.contents,
      isCompleted: todoItem.isCompleted,
    };
  };

  deleteTodoItem = (id: ID) => {
    this.todoList = this.todoList.filter(todo => todo.id !== id);
  };
}

export default new TodoStoreClass();
