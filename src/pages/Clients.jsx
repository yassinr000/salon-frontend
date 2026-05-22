import React, { useState, useEffect } from 'react'
import AddClient from '../components/AddClient.jsx'
import ClientView from '../components/ClientView.jsx'
import { api } from '../api.js'

const LABELS = { actif: 'Actif', innactif: 'Innactif' }

function Clients() {
  const [clients, setClients] = useState([])
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('clients.php')
      .then((data) => {
        if (!Array.isArray(data)) { setError(data.error || 'Erreur API'); return }
        setClients(data.map((c) => ({ ...c, label: LABELS[c.statut] })))
      })
      .catch((err) => setError(err.message))
  }, [])

  const handleAdd = async (newClient) => {
    const saved = await api.post('clients.php', newClient)
    setClients((prev) => [...prev, { ...saved, label: LABELS[saved.statut] }])
    setShowAdd(false)
  }

  const handleDelete = async (id) => {
    await api.delete('clients.php', id)
    setClients((prev) => prev.filter((c) => c.id !== id))
    setSelected(null)
  }

  const handleModify = async (modified) => {
    await api.put('clients.php', modified.id, modified)
    const updated = { ...modified, label: LABELS[modified.statut] }
    setClients((prev) => prev.map((c) => (c.id === modified.id ? updated : c)))
    setSelected(null)
  }

  const filtered = clients.filter((c) =>
    c.patient.toLowerCase().includes(search.toLowerCase())
  )

  if (error) return <p style={{color:'red', padding:'2rem'}}>Erreur: {error}</p>

  return (
    <>
      <h1 className="clients-title">Clients</h1>
      <div className="clients-container">
        <div className="clients-topbar">
          <input
            type="text"
            placeholder="Rechercher un client"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => setShowAdd(true)}>Ajouter un client</button>
        </div>
        <div className="clients-table">
          <span>Name</span>
          <span>Numéro</span>
          <span>Ville</span>
          <span>Notes</span>
          <span>Statut</span>
          <span>Action</span>
        </div>
        <div className="rdv-list">
          {filtered.map((client) => (
            <div className="client-row" key={client.id}>
              <span>{client.patient}</span>
              <span>{client.numero}</span>
              <span>{client.ville}</span>
              <span>{client.note}</span>
              <span className={`status ${client.statut}`}>{client.label}</span>
              <span>
                <button className="small-btn" onClick={() => setSelected(client)}>Gérer</button>
              </span>
            </div>
          ))}
        </div>
      </div>
      {showAdd && <AddClient onAdd={handleAdd} onClose={() => setShowAdd(false)} />}
      {selected && (
        <ClientView
          client={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
          onModify={handleModify}
        />
      )}
    </>
  )
}

export default Clients
