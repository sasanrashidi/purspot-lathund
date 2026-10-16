import React, { useState, useEffect } from 'react'
import { subscribeToCustomers, addCustomer, updateCustomer, customerFullName } from '../customers'

// =============================================================
// Steg 5 – Spara paketet på en kund.
// Säljaren kan antingen uppdatera en befintlig kund (välj ur
// listan) eller skapa en ny kund direkt från Paketbyggaren.
// Paketet (val, antal, köpform, verksamhetstyp) sparas som
// `packageData` på kunden och syns i Kundregistret.
// =============================================================

const EMPTY_FORM = {
  company: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: ''
}

export default function SaveToCustomer({
  businessId,
  selected,
  quantities,
  contracts,
  linkedCustomerId,
  onLinkedCustomerChange
}) {
  const [customers, setCustomers] = useState([])
  const [targetId, setTargetId] = useState(linkedCustomerId || '')
  const [showNew, setShowNew] = useState(false)

  useEffect(() => {
    if (showNew) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [showNew])
  const [form, setForm] = useState(EMPTY_FORM)
  const [message, setMessage] = useState(null)

  useEffect(() => subscribeToCustomers(setCustomers), [])

  useEffect(() => {
    if (linkedCustomerId && linkedCustomerId !== targetId) setTargetId(linkedCustomerId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedCustomerId])

  const hasSelection = selected && Object.keys(selected).length > 0
  const packageData = { businessId, selected, quantities, contracts }

  function flash(text, kind) {
    setMessage({ text, kind })
    window.setTimeout(() => setMessage(null), 3500)
  }

  function handleSaveToExisting() {
    if (!targetId) {
      flash('Välj en kund i listan först.', 'error')
      return
    }
    if (!hasSelection) {
      flash('Paketet är tomt – lägg till minst en enhet.', 'error')
      return
    }
    const updated = updateCustomer(targetId, { packageData })
    if (updated) {
      flash('Paketet sparades på ' + (updated.company || customerFullName(updated) || 'kunden') + '.', 'ok')
      if (onLinkedCustomerChange) onLinkedCustomerChange(updated.id)
    } else {
      flash('Kunde inte hitta kunden.', 'error')
    }
  }

  function handleCreateNew(e) {
    e.preventDefault()
    if (!form.company && !(form.firstName || form.lastName)) {
      flash('Ange minst företag eller kundnamn.', 'error')
      return
    }
    const created = addCustomer({ ...form, status: 'Utkast', packageData })
    setShowNew(false)
    setForm(EMPTY_FORM)
    setTargetId(created.id)
    if (onLinkedCustomerChange) onLinkedCustomerChange(created.id)
    flash('Ny kund skapad och paketet sparat.', 'ok')
  }

  return (
    <section className="pkg-step save-to-customer" aria-label="Spara paket på kund">
      <header className="pkg-step-head">
        <span className="pkg-step-badge">5</span>
        <div>
          <h3 className="pkg-step-title">Spara paket på kund</h3>
          <p className="pkg-step-desc">Koppla paketet till en kund i Kundregistret</p>
        </div>
      </header>

      <div className="save-customer-existing">
        <label className="save-customer-label" htmlFor="save-customer-select">
          Befintlig kund
        </label>
        <select
          id="save-customer-select"
          className="save-customer-select"
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
        >
          <option value="">— Välj kund —</option>
          {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company || customerFullName(c) || 'Namnlös'}{c.phone ? ' · ' + c.phone : ''}
              </option>
          ))}
        </select>
        <button
          type="button"
          className="btn-primary save-customer-btn"
          onClick={handleSaveToExisting}
          disabled={!hasSelection}
        >
          Spara / uppdatera paket på kund
        </button>
      </div>

      <div className="save-customer-divider"><span>eller</span></div>

      <button
        type="button"
        className="btn-ghost save-customer-btn"
        onClick={() => setShowNew(true)}
        disabled={!hasSelection}
      >
        + Spara som ny kund
      </button>

      {!hasSelection && (
        <p className="save-customer-hint">Lägg till minst en enhet för att kunna spara paketet.</p>
      )}

      {message && (
        <p className={'save-customer-msg ' + (message.kind === 'ok' ? 'is-ok' : 'is-error')}>
          {message.text}
        </p>
      )}

      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal-panel cust-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button type="button" className="modal-close" onClick={() => setShowNew(false)} aria-label="Stäng">✕</button>
            <div className="cust-modal-body">
              <h2 className="modal-title">Ny kund</h2>
              <form onSubmit={handleCreateNew} className="cust-form">
                <div className="form-group">
                  <label htmlFor="sc-company">Företag</label>
                  <input
                    id="sc-company"
                    type="text"
                    placeholder="Företagsnamn"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    autoComplete="organization"
                  />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="sc-firstName">Förnamn</label>
                    <input
                      id="sc-firstName"
                      type="text"
                      placeholder="Förnamn"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="sc-lastName">Efternamn</label>
                    <input
                      id="sc-lastName"
                      type="text"
                      placeholder="Efternamn"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      autoComplete="family-name"
                    />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="sc-phone">Telefon</label>
                    <input
                      id="sc-phone"
                      type="tel"
                      placeholder="07X XXX XX XX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      autoComplete="tel"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="sc-email">E-post</label>
                    <input
                      id="sc-email"
                      type="email"
                      placeholder="namn@foretag.se"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-ghost" onClick={() => setShowNew(false)}>
                    Avbryt
                  </button>
                  <button type="submit" className="btn-primary">
                    Spara & Koppla paket
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
