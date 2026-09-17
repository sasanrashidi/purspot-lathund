import React from 'react'
import { getAvailableModes } from './logic'

// =============================================================
// Steg 3 – välj driftsätt (Läge A/B/C) för en specifik terminal.
// Visar de lägen som är giltiga för terminalen enligt rules.
// Ej tillgängliga lägen är nedtonade och förklarade.
// =============================================================
export default function ModePicker({ rules, deviceId, selectedIds = [], value, onChange }) {
  const modes = getAvailableModes(rules, deviceId, selectedIds) || []
  if (!modes.length) return null

  return (
    <div
      className="pkg-mode-row"
      role="group"
      aria-label="Välj driftsätt"
    >
      {modes.map((m) => {
        const active = m.id === value
        return (
          <button
            key={m.id}
            type="button"
            className={`pkg-mode-chip${active ? ' is-active' : ''}${m.disabled ? ' is-disabled' : ''}`}
            onClick={() => { if (!m.disabled) onChange(m.id) }}
            disabled={m.disabled}
            title={m.disabled && m.reason ? m.reason : undefined}
          >
            <span className="pkg-mode-badge" aria-hidden="true">{m.badge}</span>
            <span className="pkg-mode-label">{m.label}</span>
            <span className="pkg-mode-desc">{m.desc}</span>
          </button>
        )
      })}
    </div>
  )
}
