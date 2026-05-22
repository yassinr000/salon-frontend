import React, { useState } from 'react'
import './styles/ActionView.css'

function ClientView({ client, onClose, onDelete, onModify }) {
  const [showModify, setShowModify] = useState(false)
  const [form, setForm] = useState({
    patient: client.patient,
    numero:  client.numero,
    ville:   client.ville,
    note:    client.note,
    statut:  client.statut,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onModify({ ...client, ...form })
    onClose()
  }

  if (showModify) {
    return (
      <div className="modal-overlay2">
        <div className="action-modal">
          <div className="model-header2">
            <h2>Modifier {client.patient}</h2>
            <button className="close-btn2" type="button" onClick={() => setShowModify(false)}>×</button>
          </div>
          <form className="inline-form" onSubmit={handleSubmit}>
            <input className="inline-input" type="text"   name="patient" value={form.patient} onChange={handleChange} placeholder="Nom"     required />
            <input className="inline-input" type="text"   name="numero"  value={form.numero}  onChange={handleChange} placeholder="Numéro" required />
            <input className="inline-input" type="text"   name="ville"   value={form.ville}   onChange={handleChange} placeholder="Ville"   required />
            <input className="inline-input" type="text"   name="note"    value={form.note}    onChange={handleChange} placeholder="Note" />
            <select className="inline-input" name="statut" value={form.statut} onChange={handleChange}>
              <option value="actif">Actif</option>
              <option value="innactif">Innactif</option>
            </select>
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
    <div className="modal-overlay2">
      <div className="action-modal">
        <div className="model-header2">
          <h2>Action pour {client.patient}</h2>
          <button className="close-btn2" onClick={onClose} type="button">×</button>
        </div>
        <form className="btn-form">
          <button className="modify-btn" type="button" onClick={() => setShowModify(true)}>Modifier</button>
          <button className="delete-btn" type="button" onClick={() => { onDelete(client.id); onClose() }}>Supprimer</button>
        </form>
      </div>
    </div>
  )
}

export default ClientView
