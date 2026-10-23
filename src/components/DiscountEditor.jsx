import React, { useState } from 'react'

// =============================================================
// Delad rabatt-UI – används av Paketbyggarens Paketöversikt och
// Kundregistrets detaljvy. Inget sparas här; föräldern får
// `onSave({ type, value })` (eller null vid "Ta bort").
// =============================================================

export function DiscountButton({ onClick, active = false, title = 'Rabatt' }) {
  return (
    <button
      type="button"
      className={`disc-btn${active ? ' is-active' : ''}`}
      onClick={onClick}
      title={title}
      aria-label={title}
    >
      %
    </button>
  )
}

// Inline-editor: tal + typknapp (% eller fast belopp) + spara/ta bort/avbryt.
// unit = 'kr/mån' för månadsrader, 'kr' för engångsköp.
export default function DiscountEditor({ initial = null, unit = 'kr/mån', onSave, onCancel, onClear }) {
  const [type, setType] = useState(initial?.type || 'percent')
  const [value, setValue] = useState(initial ? String(initial.value) : '')

  function save() {
    const n = Number(String(value).replace(',', '.'))
    if (!Number.isFinite(n) || n <= 0) {
      if (initial && onClear) onClear()
      else onCancel()
      return
    }
    onSave({ type, value: n })
  }

  return (
    <div className="disc-editor" onClick={(e) => e.stopPropagation()}>
      <input
        className="disc-input"
        type="number"
        inputMode="decimal"
        min="0"
        step="any"
        autoFocus
        placeholder={type === 'percent' ? '%' : 'kr'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            save()
          }
          if (e.key === 'Escape') onCancel()
        }}
        aria-label={type === 'percent' ? 'Rabatt i procent' : 'Rabatt i kronor'}
      />
      <div className="disc-types" role="group" aria-label="Rabatttyp">
        <button
          type="button"
          className={`disc-type${type === 'percent' ? ' is-active' : ''}`}
          onClick={() => setType('percent')}
        >
          %
        </button>
        <button
          type="button"
          className={`disc-type${type === 'fixed' ? ' is-active' : ''}`}
          onClick={() => setType('fixed')}
        >
          {unit}
        </button>
      </div>
      <button type="button" className="disc-save" onClick={save} aria-label="Spara rabatt">
        ✓
      </button>
      {initial && onClear && (
        <button type="button" className="disc-remove" onClick={onClear}>
          Ta bort
        </button>
      )}
      <button type="button" className="disc-cancel" onClick={onCancel} aria-label="Avbryt">
        ✕
      </button>
    </div>
  )
}
