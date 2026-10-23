import React, { useState } from 'react'
import DiscountEditor, { DiscountButton } from '../components/DiscountEditor'
import { discountAmount, discountLabel, summarizeRows } from './discounts'

// =============================================================
// Steg 4 – Paketöversikt (sammanställning + totalkalkyl).
// Tar emot färdigberäknade `groups` från containern och ritar
// dem med köpform, pris och rabatt per enhet, samt totalrabatt
// och omräknad slutsumma i botten.
// =============================================================
export default function PackageSummary({
  groups = [],
  onRemove,
  businessType,
  discounts = { items: {}, total: null },
  onItemDiscount,
  onTotalDiscount
}) {
  const total = groups.reduce((sum, g) => sum + g.items.reduce((n, it) => n + (it.qty || 1), 0), 0)
  const biz = businessType?.label ? businessType : null
  const [editingId, setEditingId] = useState(null)
  const [editingTotal, setEditingTotal] = useState(false)

  let runningIndex = 0
  const numberedGroups = groups.map((g) => {
    const startIndex = runningIndex
    runningIndex += g.items.length
    return { ...g, startIndex }
  })

  const rows = numberedGroups.flatMap((g) =>
    g.items.map((it) => ({
      contract: it.contract,
      regular: (it.contract === 'buy' ? it.buyPrice || 0 : it.monthly48 || 0) * (it.qty || 1),
      discount: discounts.items[it.id] || null
    }))
  )
  const sum = summarizeRows(rows, discounts.total)
  const hasRows = rows.length > 0
  const totalDiscMonthly = sum.totalDiscountMonthly
  const totalDiscBuy = sum.totalDiscountBuy

  return (
    <section className="pkg-step pkg-summary" aria-label="Paketöversikt">
      <header className="pkg-step-head">
        <span className="pkg-step-badge">4</span>
        <div>
          <div className="pkg-summary-head-row">
            <h3 className="pkg-step-title">Paketöversikt</h3>
            {biz && (
              <span className="pkg-biz-pill" title={`Verksamhetstyp: ${biz.label}`}>
                <span aria-hidden="true">{biz.icon}</span>
                {biz.label}
              </span>
            )}
          </div>
          <p className="pkg-step-desc">
            {total} enheter · {groups.length} grupper
          </p>
        </div>
      </header>

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
                const isBuy = item.contract === 'buy'
                const regular = (isBuy ? item.buyPrice || 0 : item.monthly48 || 0) * qty
                const d = discounts.items[item.id] || null
                const amount = discountAmount(regular, d)
                const finalPrice = regular - amount
                const suffix = isBuy ? '' : '/mån'
                const editing = editingId === item.id
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
                      <span className={`pkg-summary-price${d ? ' has-discount' : ''}`}>
                        {d ? (
                          <>
                            <s>{formatPrice(regular, suffix)}</s>
                            <strong>{formatPrice(finalPrice, suffix)}</strong>
                            <span className="disc-tag">{discountLabel(d)}</span>
                          </>
                        ) : (
                          <>
                            {isBuy ? 'Direktköp · ' : '48 mån · '}
                            {formatPrice(regular, suffix)}
                          </>
                        )}
                      </span>
                      <DiscountButton
                        active={editing}
                        onClick={() => setEditingId(editing ? null : item.id)}
                        title={`Rabatt på ${item.name || item.id}`}
                      />
                    </div>
                    {editing && (
                      <DiscountEditor
                        initial={d}
                        unit={isBuy ? 'kr' : 'kr/mån'}
                        onSave={(disc) => {
                          if (onItemDiscount) onItemDiscount(item.id, disc)
                          setEditingId(null)
                        }}
                        onCancel={() => setEditingId(null)}
                        onClear={() => {
                          if (onItemDiscount) onItemDiscount(item.id, null)
                          setEditingId(null)
                        }}
                      />
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))
      )}

      {hasRows && (
        <div className="pkg-summary-totals">
          {sum.regularMonthly > 0 && (
            <div className="pkg-summary-total">
              <span className="pkg-summary-total-label">Summa ordinarie</span>
              <span className="pkg-summary-total-value">{formatPrice(sum.regularMonthly, '/mån')}</span>
            </div>
          )}
          {sum.rowDiscountMonthly > 0 && (
            <div className="pkg-summary-total is-discount">
              <span className="pkg-summary-total-label">Radrabatter</span>
              <span className="pkg-summary-total-value">−{formatPrice(sum.rowDiscountMonthly, '/mån')}</span>
            </div>
          )}

          {discounts.total && !editingTotal ? (
            <div className="pkg-summary-total is-discount">
              <span className="pkg-summary-total-label">
                Totalrabatt
                <button
                  type="button"
                  className="disc-edit-link"
                  onClick={() => setEditingTotal(true)}
                  aria-label="Ändra totalrabatt"
                >
                  Ändra
                </button>
                <button
                  type="button"
                  className="disc-edit-link is-clear"
                  onClick={() => onTotalDiscount && onTotalDiscount(null)}
                >
                  Ta bort
                </button>
              </span>
              <span className="pkg-summary-total-value">
                −{formatPrice(totalDiscMonthly > 0 ? totalDiscMonthly : totalDiscBuy, totalDiscMonthly > 0 ? '/mån' : '')}
              </span>
            </div>
          ) : (
            !editingTotal && (
              <button type="button" className="disc-add-link" onClick={() => setEditingTotal(true)}>
                + Lägg till totalrabatt
              </button>
            )
          )}

          {editingTotal && (
            <DiscountEditor
              initial={discounts.total}
              unit="kr/mån"
              onSave={(disc) => {
                if (onTotalDiscount) onTotalDiscount(disc)
                setEditingTotal(false)
              }}
              onCancel={() => setEditingTotal(false)}
              onClear={() => {
                if (onTotalDiscount) onTotalDiscount(null)
                setEditingTotal(false)
              }}
            />
          )}

          {sum.regularMonthly > 0 && (
            <div className="pkg-summary-total is-final">
              <span className="pkg-summary-total-label">Slutgiltigt månadspris</span>
              <strong className="pkg-summary-total-value">{formatPrice(sum.finalMonthly, '/mån')}</strong>
            </div>
          )}
          {sum.regularBuy > 0 && (
            <div className="pkg-summary-total">
              <span className="pkg-summary-total-label">Engångsköp</span>
              <span className="pkg-summary-total-value">
                {sum.finalBuy < sum.regularBuy && (
                  <s className="disc-old">{formatPrice(sum.regularBuy)}</s>
                )}
                <strong>{formatPrice(sum.finalBuy)}</strong>
              </span>
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
