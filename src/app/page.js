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
        <div className="tw-flex tw-items-center tw-gap-x-3">
          <Button variant="text" endIcon={<MdDeleteForever />}>
            Text
          </Button>
          <Button
            variant="contained"
            startIcon={<MdDeleteForever />}
            onClick={() => confirm('삭제할거야?')}>
            삭제
          </Button>
          <Button variant="outlined">Outlined</Button>
        </div>

        <div className="tw-flex tw-items-center tw-gap-x-3 tw-mt-3">
          <Button
            variant="text"
            onClick={() => {
              alert('버튼 클릭됨');
            }}>
            Text
          </Button>
          <Button variant="contained" disabled>
            Contained
          </Button>
          <Button variant="outlined" href="sub/">
            sub로 이동
          </Button>
        </div>
      </ThemeProvider>
    </>
  );
}
