import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './pages/AppLayout'
import CharacterPage from './pages/CharacterPage'
import HomePage from './pages/HomePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: '/:nickname',
        element: <CharacterPage />
      }
    ]
  }
])
