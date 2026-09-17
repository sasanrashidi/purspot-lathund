import React from 'react'
import { getRoleIds, sortDevicesByRole, getDeviceStatus } from './logic'
import ModePicker from './ModePicker'

// =============================================================
// Steg 2 – välj enheter.
// Grupperar de enheter som hör till vald verksamhetstyp och
// visar dem som klickbara kort. Kortterminaler får dessutom en
// nedfälld ModePicker när de är valda (välj driftsätt).
// =============================================================
const GROUP_TITLES = {
  main: 'Huvudkassor',
  express: 'Expresskassor',
  terminal: 'Kortterminaler',
  accessory: 'Tillbehör'
}
const GROUP_ORDER = ['main', 'express', 'terminal', 'accessory']

export default function DevicePicker({ rules, businessId, devices, selected, onToggle, onSetMode, onSetQty }) {
  const businessDevices = (rules.businessTypes[businessId] || {}).devices || []
  const deviceById = {}
  for (const d of devices) deviceById[d.id] = d
  const selectedIds = Object.keys(selected)

  const groups = GROUP_ORDER
    .map((role) => ({
      role,
      title: GROUP_TITLES[role],
      ids: getRoleIds(rules, role).filter((id) => businessDevices.includes(id))
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
              const isAccessory = Boolean(rules.accessories && rules.accessories[id])
              const isSelected = selected[id] !== undefined
              const qty = typeof selected[id] === 'number' ? selected[id] : 1
              const status = isSelected
                ? { state: 'enabled' }
                : getDeviceStatus(rules, id, selectedIds)
              const disabled = status.state === 'disabled'

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
                    title={disabled ? status.reason : undefined}
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

                  {isSelected && isAccessory && (
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
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <p className="pkg-step-hint">
        Nedtonade enheter kräver ett tillägg som inte är valt ännu.
      </p>
    </section>
  )
}
