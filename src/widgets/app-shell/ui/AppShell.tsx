import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { UpdateBanner } from '@/features/app-update'
import { darkPaths } from '../model/navigation'
import { Footer } from './Footer'
import { Header } from './Header'
import { TabBar } from './TabBar'
import './app-shell.css'

/** Frame around every page: header, footer, mobile tab bar. Switches to the dark theme on selected routes. */
export function AppShell() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  const dark = darkPaths.includes(pathname)
  return (
    <div className={`app${dark ? ' app--dark' : ''}`}>
      <Header dark={dark} />
      <main>
        <Suspense fallback={null}><Outlet /></Suspense>
      </main>
      <Footer />
      <TabBar />
      <UpdateBanner />
    </div>
  )
}
