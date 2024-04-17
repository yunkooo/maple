import { createBrowserRouter } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import InfoPage from './pages/InfoPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexPage />,
    children: [
      {
        path: '/:nickname',
        element: <InfoPage />
      }
    ]
  }
])
