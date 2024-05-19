import { createTheme } from '@mui/material';
import * as React from 'react';

const muiThemePaletteKeys = [
  'background',
  'common',
  'error',
  'grey',
  'info',
  'primary',
  'secondary',
  'success',
  'text',
  'warning',
];

export default function RootTheme() {
  const theme = createTheme({
    palette: {
      typography: {
        fontFamily: ['GmarketSansMedium'],
      },
      type: 'dark',
      primary: {
        main: '#ff7393',
        light: 'rgb(250, 220, 215)',
        dark: 'rgb(189, 28, 65)',
        contrastText: '#fff',
      },
      secondary: {
        main: '#f5b1a4',
      },
    },
  });

  React.useEffect(() => {
    const r = document.querySelector(':root');

    muiThemePaletteKeys.forEach((paletteKey) => {
      const themeColorObj = theme.palette[paletteKey];
      // console.log(themeColor);

      for (const key in themeColorObj) {
        // console.log(key);
        if (Object.hasOwnProperty.call(themeColorObj, key)) {
          const colorVal = themeColorObj[key];
          r.style.setProperty(`--mui-color-${paletteKey}-${key}`, colorVal);
        }
      }
    });
  }, []);

  return theme;
}
