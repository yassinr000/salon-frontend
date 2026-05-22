import React, { useState, useEffect } from 'react'
import { api } from '../api.js'
import './styles/addRdv.css'

function AddRdv({ onAdd, onClose }) {
  const [clients, setClients] = useState([])
  const [services, setServices] = useState([])
  const [form, setForm] = useState({
    client_id: '', service_id: '', date: '', price: '', statut: 'en-attente',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([api.get('clients.php'), api.get('services.php')])
      .then(([c, s]) => {
        setClients(Array.isArray(c) ? c : [])
        setServices(Array.isArray(s) ? s : [])
        setLoading(false)
      })
      .catch(() => { setError('Impossible de charger les données'); setLoading(false) })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'service_id') {
      const selected = services.find((s) => String(s.id) === value)
      setForm((prev) => ({ ...prev, service_id: value, price: selected ? selected.prix : prev.price }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd(form)
  }

  if (loading) return (
    <div className="modal-overlay">
      <div className="booking-modal"><p style={{ padding: '1rem' }}>Chargement...</p></div>
    </div>
  )

  return (
    <div className="modal-overlay">
      <div className="booking-modal">
        <div className="modal-header">
          <h2>Ajouter un rendez-vous</h2>
          <button className="close-btn" onClick={onClose} type="button">×</button>
        </div>
        {error && <p style={{ color: 'red', padding: '0 1rem' }}>{error}</p>}
        <form className="booking-form" onSubmit={handleSubmit}>
          <select name="client_id" value={form.client_id} onChange={handleChange} required>
            <option value="">-- Sélectionner un client --</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.patient}</option>
            ))}
          </select>

          <select name="service_id" value={form.service_id} onChange={handleChange} required>
            <option value="">-- Sélectionner un service --</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.nom} — {s.prix} MAD</option>
            ))}
          </select>

          <input type="date" name="date" value={form.date} onChange={handleChange} required />

          <input type="number" name="price" placeholder="Prix (MAD)" value={form.price} onChange={handleChange} required />

          <select name="statut" value={form.statut} onChange={handleChange}>
            <option value="confirme">Confirmé</option>
            <option value="en-attente">En attente</option>
            <option value="annule">Annulé</option>
          </select>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Annuler</button>
            <button type="submit" className="save-btn">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddRdv
