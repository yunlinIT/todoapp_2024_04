'use client';

import * as React from 'react';
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from 'recoil';
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
  Snackbar,
  Alert,
} from '@mui/material';
import { FaBars, FaCheck, FaEllipsisH, FaTrash } from 'react-icons/fa';
import { FaPenToSquare } from 'react-icons/fa6';
import RootTheme from './theme';
import dateToStr from './dateUtil';

const todosAtom = atom({
  key: 'app/todosAtom',
  default: [],
});

const lastTodoIdAtom = atom({
  key: 'app/lastTodoIdAtom',
  default: 0,
});

function useTodosStatus() {
  const [todos, setTodos] = useRecoilState(todosAtom);
  // const [todos, setTodos] = React.useState([]);
  const [lastTodoId, setLastTodoId] = useRecoilState(lastTodoIdAtom);
  const lastTodoIdRef = React.useRef(lastTodoId);

  lastTodoIdRef.current = lastTodoId;

  const addTodo = (newContent) => {
    const id = ++lastTodoIdRef.current;
    setLastTodoId(id);

    const newTodo = {
      id,
      content: newContent,
      regDate: dateToStr(new Date()),
    };
    setTodos((todos) => [newTodo, ...todos]);

    return id;
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

const NewTodoForm = ({ noticeSnackbarStatus }) => {
  const todosStatus = useTodosStatus();

  const onSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    form.content.value = form.content.value.trim();

    if (form.content.value.length == 0) {
      alert('할 일을 작성해주세요! :)');

      form.content.focus();
      return;
    }

    const newTodoId = todosStatus.addTodo(form.content.value);
    form.content.value = '';
    form.content.focus();
    noticeSnackbarStatus.open(`${newTodoId}번 todo 추가됨`);
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
          label="할 일을 작성해주세요! :)"
        />
        <Button variant="contained" className="tw-font-bold" type="submit">
          추가
        </Button>
      </form>
    </>
  );
};

const TodoListItem = ({ todo, index, openDrawer }) => {
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

            <div className="tw-bg-pink-100 tw-flex tw-items-center tw-p-3 tw-flex-grow hover:tw-text-[--mui-color-primary-main] tw-whitespace-pre-wrap tw-leading-relaxed tw-break-words">
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

function EditTodoModal({ status, todo, noticeSnackbarStatus }) {
  const todosStatus = useTodosStatus();
  const onSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    form.content.value = form.content.value.trim();

    if (form.content.value.length == 0) {
      alert('할 일을 작성해주세요');
      form.content.focus();
      return;
    }

    // modify v1
    todosStatus.modifyTodo(todo.id, form.content.value);
    status.close();

    noticeSnackbarStatus.open(`${todo.id}번 TODO가 수정되었습니다.`);

    // modify v2
    // todosStatus.modifyTodoById(todo.id, form.content.value);
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
              label="할 일을 작성해주세요"
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

function TodoOptionDrawer({ status, noticeSnackbarStatus }) {
  const todosStatus = useTodosStatus();
  const removeTodo = () => {
    if (confirm(`${status.todoId}번 할 일을 삭제하시겠습니까?`) == false) {
      status.close();
      return;
    }

    todosStatus.removeTodo(status.todoId);
    status.close();
    noticeSnackbarStatus.open(`${status.todoId}번 TODO가 삭제되었습니다.`, 'error');
  };

  const editTodoModalStatus = useEditTodoModalStatus();

  const todo = todosStatus.findTodoById(status.todoId);

  return (
    <>
      <EditTodoModal
        status={editTodoModalStatus}
        todo={todo}
        noticeSnackbarStatus={noticeSnackbarStatus}
      />
      <SwipeableDrawer
        anchor="bottom"
        open={status.opened}
        onClose={status.close}
        onOpen={() => {}}>
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
          <ListItemButton
            className="tw-p-[15px_20px] tw-flex tw-gap-2 tw-items-center"
            onClick={removeTodo}>
            <span>삭제</span>
            <FaTrash className="block tw-mt-[-5px]" />
          </ListItemButton>
        </List>
      </SwipeableDrawer>
    </>
  );
}

const TodoList = ({ noticeSnackbarStatus }) => {
  const todosStatus = useTodosStatus();
  const todoOptionDrawerStatus = useTodoOptionDrawerStatus();

  return (
    <>
      <TodoOptionDrawer
        status={todoOptionDrawerStatus}
        noticeSnackbarStatus={noticeSnackbarStatus}
      />
      <nav>
        할 일 갯수 : {todosStatus.todos.length}
        <ul>
          {todosStatus.todos.map((todo, index) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              index={index}
              openDrawer={todoOptionDrawerStatus.open}
            />
          ))}
        </ul>
      </nav>
    </>
  );
};

function NoticeSnackbar({ status }) {
  return (
    <>
      <Snackbar
        open={status.opened}
        autoHideDuration={status.autoHideDuration}
        onClose={status.close}>
        <Alert variant={status.variant} severity={status.severity}>
          {status.msg}
        </Alert>
      </Snackbar>
    </>
  );
}

function useNoticeSnackbarStatus() {
  const [opened, setOpened] = React.useState(false);
  const [autoHideDuration, setAutoHideDuration] = React.useState(null);
  const [variant, setVariant] = React.useState(null);
  const [severity, setSeverity] = React.useState(null);
  const [msg, setMsg] = React.useState(null);

  const open = (msg, severity = 'success', autoHideDuration = 3000, variant = 'filled') => {
    setOpened(true);
    setMsg(msg);
    setSeverity(severity);
    setAutoHideDuration(autoHideDuration);
    setVariant(variant);
  };

  const close = () => {
    setOpened(false);
  };

  return {
    opened,
    open,
    close,
    autoHideDuration,
    variant,
    severity,
    msg,
  };
}

function App() {
  const todosStatus = useTodosStatus();
  const noticeSnackbarStatus = useNoticeSnackbarStatus();

  React.useEffect(() => {
    todosStatus.addTodo('분리수거\n설거지');
    todosStatus.addTodo('운동');
    todosStatus.addTodo('개인 프로젝트');
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
              My TODO List !
            </a>
          </div>
          <div className="tw-flex-1 tw-flex tw-justify-end">
            <a href="/write">글쓰기</a>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <NoticeSnackbar status={noticeSnackbarStatus} />
      <NewTodoForm noticeSnackbarStatus={noticeSnackbarStatus} />
      <TodoList noticeSnackbarStatus={noticeSnackbarStatus} />
    </>
  );
}

export default function themeApp() {
  const theme = RootTheme();

  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </RecoilRoot>
  );
}
