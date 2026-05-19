import React, { useState, useEffect } from 'react'
import Dashboard from './Dashboard.jsx'
import Bookings from './Bookings.jsx'
import Clients from './Clients.jsx'
import Services from './Services.jsx'
import logo from '../assets/logo.jpg'

const VALID_PAGES = ['dashboard', 'bookings', 'clients', 'services']

function getPageFromHash() {
  const hash = window.location.hash.replace('#', '')
  return VALID_PAGES.includes(hash) ? hash : 'dashboard'
}

function Homepage() {
  const [activePage, setActivePage] = useState(getPageFromHash)

  useEffect(() => {
    const onHashChange = () => setActivePage(getPageFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const nav = (page) => () => {
    window.location.hash = page
    setActivePage(page)
  }

  return (
    <div className="layout">
      <nav className="sidebar">
        <img src={logo} alt="Salon logo" className="logo" />
        <p>FSR Beauty Salon</p>

        <section className="main">Main</section>
        <button onClick={nav('dashboard')} className={activePage === 'dashboard' ? 'active' : ''}>
          <i className="fas fa-chart-line"></i> Dashboard
        </button>

        <section>MANAGEMENT</section>
        <button onClick={nav('bookings')} className={activePage === 'bookings' ? 'active' : ''}>
          <i className="fas fa-calendar"></i> Bookings
        </button>
        <button onClick={nav('clients')} className={activePage === 'clients' ? 'active' : ''}>
          <i className="fas fa-users"></i> Clients
        </button>
        <button onClick={nav('services')} className={activePage === 'services' ? 'active' : ''}>
          <i className="fas fa-scissors"></i> Services
        </button>
      </nav>

      <main className="content">
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'bookings'  && <Bookings />}
        {activePage === 'clients'   && <Clients />}
        {activePage === 'services'  && <Services />}
      </main>
    </div>
  )
}

export default Homepage
