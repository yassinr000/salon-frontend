import React, { useState } from 'react'
import './styles/addRdv.css'

function AddRdv({ onAdd, onClose }) {
  const [form, setForm] = useState({
    patient: '', service: '', date: '', price: '', statut: 'en-attente',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd(form)
  }

  return (
    <div className="modal-overlay">
      <div className="booking-modal">
        <div className="modal-header">
          <h2>Ajouter un rendez-vous</h2>
          <button className="close-btn" onClick={onClose} type="button">×</button>
        </div>
        <form className="booking-form" onSubmit={handleSubmit}>
          <input type="text" name="patient" placeholder="Nom du patient" value={form.patient} onChange={handleChange} required />
          <input type="text" name="service" placeholder="Service" value={form.service} onChange={handleChange} required />
          <input type="date" name="date" value={form.date} onChange={handleChange} required />
          <input type="number" name="price" placeholder="Prix" value={form.price} onChange={handleChange} required />
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
