'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Button, AppBar, Toolbar, CssBaseline, TextField, Chip, Box } from '@mui/material';
import { FaBars } from 'react-icons/fa';
import RootTheme from './theme';
import dateToStr from './dateUtil';

function useTodoStatus() {
  console.log('실행 1');

  const [todos, setTodos] = React.useState([]);
  const lastTodoIdRef = React.useRef(0);

  const addTodo = (newContent) => {
    const id = ++lastTodoIdRef.current;

    const newTodo = {
      id,
      content: newContent,
      regDate: dateToStr(new Date()),
    };
    setTodos((todos) => [newTodo, ...todos]);
  };

  const removeTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id != id);
    setTodos(newTodos);
  };

  const modifyTodo = (id, content) => {
    const newTodos = todos.map((todo) => (todo.id != id ? todo : { ...todo, content }));
    setTodos(newTodos);
  };

  return {
    todos,
    addTodo,
    removeTodo,
    modifyTodo,
  };
}

const NewTodoForm = ({ todoStatus }) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const addTodo = () => {
    if (newTodoTitle.trim().length == 0) return;
    const title = newTodoTitle.trim();
    todoStatusaddTodo(title);
    setNewTodoTitle('');
  };

  return (
    <>
      <div className="flex items-center gap-x-3">
        <input
          className="input input-bordered"
          type="text"
          placeholder="새 할일 입력해"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addTodo}>
          할 일 추가
        </button>
      </div>
    </>
  );
};

const TodoListItem = ({ todo, todoStatus }) => {
  const [editMode, setEditMode] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState(todo.title);
  const readMode = !editMode;

  const enableEditMode = () => {
    setEditMode(true);
  };

  const removeTodo = () => {
    todoStatus.removeTodo(todo.id);
  };

  const cancleEdit = () => {
    setEditMode(false);
    setNewTodoTitle(todo.title);
  };
  const commitEdit = () => {
    if (newTodoTitle.trim().length == 0) return;

    todoStatus.modifyTodo(todo.id, newTodoTitle.trim());

    setEditMode(false);
  };

  return (
    <li className="flex items-center gap-x-3 mb-3">
      <span className="badge badge-accent badge-outline">{todo.id}</span>
      {readMode ? (
        <>
          <span>{todo.title}</span>
          <button className="btn btn-outline btn-accent" onClick={enableEditMode}>
            수정
          </button>
          <button className="btn btn-accent" onClick={removeTodo}>
            삭제
          </button>
        </>
      ) : (
        <>
          <input
            className="input input-bordered"
            type="text"
            placeholder="할 일 써"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
          />
          <button className="btn btn-accent" onClick={commitEdit}>
            수정완료
          </button>
          <button className="btn btn-accent" onClick={cancleEdit}>
            수정취소
          </button>
        </>
      )}
    </li>
  );
};

const TodoList = ({ todoStatus }) => {
  return (
    <>
      {todoStatus.todos.length == 0 ? (
        <h4>할 일 없음</h4>
      ) : (
        <>
          <h4>할 일 목록</h4>
          <ul>
            {todoStatus.todos.map((todo) => (
              <TodoListItem key={todo.id} todo={todo} todoStatus={todoStatus} />
            ))}
          </ul>
        </>
      )}
    </>
  );
};

let AppCallCount = 0;

function App() {
  AppCallCount++;
  console.log(`AppCallCount : ${AppCallCount}`);

  const todosState = useTodoStatus(); // 리액트 커스텀 훅

  React.useEffect(() => {
    todosState.addTodo('스쿼트\n런지');
    todosState.addTodo('벤치');
    todosState.addTodo('데드');
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    form.content.value = form.content.value.trim();

    if (form.content.value.length == 0) {
      alert('할 일 써');
      form.content.focus();
      return;
    }

    todosState.addTodo(form.content.value);
    form.content.value = '';
    form.content.focus();
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <div className="tw-flex-1">
            <FaBars onClick={() => setOpen(true)} className="tw-cursor-pointer" />
          </div>
          <div className="logo-box">
            <a href="/" className="tw-font-bold">
              TODO!
            </a>
          </div>
          <div className="tw-flex-1 tw-flex tw-justify-end">
            <a href="/write">글쓰기</a>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <form className="tw-flex tw-flex-col tw-p-4 tw-gap-2" onSubmit={onSubmit}>
        <TextField
          multiline
          minRows={3}
          maxRows={10}
          name="content"
          autoComplete="off"
          label="할 일을 입력해"
          variant="outlined"
        />
        <Button className="tw-font-bold" variant="contained" type="submit">
          추가
        </Button>
      </form>
      할 일 갯수 : {todosState.todos.length}
      <nav>
        <ul>
          {todosState.todos.map((todo) => (
            <li key={todo.id}>
              <div className="tw-flex tw-flex-col tw-gap-2 tw-mt-[30px]">
                <Chip
                  className="tw-pt-3"
                  label={`번호 : ${todo.id}`}
                  variant="outlined"
                  color="primary"></Chip>
                <Chip
                  className="tw-pt-3"
                  label={`날짜 : ${todo.regDate}`}
                  variant="outlined"></Chip>
                <div className="tw-p-10 tw-rounded-[20px] tw-shadow tw-flex">
                  <Button className="tw-rounded-[20px_0_0_20px] hover:tw-bg-red-300 tw-flex-shrink-0 tw-items-center">
                    <span>체크박스</span>
                  </Button>
                  <div className="tw-bg-blue-500 tw-flex-grow hover:tw-text-[--mui-color-primary-main] tw-whitespace-pre-wrap tw-leading-relaxed tw-break-words">
                    {todo.content}
                  </div>
                  <div className="tw-bg-green-500 tw-w-[150px] tw-flex-shrink-0">후</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export default function themeApp() {
  const theme = RootTheme();

  console.log('실행 2');
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}
