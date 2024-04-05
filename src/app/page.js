'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import classNames from 'classnames';
import {
  Button,
  AppBar,
  Toolbar,
  CssBaseline,
  TextField,
  Chip,
  Box,
  Drawer,
  SwipeableDrawer,
  MenuList,
  List,
  ListItem,
  Divider,
  ListItemButton,
  Modal,
} from '@mui/material';
import { FaBars, FaCheck, FaEllipsisH, FaTrash } from 'react-icons/fa';
import { FaPenToSquare } from 'react-icons/fa6';
import RootTheme from './theme';
import dateToStr from './dateUtil';

function useTodosStatus() {
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

  // modify v1
  const modifyTodo = (id, content) => {
    const newTodos = todos.map((todo) => (todo.id != id ? todo : { ...todo, content }));
    setTodos(newTodos);
  };

  // modify v2
  const modifyTodoByIndex = (index, newContent) => {
    const newTodos = todos.map((todo, _index) =>
      _index != index ? todo : { ...todo, content: newContent },
    );
    setTodos(newTodos);
  };
  // modify v2
  const modifyTodoById = (id, newContent) => {
    const index = findTodoIndexById(id);

    if (index == -1) {
      return null;
    }

    modifyTodoByIndex(index, newContent);
  };

  const findTodoIndexById = (id) => {
    return todos.findIndex((todo) => todo.id == id);
  };

  const findTodoById = (id) => {
    const index = findTodoIndexById(id);

    if (index == -1) {
      return null;
    }

    return todos[index];
  };

  return {
    todos,
    addTodo,
    removeTodo,
    modifyTodo,
    findTodoById,
    modifyTodoById,
  };
}

const NewTodoForm = ({ todosState }) => {
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
      <form onSubmit={(e) => onSubmit(e)} className="tw-flex tw-flex-col tw-p-4 tw-gap-2">
        <TextField
          minRows={3}
          maxRows={10}
          multiline
          name="content"
          autoComplete="off"
          label="할 일 써"
        />
        <Button variant="contained" className="tw-font-bold" type="submit">
          추가
        </Button>
      </form>
    </>
  );
};

const TodoListItem = ({ todo, index, openDrawer, todosState }) => {
  return (
    <>
      <li key={todo.id}>
        <div className="tw-flex tw-flex-col tw-gap-2 tw-mt-3">
          <div className="tw-flex tw-gap-x-2 tw-font-bold">
            <Chip className="tw-pt-[3px]" label={`번호 : ${todo.id}`} variant="outlined" />
            <Chip
              className="tw-pt-[3px]"
              label={`날짜 : ${todo.regDate}`}
              variant="outlined"
              color="primary"
            />
          </div>
          <div className="tw-rounded-[10px] tw-shadow tw-flex tw-text-[14px] tw-min-h-[80px]">
            <Button className="tw-flex-shrink-0 tw-rounded-[10px_0_0_10px]" color="inherit">
              <FaCheck
                className={classNames(
                  'tw-text-3xl',
                  {
                    'tw-text-[--mui-color-primary-main]': index % 2 == 0,
                  },
                  { 'tw-text-[#dcdcdc]': index % 2 != 0 },
                )}
              />
            </Button>
            <div className="tw-bg-[#dcdcdc] tw-w-[2px] tw-h-[60px] tw-self-center"></div>
            <div className="tw-bg-blue-300 tw-flex tw-items-center tw-p-3 tw-flex-grow hover:tw-text-[--mui-color-primary-main] tw-whitespace-pre-wrap tw-leading-relaxed tw-break-words">
              {todo.content}
            </div>
            <Button
              onClick={() => {
                openDrawer(todo.id);
              }}
              className="tw-flex-shrink-0 tw-rounded-[0_10px_10px_0]"
              color="inherit">
              <FaEllipsisH className="tw-text-[#dcdcdc] tw-text-2xl" />
            </Button>
          </div>
        </div>
      </li>
    </>
  );
};

