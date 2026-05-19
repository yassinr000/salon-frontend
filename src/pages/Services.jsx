import React, { useState, useEffect } from 'react'
import AddService from '../components/AddService.jsx'
import ManageService from '../components/ManageService.jsx'
import { api } from '../api.js'

function Services() {
  const [services, setServices] = useState([])
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    api.get('services.php').then(setServices)
  }, [])

  const handleAdd = async (newService) => {
    const saved = await api.post('services.php', newService)
    setServices((prev) => [...prev, saved])
    setShowAdd(false)
  }

  const handleDelete = async (id) => {
    await api.delete('services.php', id)
    setServices((prev) => prev.filter((s) => s.id !== id))
    setSelected(null)
  }

  const handleModify = async (modified) => {
    await api.put('services.php', modified.id, modified)
    setServices((prev) => prev.map((s) => (s.id === modified.id ? modified : s)))
    setSelected(null)
  }

  const filtered = services.filter((s) =>
    s.nom.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
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
