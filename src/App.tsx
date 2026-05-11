import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { queryCacheTime } from './lib/queryCache'
import { router } from './router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: queryCacheTime.characterDailyData.gcTime,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: queryCacheTime.characterDailyData.staleTime
    }
  }
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
