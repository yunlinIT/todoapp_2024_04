'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Button, Box, AppBar, Toolbar } from '@mui/material';
import theme from './theme';
import { MdDeleteForever } from 'react-icons/md';

export default function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar className="tw-justify-center">
            <a href="/" className="tw-font-bold">
              NOTE!
            </a>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </>
  );
}
