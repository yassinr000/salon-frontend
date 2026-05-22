import React, { useState } from 'react'
import './styles/ModifyRdv.css'

const LABELS = { confirme: 'Confirmé', annule: 'Annulé', 'en-attente': 'En attente' }

function ModifyRdv({ booking, onClose, onModify }) {
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    patient: booking?.patient ?? '',
    service: booking?.service ?? '',
    date:    booking?.date    ?? '',
    price:   booking?.price   ?? '',
    statut:  booking?.statut  ?? 'en-attente',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onModify({ ...booking, ...form, label: LABELS[form.statut] })
    onClose()
  }

  return (
    <div className="modify-overlay">
      <div className="modify-modal">
        <div className="header-modal">
          <h2>Modifier le rendez-vous</h2>
          <button className="close-btn" type="button" onClick={onClose}>×</button>
        </div>
        <form className="modify-rdv" onSubmit={handleSubmit}>
          <input type="text"   name="patient" value={form.patient} onChange={handleChange} required />
          <input type="text"   name="service" value={form.service} onChange={handleChange} required />
          <input type="date"   name="date"    value={form.date}    min={today} onChange={handleChange} required />
          <input type="number" name="price"   value={form.price}   onChange={handleChange} required />
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
