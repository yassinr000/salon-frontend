import React, { useState } from 'react'
import './styles/addClient.css'

function AddClient({ onAdd, onClose }) {
  const [form, setForm] = useState({ patient: '', numero: '', ville: '', note: '', statut: 'actif' })

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
      <div className="client-modal">
        <div className="client-header">
          <h2>Ajouter un client</h2>
          <button className="close-btn" type="button" onClick={onClose}>×</button>
        </div>
        <form className="client-form" onSubmit={handleSubmit}>
          <input type="text" name="patient" placeholder="Patient" value={form.patient} onChange={handleChange} required />
          <input type="number" name="numero" placeholder="Numéro" value={form.numero} onChange={handleChange} required />
          <input type="text" name="ville" placeholder="Ville" value={form.ville} onChange={handleChange} required />
          <input type="text" name="note" placeholder="Notes" value={form.note} onChange={handleChange} />
          <select name="statut" value={form.statut} onChange={handleChange}>
            <option value="actif">Actif</option>
            <option value="innactif">Innactif</option>
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

export default AddClient
