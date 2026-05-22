import React, { useState } from 'react'
import './styles/AddService.css'

function AddService({ onAdd, onClose }) {
  const [form, setForm] = useState({ nom: '', prix: '', employe: '', duree: '' })

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
          <h2>Ajouter un service</h2>
          <button className="close-btn" type="button" onClick={onClose}>×</button>
        </div>
        <form className="service-form" onSubmit={handleSubmit}>
          <input type="text"   name="nom"     placeholder="Service"           onChange={handleChange} required />
          <input type="number" name="prix"    placeholder="Prix"              onChange={handleChange} required />
          <input type="text"   name="employe" placeholder="Employé"           onChange={handleChange} required />
          <input type="number" name="duree"   placeholder="Durée en minutes"  onChange={handleChange} required />
          <div className="service-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Annuler</button>
            <button type="submit" className="save-btn">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddService
