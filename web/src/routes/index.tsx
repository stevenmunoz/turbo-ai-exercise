/**
 * Application routing configuration
 */

import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { HomePage } from '../pages/HomePage';
import { ReplayPage } from '../pages/ReplayPage';
import { LibraryPage } from '../pages/LibraryPage';
import { DesignSystemPage } from '../pages/DesignSystemPage';
import { PrototypePage } from '../pages/PrototypePage';

const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/replay',
    element: <ReplayPage />,
  },
  {
    path: '/library',
    element: <LibraryPage />,
  },
  {
    path: '/design-system',
    element: <DesignSystemPage />,
  },
  {
    path: '/app',
    element: <PrototypePage />,
  },
];

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export const router = createBrowserRouter(routes, { basename });
