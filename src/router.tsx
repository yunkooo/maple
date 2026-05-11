import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './pages/AppLayout'
import CharacterPage from './pages/CharacterPage'
import CodyPage from './pages/CodyPage'
import DailyReportPage from './pages/DailyReportPage'
import HomePage from './pages/HomePage'
import NoticePage from './pages/NoticePage'

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
        path: '/notice',
        element: <NoticePage />
      },
      {
        path: '/report',
        element: <DailyReportPage />
      },
      {
        path: '/report/:nickname',
        element: <DailyReportPage />
      },
      {
        path: '/cody',
        element: <CodyPage />
      },
      {
        path: '/:nickname',
        element: <CharacterPage />
      }
    ]
  }
])
