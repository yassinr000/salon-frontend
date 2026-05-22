import React, { useState, useEffect, useCallback } from 'react'
import AddClient from '../components/AddClient.jsx'
import ClientView from '../components/ClientView.jsx'
import { api } from '../api.js'

const LABELS = { actif: 'Actif', innactif: 'Innactif' }

function Clients() {
  const [clients, setClients]   = useState([])
  const [search, setSearch]     = useState('')
  const [showAdd, setShowAdd]   = useState(false)
  const [selected, setSelected] = useState(null)
  const [error, setError]       = useState(null)

  const loadClients = useCallback(() => {
    api.get('clients.php')
      .then((data) => {
        if (!Array.isArray(data)) { setError(data.error || 'Erreur API'); return }
        setClients(data.map((c) => ({ ...c, label: LABELS[c.statut] })))
      })
      .catch((err) => setError(err.message))
  }, [])

  useEffect(() => { loadClients() }, [loadClients])

  const handleAdd = async (newClient) => {
    try {
      const saved = await api.post('clients.php', newClient)
      if (saved.error) { setError('Erreur lors de l\'ajout: ' + saved.error); return }
      setShowAdd(false)
      loadClients()
    } catch (err) {
      setError('Erreur lors de l\'ajout: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete('clients.php', id)
      setSelected(null)
      loadClients()
    } catch (err) {
      setError('Erreur lors de la suppression: ' + err.message)
    }
  }

  const handleModify = async (modified) => {
    try {
      const result = await api.put('clients.php', modified.id, modified)
      if (result.error) { setError('Erreur lors de la modification: ' + result.error); return }
      setSelected(null)
      loadClients()
    } catch (err) {
      setError('Erreur lors de la modification: ' + err.message)
    }
  }

  const filtered = clients.filter((c) =>
    (c.patient || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px',
          padding: '0.75rem 1.25rem', margin: '1rem 1.5rem 0',
          color: '#b91c1c', fontSize: '0.9rem', gap: '1rem'
        }}>
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#b91c1c', fontSize: '1.2rem', lineHeight: 1
          }}>×</button>
        </div>
      )}
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
