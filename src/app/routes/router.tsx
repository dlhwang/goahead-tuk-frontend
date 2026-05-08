import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/shared/ui/AppLayout';
import { ConfessionCreatePage } from '@/pages/confession-create/ConfessionCreatePage';
import { ConfessionDetailPage } from '@/pages/confession-detail/ConfessionDetailPage';
import { ConfessionListPage } from '@/pages/confession-list/ConfessionListPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Navigate to="/confessions" replace /> },
      { path: '/confessions', element: <ConfessionListPage /> },
      { path: '/confessions/new', element: <ConfessionCreatePage /> },
      { path: '/confessions/:confessionId', element: <ConfessionDetailPage /> },
    ],
  },
]);
