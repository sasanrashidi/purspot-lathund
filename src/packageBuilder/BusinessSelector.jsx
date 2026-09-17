import React from 'react'

// =============================================================
// Steg 1 – Välj verksamhetstyp lämplig för paketet.
// =============================================================
export default function BusinessSelector({ rules, value, onChange }) {
  const types = rules.businessTypes || {}
  const ids = Object.keys(types)

  return (
    <section className="pkg-step" aria-label="Verksamhetstyp">
      <header className="pkg-step-head">
        <span className="pkg-step-badge">1</span>
        <div>
          <h3 className="pkg-step-title">Verksamhetstyp</h3>
          <p className="pkg-step-desc">Vad ska paketet täcka?</p>
        </div>
      </header>

      <div className="pkg-business-grid">
        {ids.map((id) => {
          const t = types[id]
          const active = value === id
          return (
            <button
              key={id}
              type="button"
              className={`pkg-business-card${active ? ' is-active' : ''}`}
              onClick={() => onChange(id)}
              aria-pressed={active}
            >
              <span className="pkg-business-icon" aria-hidden="true">{t.icon}</span>
              <span className="pkg-business-name">{t.label}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
