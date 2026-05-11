import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import { store } from './store';
import { AppThemeProvider } from './theme';
import { ErrorBoundary } from './Components/ErrorBoundary/ErrorBoundary';
import { MainLayout } from './Components/Layout/MainLayout/MainLayout';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <AppThemeProvider>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <ErrorBoundary>
          <BrowserRouter>
            <MainLayout />
          </BrowserRouter>
        </ErrorBoundary>
      </SnackbarProvider>
    </AppThemeProvider>
  </Provider>
);
