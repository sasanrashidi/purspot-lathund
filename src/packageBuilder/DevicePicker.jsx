import React from 'react'
import { getRoleIds, getDeviceAvailability } from './logic'
import ModePicker from './ModePicker'

// =============================================================
// Steg 2 – välj enheter.
// Grupperar alla enheter som hör till varje roll (huvudkassa,
// expresskassa, kortterminal, tillbehör). Enheter som inte är
// tillåtna för vald verksamhetstyp gråmarkeras och går inte att
// välja. Kortterminaler får dessutom en nedfälld ModePicker när
// de är valda (välj driftsätt A/B/C). Alla valda enheter visar
// en antalsväljare (–/+).
// =============================================================
const GROUP_TITLES = {
  main: 'Huvudkassor',
  express: 'Expresskassor',
  terminal: 'Kortterminaler',
  accessory: 'Tillbehör'
}
const GROUP_ORDER = ['main', 'express', 'terminal', 'accessory']

export default function DevicePicker({ rules, businessId, devices, selected, quantities, contracts, onToggle, onSetMode, onSetQty, onSetContract }) {
  const deviceById = {}
  for (const d of devices) deviceById[d.id] = d
  const selectedIds = Object.keys(selected)

  const groups = GROUP_ORDER
    .map((role) => ({
      role,
      title: GROUP_TITLES[role],
      ids: getRoleIds(rules, role)
    }))
    .filter((g) => g.ids.length)

  return (
    <section className="pkg-step" aria-label="Välj enheter">
      <header className="pkg-step-head">
        <span className="pkg-step-badge">2</span>
        <div>
          <h3 className="pkg-step-title">Enheter</h3>
          <p className="pkg-step-desc">Välj de enheter som ska ingå i paketet</p>
        </div>
      </header>

      {groups.map((group) => (
        <div key={group.role} className="pkg-device-group">
          <h4 className="pkg-device-group-title">{group.title}</h4>
          <div className="pkg-device-grid">
            {group.ids.map((id) => {
              const meta = deviceById[id] || { id }
              const isTerminal = Boolean(rules.terminals && rules.terminals[id])
              const isSelected = selected[id] !== undefined
              const qty = quantities[id] || 1
              const availability = getDeviceAvailability(rules, id, businessId, selectedIds)
              const disabled = availability.state === 'disabled'
              const contract = contracts[id] || (meta.monthly48 ? '48' : 'buy')
              const hasMonthly = Boolean(meta.monthly48)

              return (
                <div
                  key={id}
                  className={`pkg-device-card${isSelected ? ' is-selected' : ''}${disabled ? ' is-disabled' : ''}`}
                >
                  <button
                    type="button"
                    className="pkg-device-main"
                    onClick={() => { if (!disabled) onToggle(id) }}
                    disabled={disabled}
                    aria-pressed={isSelected}
                    title={disabled ? availability.reason : undefined}
                  >
                    {meta.imageUrl && (
                      <img
                        className="pkg-device-img"
                        src={meta.imageUrl}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                      />
                    )}
                    <span className="pkg-device-name">{meta.model || meta.id}</span>
                    <span className="pkg-device-cat">{meta.category || ''}</span>
                  </button>

                  {isSelected && !disabled && (
                    <div className="pkg-qty-row" role="group" aria-label={`Antal för ${meta.model || meta.id}`}>
                      <button
                        type="button"
                        className="pkg-qty-btn"
                        onClick={() => onSetQty(id, qty - 1)}
                        aria-label="Minska antal"
                      >
                        −
                      </button>
                      <span className="pkg-qty-value">{qty}</span>
                      <button
                        type="button"
                        className="pkg-qty-btn"
                        onClick={() => onSetQty(id, qty + 1)}
                        aria-label="Öka antal"
                      >
                        +
                      </button>
                      <span className="pkg-qty-label">st</span>
                    </div>
                  )}

                  {isSelected && isTerminal && (
                    <ModePicker
                      rules={rules}
                      deviceId={id}
                      selectedIds={selectedIds}
                      value={selected[id]}
                      onChange={(mode) => onSetMode(id, mode)}
                    />
                  )}

                  {isSelected && !disabled && (meta.buyPrice || meta.monthly48) && (
                    <div className="pkg-contract-row" role="group" aria-label={`Köpform för ${meta.model || meta.id}`}>
                      <button
                        type="button"
                        className={`pkg-contract-btn${contract === 'buy' ? ' is-active' : ''}`}
                        onClick={() => onSetContract(id, 'buy')}
                        aria-pressed={contract === 'buy'}
                      >
                        <span className="pkg-contract-head">
                          <span className="pkg-contract-check" aria-hidden="true">{contract === 'buy' ? '✓' : ''}</span>
                          <span className="pkg-contract-label">Direktköp</span>
                        </span>
                        {meta.buyPrice ? (
                          <span className="pkg-contract-price">{meta.buyPrice.toLocaleString('sv-SE')} kr</span>
                        ) : null}
                      </button>
                      {hasMonthly && (
                        <button
                          type="button"
                          className={`pkg-contract-btn${contract === '48' ? ' is-active' : ''}`}
                          onClick={() => onSetContract(id, '48')}
                          aria-pressed={contract === '48'}
                        >
                          <span className="pkg-contract-head">
                          <span className="pkg-contract-check" aria-hidden="true">{contract === '48' ? '✓' : ''}</span>
                          <span className="pkg-contract-label">48 mån</span>
                        </span>
                          <span className="pkg-contract-price">
                            {meta.monthly48 ? `${meta.monthly48.toLocaleString('sv-SE')} kr/mån` : 'Löpande pris'}
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <p className="pkg-step-hint">
        Gråmarkerade enheter är inte tillgängliga för vald verksamhetstyp eller kräver ett tillägg som inte är valt ännu.
      </p>
    </section>
  )
}