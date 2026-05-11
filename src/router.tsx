import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './pages/AppLayout'
import CharacterPage from './pages/CharacterPage'
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/:nickname',
        element: <CharacterPage />
      }
    ]
  }
])
