import React from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import MenuItemList from './components/MenuItemList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <MenuItemList />
      </Container>
    </ThemeProvider>
  );
}

export default App;
