import { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.scss';

import App from './App.tsx';
import LoaderPage from './pages/LoaderPage';
import PrivateRoute from './Context/Provider/PrivateProvider.tsx';

export const Start = lazy(() => import('./pages/Start'));
export const Auth = lazy(() => import('./pages/Auth'));
export const Home = lazy(() => import('./pages/Home'));

const router = createBrowserRouter([
  {
   path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Start />,
      },
      {
        path: '/auth',
        element: <Auth />,
      },
      {
        path: '/home',
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>)
      }
    ]
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Suspense fallback={<LoaderPage />}>
    <RouterProvider router={router} />
  </Suspense>
);