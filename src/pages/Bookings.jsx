import React, { useState, useEffect } from 'react'
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

  useEffect(() => {
    api.get('bookings.php')
      .then((data) => {
        if (!Array.isArray(data)) { setError(data.error || 'Erreur API'); return }
        setBookings(data.map((b) => ({ ...b, label: LABELS[b.statut] })))
      })
      .catch((err) => setError(err.message))
  }, [])

  const handleAdd = async (newBooking) => {
    try {
      const saved = await api.post('bookings.php', newBooking)
      if (saved.error) { setError('Erreur lors de l\'ajout: ' + saved.error); return }
      setBookings((prev) => [...prev, { ...saved, label: LABELS[saved.statut] }])
      setShowAdd(false)
    } catch (err) {
      setError('Erreur lors de l\'ajout: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete('bookings.php', id)
      setBookings((prev) => prev.filter((b) => b.id !== id))
      setSelected(null)
    } catch (err) {
      setError('Erreur lors de la suppression: ' + err.message)
    }
  }

  const handleModify = async (modified) => {
    try {
      const result = await api.put('bookings.php', modified.id, modified)
      if (result.error) { setError('Erreur lors de la modification: ' + result.error); return }
      const updated = { ...modified, label: LABELS[modified.statut] }
      setBookings((prev) => prev.map((b) => (b.id === modified.id ? updated : b)))
      setSelected(updated)
    } catch (err) {
      setError('Erreur lors de la modification: ' + err.message)
    }
  }

  const filtered = bookings.filter((b) =>
    b.patient.toLowerCase().includes(search.toLowerCase())
  )

  if (error) return <p style={{color:'red', padding:'2rem'}}>Erreur: {error}</p>

  return (
    <>
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
