import React, { useState } from 'react'
import './styles/ManageService.css'

function ManageService({ service, onClose, onDelete, onModify }) {
  const [showModify, setShowModify] = useState(false)
  const [form, setForm] = useState({
    nom:     service.nom,
    prix:    service.prix,
    employe: service.employe,
    duree:   service.duree,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onModify({ ...service, ...form })
    onClose()
  }

  if (showModify) {
    return (
      <div className="manage-overlay">
        <div className="manage-modal">
          <div className="manage-header">
            <h2>Modifier {service.nom}</h2>
            <button className="close-btn" type="button" onClick={() => setShowModify(false)}>×</button>
          </div>
          <form className="inline-form" onSubmit={handleSubmit}>
            <input className="inline-input" type="text"   name="nom"     value={form.nom}     onChange={handleChange} placeholder="Nom du service" required />
            <input className="inline-input" type="number" name="prix"    value={form.prix}    onChange={handleChange} placeholder="Prix (MAD)"     required />
            <input className="inline-input" type="text"   name="employe" value={form.employe} onChange={handleChange} placeholder="Employé"        required />
            <input className="inline-input" type="number" name="duree"   value={form.duree}   onChange={handleChange} placeholder="Durée (min)"     required />
            <div className="inline-actions">
              <button type="button" className="delete-btn" onClick={() => setShowModify(false)}>Annuler</button>
              <button type="submit" className="modify-btn">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="manage-overlay">
      <div className="manage-modal">
        <div className="manage-header">
          <h2>Action pour {service.nom}</h2>
          <button className="close-btn" type="button" onClick={onClose}>×</button>
        </div>
        <div className="manage-btn">
          <button className="modify-btn" type="button" onClick={() => setShowModify(true)}>Modifier</button>
          <button className="delete-btn" type="button" onClick={() => { onDelete(service.id); onClose() }}>Supprimer</button>
        </div>
      </div>
    </div>
  )
}

export default ManageService
