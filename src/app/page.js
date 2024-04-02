'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Button, Box, AppBar, Toolbar, Snackbar, Alert as MuiAlert } from '@mui/material';
import theme from './theme';
import { FaBars } from 'react-icons/fa';

const Alert = React.forwardRef((props, ref) => {
  return <MuiAlert {...props} ref={ref} variant="filled" />;
});

export default function App() {
  const [open, setOpen] = React.useState(false);

  const alertRef = React.useRef(null);

  return (
    <>
      <ThemeProvider theme={theme}>
        <AppBar position="fixed">
          <Toolbar>
            <div className="tw-flex-1">
              <FaBars className="tw-cursor-pointer" />
            </div>
            <div className="logo-box">
              <a href="/" className="tw-font-bold">
                NOTE!
              </a>
            </div>
            <div className="tw-flex-1 tw-flex tw-justify-end">
              <a href="/write">글쓰기</a>
            </div>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <section className="tw-h-screen tw-flex tw-items-center tw-justify-center tw-text-[5rem]">
          section
        </section>
      </ThemeProvider>
      <section>
        <Button onClick={() => setOpen(true)}>Open Snackbar</Button>
        <Alert ref={alertRef} severity="error" varient="filled">
          게시물이 삭제되었습니다.
        </Alert>
        <Alert severity="success" varient="outlined">
          This is a success msg!!!!!
        </Alert>
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={() => setOpen(false)}
          message="Note archived">
          <Alert severity="warning">게시물이 삭제됨</Alert>
        </Snackbar>
      </section>
    </>
  );
}
