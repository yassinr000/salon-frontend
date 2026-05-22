import React, { useState, useEffect, useCallback } from 'react'
import AddRdv from '../components/AddRdv.jsx'
import ActionView from '../components/ActionView.jsx'
import { api } from '../api.js'

const LABELS = { confirme: 'Confirmé', 'en-attente': 'En attente', annule: 'Annulé' }

function Bookings() {
  const [bookings, setBookings] = useState([])
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState(null)

  const loadBookings = useCallback(() => {
    api.get('bookings.php')
      .then((data) => {
        if (!Array.isArray(data)) { setError(data.error || 'Erreur API'); return }
        setBookings(data.map((b) => ({ ...b, label: LABELS[b.statut] })))
      })
      .catch((err) => setError(err.message))
  }, [])

  useEffect(() => { loadBookings() }, [loadBookings])

  const handleAdd = async (newBooking) => {
    try {
      const saved = await api.post('bookings.php', newBooking)
      if (saved.error) { setError('Erreur lors de l\'ajout: ' + saved.error); return }
      setShowAdd(false)
      loadBookings()
    } catch (err) {
      setError('Erreur lors de l\'ajout: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete('bookings.php', id)
      setSelected(null)
      loadBookings()
    } catch (err) {
      setError('Erreur lors de la suppression: ' + err.message)
    }
  }

  const handleModify = async (modified) => {
    try {
      const result = await api.put('bookings.php', modified.id, modified)
      if (result.error) { setError('Erreur lors de la modification: ' + result.error); return }
      setSelected(null)
      loadBookings()
    } catch (err) {
      setError('Erreur lors de la modification: ' + err.message)
    }
  }

  const filtered = bookings.filter((b) =>
    (b.patient || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px',
          padding: '0.75rem 1.25rem', margin: '1rem 1.5rem 0',
          color: '#b91c1c', fontSize: '0.9rem', gap: '1rem'
        }}>
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#b91c1c', fontSize: '1.2rem', lineHeight: 1
          }}>×</button>
        </div>
      )}
      <h1 className="bookings-title">Rendez-vous</h1>
      <div className="rdv-container">
        <div className="rdv-topbar">
          <input
            type="text"
            placeholder="Chercher un rendez-vous"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => setShowAdd(true)}>Ajouter un nouveau rendez-vous</button>
        </div>
        <div className="rdv-props">
          <span>PATIENT</span>
          <span>SERVICE</span>
          <span>DATE</span>
          <span>PRIX</span>
          <span>STATUT</span>
          <span>ACTION</span>
        </div>
        <div className="rdv-list">
          {filtered.map((booking) => (
            <div className="rdv-row" key={booking.id}>
              <span>{booking.patient}</span>
              <span>{booking.service}</span>
              <span>{booking.date}</span>
              <span>{booking.price} MAD</span>
              <span className={`status ${booking.statut}`}>{booking.label}</span>
              <span>
                <button className="small-btn" onClick={() => setSelected(booking)}>Gérer</button>
              </span>
            </div>
          ))}
        </div>
      </div>
      {showAdd && <AddRdv onAdd={handleAdd} onClose={() => setShowAdd(false)} />}
      {selected && (
        <ActionView
          booking={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
          onModify={handleModify}
        />
      )}
    </>
  )
}

export default Bookings
