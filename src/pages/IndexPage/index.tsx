import Footer from '@/components/footer'
import Header from '@/components/header'
import { Outlet } from 'react-router-dom'

export default function IndexPage() {
  return (
    <div className="container mx-auto">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
