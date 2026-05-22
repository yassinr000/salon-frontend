import React, { useState, useEffect } from 'react'
import { api } from '../api.js'
import './styles/ModifyRdv.css'

const LABELS = { confirme: 'Confirmé', annule: 'Annulé', 'en-attente': 'En attente' }
const today = new Date().toISOString().split('T')[0]

function ModifyRdv({ booking, onClose, onModify }) {
  const [clients, setClients] = useState([])
  const [services, setServices] = useState([])
  const [form, setForm] = useState({
    client_id: String(booking?.client_id ?? ''),
    service_id: String(booking?.service_id ?? ''),
    date: booking?.date ?? '',
    price: booking?.price ?? '',
    statut: booking?.statut ?? 'en-attente',
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
    const selectedClient = clients.find((c) => String(c.id) === form.client_id)
    const selectedService = services.find((s) => String(s.id) === form.service_id)
    onModify({
      ...booking,
      ...form,
      patient: selectedClient?.patient || booking.patient,
      service: selectedService?.nom || booking.service,
      label: LABELS[form.statut],
    })
    onClose()
  }

  if (loading) return (
    <div className="modify-overlay">
      <div className="modify-modal"><p style={{ padding: '1rem' }}>Chargement...</p></div>
    </div>
  )

  return (
    <div className="modify-overlay">
      <div className="modify-modal">
        <div className="header-modal">
          <h2>Modifier le rendez-vous</h2>
          <button className="close-btn" type="button" onClick={onClose}>×</button>
        </div>
        {error && <p style={{ color: 'red', padding: '0 1rem' }}>{error}</p>}
        <form className="modify-rdv" onSubmit={handleSubmit}>
          <select name="client_id" value={form.client_id} onChange={handleChange} required>
            <option value="">-- Sélectionner un client --</option>
            {clients.map((c) => (
              <option key={c.id} value={String(c.id)}>{c.patient}</option>
            ))}
          </select>

          <select name="service_id" value={form.service_id} onChange={handleChange} required>
            <option value="">-- Sélectionner un service --</option>
            {services.map((s) => (
              <option key={s.id} value={String(s.id)}>{s.nom} — {s.prix} MAD</option>
            ))}
          </select>

          <input type="date" name="date" value={form.date} min={today} onChange={handleChange} required />
          <input type="number" name="price" value={form.price} onChange={handleChange} required />

          <select name="statut" value={form.statut} onChange={handleChange}>
            <option value="confirme">Confirmé</option>
            <option value="annule">Annulé</option>
            <option value="en-attente">En attente</option>
          </select>

          <div className="modify-action">
            <button type="button" className="cancel-btn" onClick={onClose}>Annuler</button>
            <button type="submit" className="save-btn">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModifyRdv
