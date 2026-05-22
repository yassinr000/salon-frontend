import React, { useState, useEffect, useCallback } from 'react'
import AddService from '../components/AddService.jsx'
import ManageService from '../components/ManageService.jsx'
import { api } from '../api.js'

function Services() {
  const [services, setServices] = useState([])
  const [search, setSearch]     = useState('')
  const [showAdd, setShowAdd]   = useState(false)
  const [selected, setSelected] = useState(null)
  const [error, setError]       = useState(null)

  const loadServices = useCallback(() => {
    api.get('services.php')
      .then((data) => {
        if (!Array.isArray(data)) { setError(data.error || 'Erreur API'); return }
        setServices(data)
      })
      .catch((err) => setError(err.message))
  }, [])

  useEffect(() => { loadServices() }, [loadServices])

  const handleAdd = async (newService) => {
    try {
      const saved = await api.post('services.php', newService)
      if (saved.error) { setError('Erreur lors de l\'ajout: ' + saved.error); return }
      setShowAdd(false)
      loadServices()
    } catch (err) {
      setError('Erreur lors de l\'ajout: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete('services.php', id)
      setSelected(null)
      loadServices()
    } catch (err) {
      setError('Erreur lors de la suppression: ' + err.message)
    }
  }

  const handleModify = async (modified) => {
    try {
      const result = await api.put('services.php', modified.id, modified)
      if (result.error) { setError('Erreur lors de la modification: ' + result.error); return }
      setSelected(null)
      loadServices()
    } catch (err) {
      setError('Erreur lors de la modification: ' + err.message)
    }
  }

  const filtered = services.filter((s) =>
    (s.nom || '').toLowerCase().includes(search.toLowerCase())
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
      <div className="service-header">
        <h1>Services</h1>
      </div>
      <div className="service-container">
        <div className="container-header">
          <input
            type="text"
            placeholder="Rechercher un service"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="add-service" onClick={() => setShowAdd(true)}>
            Ajouter un service
          </button>
        </div>
        <hr />
        <div className="service-span">
          <span>Service</span>
          <span>Prix</span>
          <span>Employé</span>
          <span>Durée</span>
          <span>Action</span>
        </div>
        <div className="service-props">
          {filtered.map((service) => (
            <div className="service-row" key={service.id}>
              <span>{service.nom}</span>
              <span>{service.prix} MAD</span>
              <span>{service.employe}</span>
              <span>{service.duree} MIN</span>
              <span>
                <button className="small-btns" onClick={() => setSelected(service)}>Gérer</button>
              </span>
            </div>
          ))}
        </div>
      </div>
      {showAdd && <AddService onAdd={handleAdd} onClose={() => setShowAdd(false)} />}
      {selected && (
        <ManageService
          service={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
          onModify={handleModify}
        />
      )}
    </>
  )
}

export default Services
