import { RouterProvider } from 'react-router';
import { router } from './routes';
import { CattleProvider } from './context/CattleContext';

export default function App() {
  return (
    <CattleProvider>
      <RouterProvider router={router} />
    </CattleProvider>
  );
}