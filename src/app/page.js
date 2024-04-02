'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Button, AppBar, Toolbar, Drawer, List, ListItemButton } from '@mui/material';
import theme from './theme';
import { FaBars } from 'react-icons/fa';
import Link from 'next/link';

export default function App() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <ThemeProvider theme={theme}>
        <AppBar position="fixed">
          <Toolbar>
            <div className="tw-flex-1">
              <FaBars onClick={() => setOpen(true)} className="tw-cursor-pointer" />
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
      <Button onClick={() => setOpen(true)}>show drawer</Button>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <List>
          <ListItemButton>
            <Link href="/write">글 쓰기</Link>
          </ListItemButton>
          <ListItemButton>사과</ListItemButton>
          <ListItemButton>바나나</ListItemButton>
        </List>
      </Drawer>
    </>
  );
}
