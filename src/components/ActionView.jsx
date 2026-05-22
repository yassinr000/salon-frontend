import React, { useState } from 'react'
import ModifyRdv from './ModifyRdv.jsx'
import './styles/ActionView.css'

function ActionView({ booking, onClose, onDelete, onModify }) {
  const [showModify, setShowModify] = useState(false)

  const handleEffectue = () => {
    onModify({ ...booking, statut: 'confirme' })
    onClose()
  }

  return (
    <>
      <div className="modal-overlay2">
        <div className="action-modal">
          <div className="model-header2">
            <h2>Action pour {booking.patient}</h2>
            <button className="close-btn2" onClick={onClose} type="button">×</button>
          </div>
          <form className="btn-form">
            <button className="modify-btn" type="button" onClick={() => setShowModify(true)}>Modifier</button>
            <button className="done-btn"   type="button" onClick={handleEffectue}>Effectué</button>
            <button className="delete-btn" type="button" onClick={() => { onDelete(booking.id); onClose() }}>Supprimer</button>
          </form>
        </div>
      </div>

      {showModify && (
        <ModifyRdv
          booking={booking}
          onClose={() => setShowModify(false)}
          onModify={(modified) => { onModify(modified); onClose() }}
        />
      )}
    </>
  )
}

export default ActionView
