import React, { useState, useEffect } from 'react'
import { api } from '../api.js'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)
  const today = new Date().toLocaleDateString('fr-FR')

  useEffect(() => {
    api.get('dashboard.php')
      .then(data => {
        if (data.error) setError(data.error)
        else setStats(data)
      })
      .catch(err => setError(err.message))
  }, [])

  if (error) return <p style={{color:'red', padding:'2rem'}}>Erreur: {error}</p>
  if (!stats) return <p style={{padding:'2rem'}}>Chargement...</p>

  const pct = (n) => (stats.total > 0 ? Math.round((n / stats.total) * 100) : 0)

  return (
    <>
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="cards">
        <div className="today-rdv">
          <h2>Rendez-vous pour aujourd'hui</h2>
          <p>{stats.today_count ?? 0} rendez-vous</p>
          <p>Pour {today}</p>
        </div>
        <div className="earnings">
          <h2>Revenus totaux</h2>
          <p>{(stats.today_revenue ?? 0).toFixed(2)} MAD</p>
          <p>Pour {today}</p>
        </div>
        <div className="finished">
          <h2>Terminés</h2>
          <p>{stats.confirme ?? 0} RDV</p>
          <p>{pct(stats.confirme ?? 0)}% du total</p>
        </div>
        <div className="on-hold">
          <h2>En attente</h2>
          <p>{stats['en-attente'] ?? 0} RDV</p>
          <p>{pct(stats['en-attente'] ?? 0)}% du total</p>
        </div>
        <div className="canceled">
          <h2>Annulés</h2>
          <p>{stats.annule ?? 0} RDV</p>
          <p>{pct(stats.annule ?? 0)}% du total</p>
        </div>
        <div className="reservations-chart">
          <h2>Réservations par jour</h2>
          <p>Évolution des réservations pour {today}</p>
          <div className="chart-placeholder">
            <div className="line line-reservations"></div>
          </div>
        </div>
        <div className="earnings-chart">
          <h2>Revenus par jour</h2>
          <p>Évolution des revenus pour {today}</p>
          <div className="chart-placeholder">
            <div className="line line-earnings"></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
