'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Button, AppBar, Toolbar, Tabs, Tab } from '@mui/material';
import theme from './theme';
import { FaBars } from 'react-icons/fa';
import Link from 'next/link';

export default function App() {
  const [tabCurrentIndex, setTabCurrentIndex] = React.useState(0);

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
      <Tabs value={tabCurrentIndex} onChange={(_, newValue) => setTabCurrentIndex(newValue)}>
        <Tab label="Item One" />
        <Tab label="Item Two" />
        <Tab label="Item Three" />
      </Tabs>
      {tabCurrentIndex == 0 && <div>내용1</div>}
      {tabCurrentIndex == 1 && <div>내용2</div>}
      {tabCurrentIndex == 2 && <div>내용3</div>}
    </>
  );
}
