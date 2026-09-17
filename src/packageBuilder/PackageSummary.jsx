import React from 'react'
import { MODE_LABELS } from './rules'

// =============================================================
// Steg 4 – Paketöversikt (sammanställning).
// Ren presentationskomponent: tar emot färdigberäknade `groups`
// från containern (via logic.groupSelection) och ritar dem med
// driftsätt för terminaler. Ingen logik importeras här – allt
// kommer färdiggrupperat.
// =============================================================
export default function PackageSummary({ groups = [], drops = [], onRemove, onDismissDrops }) {
  const total = groups.reduce((sum, g) => sum + g.items.reduce((n, it) => n + (it.qty || 1), 0), 0)

  return (
    <section className="pkg-step pkg-summary" aria-label="Paketöversikt">
      <header className="pkg-step-head">
        <span className="pkg-step-badge">4</span>
        <div>
          <h3 className="pkg-step-title">Paketöversikt</h3>
          <p className="pkg-step-desc">
            {total} enheter · {groups.length} grupper
          </p>
        </div>
      </header>

      {drops.length > 0 && (
        <div className="pkg-drop-notice" role="status">
          <span className="pkg-drop-notice-text">
            <strong>Borttagna enheter:</strong> {drops.join(', ')}
          </span>
          <button
            type="button"
            className="pkg-drop-dismiss"
            onClick={onDismissDrops}
            aria-label="Stäng notis"
          >
            ×
          </button>
        </div>
      )}

      {groups.length === 0 ? (
        <p className="pkg-summary-empty">Inga enheter valda ännu.</p>
      ) : (
        groups.map((group) => (
          <div key={group.role} className="pkg-summary-group">
            <h4 className="pkg-summary-group-title">{group.title}</h4>
            <ul className="pkg-summary-list">
              {group.items.map((item) => {
                const meta = MODE_LABELS[item.mode]
                return (
                  <li key={item.id} className="pkg-summary-item">
                    <span className="pkg-summary-device">
                      {item.name || item.id}
                      {(item.qty && item.qty > 1) ? ` × ${item.qty}` : ''}
                    </span>
                    <span className="pkg-summary-right">
                      {meta && (
                        <span className="pkg-summary-mode">
                          <span className="pkg-mode-badge" aria-hidden="true">{meta.badge}</span>
                          {meta.label}
                        </span>
                      )}
                      <button
                        type="button"
                        className="pkg-summary-remove"
                        onClick={() => onRemove(item.id)}
                        aria-label={`Ta bort ${item.name || item.id}`}
                      >
                        ×
                      </button>
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))
      )}
    </section>
  )
}