// 해당 todo option에 대한 drawer 열기, 닫기
function useTodoOptionDrawerStatus() {
  const [todoId, setTodoId] = React.useState(null);

  const opened = React.useMemo(() => todoId !== null, [todoId]);

  const open = (id) => setTodoId(id);
  const close = () => setTodoId(null);

  return {
    todoId,
    open,
    close,
    opened,
  };
}

// modal 열기, 닫기
function useEditTodoModalStatus() {
  const [opened, setOpened] = React.useState(false);

  const open = () => {
    setOpened(true);
  };

  const close = () => {
    setOpened(false);
  };

  return {
    opened,
    open,
    close,
  };
}

function EditTodoModal({ status, todosState, todo }) {
  const onSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    form.content.value = form.content.value.trim();

    if (form.content.value.length == 0) {
      alert('할 일 써');
      form.content.focus();
      return;
    }

    // modify v1
    todosState.modifyTodo(todo.id, form.content.value);
    status.close();

    // modify v2
    // todosState.modifyTodoById(todo.id, form.content.value);
  };

  return (
    <>
      <Modal
        open={status.opened}
        onClose={status.close}
        className="tw-flex tw-justify-center tw-items-center">
        <div className="tw-bg-white tw-p-10 tw-rounded-[20px] tw-w-full tw-max-w-lg">
          <form onSubmit={onSubmit} className="tw-flex tw-flex-col tw-gap-2">
            <TextField
              minRows={3}
              maxRows={10}
              multiline
              name="content"
              autoComplete="off"
              variant="outlined"
              label="할 일 써"
              defaultValue={todo?.content}
            />
            <Button variant="contained" className="tw-font-bold" type="submit">
              수정
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
}

function TodoOptionDrawer({ status, todosState }) {
  const editTodoModalStatus = useEditTodoModalStatus();

  const todo = todosState.findTodoById(status.todoId);

  return (
    <>
      <EditTodoModal status={editTodoModalStatus} todosState={todosState} todo={todo} />
      <SwipeableDrawer anchor="top" open={status.opened} onClose={status.close} onOpen={() => {}}>
        <List>
          <ListItem className="tw-flex tw-gap-2 tw-p-[15px]">
            <span className="tw-text-[--mui-color-primary-main]">{status.todoId}번 </span>
            <span>Your Todo</span>
          </ListItem>
          <Divider className="tw-my-[5px]" />
          <ListItemButton
            onClick={editTodoModalStatus.open}
            className="tw-p-[15px_20px] tw-flex tw-gap-2 tw-items-center">
            <span>수정</span>
            <FaPenToSquare className="block tw-mt-[-5px]" />
          </ListItemButton>
          <ListItemButton className="tw-p-[15px_20px] tw-flex tw-gap-2 tw-items-center">
            <span>삭제</span>
            <FaTrash className="block tw-mt-[-5px]" />
          </ListItemButton>
        </List>
      </SwipeableDrawer>
    </>
  );
}

const TodoList = ({ todosState }) => {
  const todoOptionDrawerStatus = useTodoOptionDrawerStatus();

  return (
    <>
      <TodoOptionDrawer status={todoOptionDrawerStatus} todosState={todosState} />
      <nav>
        할 일 갯수 : {todosState.todos.length}
        <ul>
          {todosState.todos.map((todo, index) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              index={index}
              openDrawer={todoOptionDrawerStatus.open}
              todosState={todosState}
            />
          ))}
        </ul>
      </nav>
    </>
  );
};

function App() {
  const todosState = useTodosStatus();

  React.useEffect(() => {
    todosState.addTodo('스쿼트\n런지');
    todosState.addTodo('벤치');
    todosState.addTodo('데드');
  }, []);

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
      <NewTodoForm todosState={todosState} />
      <TodoList todosState={todosState} />
    </>
  );
}

export default function themeApp() {
  const theme = RootTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}
