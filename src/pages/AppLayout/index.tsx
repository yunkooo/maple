import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
