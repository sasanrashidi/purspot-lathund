import React from 'react'

// =============================================================
// Steg 4 – Paketöversikt (sammanställning + totalkalkyl).
// Ren presentationskomponent: tar emot färdigberäknade `groups`
// från containern (via logic.groupSelection) och ritar dem med
// köpform och pris per enhet.
// Ingen logik importeras här – allt kommer färdiggrupperat.
// =============================================================
export default function PackageSummary({ groups = [], onRemove, businessType }) {
  const total = groups.reduce((sum, g) => sum + g.items.reduce((n, it) => n + (it.qty || 1), 0), 0)
  const biz = businessType?.label ? businessType : null

  const totals = groups.reduce(
    (acc, g) => {
      for (const it of g.items) {
        const qty = it.qty || 1
        if (it.contract === 'buy') acc.buy += (it.buyPrice || 0) * qty
        else acc.monthly += (it.monthly48 || 0) * qty
      }
      return acc
    },
    { buy: 0, monthly: 0 }
  )

  let runningIndex = 0
  const numberedGroups = groups.map((g) => {
    const startIndex = runningIndex
    runningIndex += g.items.length
    return { ...g, startIndex }
  })

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

      {biz && (
        <div className="pkg-summary-biz">
          <span className="pkg-summary-biz-icon" aria-hidden="true">{biz.icon}</span>
          <div className="pkg-summary-biz-text">
            <span className="pkg-summary-biz-label">Verksamhetstyp</span>
            <strong className="pkg-summary-biz-name">{biz.label}</strong>
          </div>
        </div>
      )}

      {groups.length === 0 ? (
        <p className="pkg-summary-empty">Inga enheter valda ännu.</p>
      ) : (
        numberedGroups.map((group) => (
          <div key={group.role} className="pkg-summary-group">
            <h4 className="pkg-summary-group-title">{group.title}</h4>
            <ul className="pkg-summary-list">
              {group.items.map((item, itemIndex) => {
                const qty = item.qty || 1
                const itemNumber = (group.startIndex || 0) + itemIndex + 1
                return (
                  <li key={item.id} className="pkg-summary-item">
                    <div className="pkg-summary-row">
                      <span className="pkg-summary-number" aria-hidden="true">{itemNumber}</span>
                      <span className="pkg-summary-device">
                        {item.name || item.id}
                      </span>
                      <button
                        type="button"
                        className="pkg-summary-remove"
                        onClick={() => onRemove(item.id)}
                        aria-label={`Ta bort ${item.name || item.id}`}
                      >
                        ×
                      </button>
                    </div>
                    <div className="pkg-summary-meta">
                      {item.contract === 'buy' ? (
                        <span className="pkg-summary-price">
                          Direktköp · {formatPrice(item.buyPrice * qty)}
                        </span>
                      ) : (
                        <span className="pkg-summary-price">
                          48 mån · {formatPrice(item.monthly48 * qty, '/mån')}
                        </span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ))
      )}

      {(totals.buy > 0 || totals.monthly > 0) && (
        <div className="pkg-summary-totals">
          {totals.buy > 0 && (
            <div className="pkg-summary-total">
              <span className="pkg-summary-total-label">Direktköp totalt</span>
              <strong className="pkg-summary-total-value">{formatPrice(totals.buy)}</strong>
            </div>
          )}
          {totals.monthly > 0 && (
            <div className="pkg-summary-total">
              <span className="pkg-summary-total-label">48 mån totalt</span>
              <strong className="pkg-summary-total-value">{formatPrice(totals.monthly, '/mån')}</strong>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function formatPrice(n, suffix = '') {
  return n.toLocaleString('sv-SE') + ' kr' + suffix
}