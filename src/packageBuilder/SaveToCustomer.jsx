import React, { useState, useEffect } from 'react'
import { subscribeToCustomers, addCustomer, updateCustomer, customerFullName, formatOrgNumber } from '../customers'

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
  email: '',
  orgNumber: '',
  avtalStart: '',
  deliveryAddress: '',
  invoiceAddress: ''
}

export default function SaveToCustomer({
  businessId,
  selected,
  quantities,
  contracts,
  discounts,
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
  const [serialsOpen, setSerialsOpen] = useState(false)
  const [errors, setErrors] = useState({})

  const requiredFields = [
    'company',
    'firstName',
    'lastName',
    'phone',
    'email',
    'orgNumber',
    'avtalStart',
    'deliveryAddress',
    'invoiceAddress'
  ]

  const validate = (data) => {
    const errs = {}
    for (const f of requiredFields) {
      if (!String(data?.[f] || '').trim()) errs[f] = 'Obligatoriskt fält'
    }
    return errs
  }

  useEffect(() => subscribeToCustomers(setCustomers), [])

  useEffect(() => {
    if (linkedCustomerId && linkedCustomerId !== targetId) setTargetId(linkedCustomerId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedCustomerId])

  const hasSelection = selected && Object.keys(selected).length > 0
  const packageData = { businessId, selected, quantities, contracts, discounts }

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
    const payload = {
      ...form,
      orgNumber: formatOrgNumber(form.orgNumber),
      status: 'Utkast',
      packageData
    }
    const errs = validate(payload)
    if (Object.keys(errs).length) {
      setErrors(errs)
      flash('Fyll i alla obligatoriska fält.', 'error')
      return
    }
    setErrors({})
    const created = addCustomer(payload)
    setShowNew(false)
    setForm(EMPTY_FORM)
    setErrors({})
    setSerialsOpen(false)
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
            <button
              type="button"
              className="modal-close"
              onClick={() => {
                setShowNew(false)
                setErrors({})
              }}
              aria-label="Stäng"
            >
              ✕
            </button>
            <div className="cust-modal-body">
              <h2 className="modal-title">Ny kund</h2>
              <form onSubmit={handleCreateNew} className="cust-form" noValidate>
                <div className="form-group">
                  <label htmlFor="sc-company">
                    Företag <span className="req">*</span>
                  </label>
                  <input
                    id="sc-company"
                    type="text"
                    required
                    className={errors.company ? 'is-invalid' : ''}
                    placeholder="Företagsnamn"
                    value={form.company}
                    onChange={(e) => {
                      setForm({ ...form, company: e.target.value })
                      if (errors.company) setErrors({ ...errors, company: '' })
                    }}
                    autoComplete="organization"
                  />
                  {errors.company && <span className="form-error">{errors.company}</span>}
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="sc-firstName">
                      Förnamn <span className="req">*</span>
                    </label>
                    <input
                      id="sc-firstName"
                      type="text"
                      required
                      className={errors.firstName ? 'is-invalid' : ''}
                      placeholder="Förnamn"
                      value={form.firstName}
                      onChange={(e) => {
                        setForm({ ...form, firstName: e.target.value })
                        if (errors.firstName) setErrors({ ...errors, firstName: '' })
                      }}
                      autoComplete="given-name"
                    />
                    {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="sc-lastName">
                      Efternamn <span className="req">*</span>
                    </label>
                    <input
                      id="sc-lastName"
                      type="text"
                      required
                      className={errors.lastName ? 'is-invalid' : ''}
                      placeholder="Efternamn"
                      value={form.lastName}
                      onChange={(e) => {
                        setForm({ ...form, lastName: e.target.value })
                        if (errors.lastName) setErrors({ ...errors, lastName: '' })
                      }}
                      autoComplete="family-name"
                    />
                    {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="sc-phone">
                      Telefon <span className="req">*</span>
                    </label>
                    <input
                      id="sc-phone"
                      type="tel"
                      required
                      className={errors.phone ? 'is-invalid' : ''}
                      placeholder="07X XXX XX XX"
                      value={form.phone}
                      onChange={(e) => {
                        setForm({ ...form, phone: e.target.value })
                        if (errors.phone) setErrors({ ...errors, phone: '' })
                      }}
                      autoComplete="tel"
                    />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="sc-email">
                      E-post <span className="req">*</span>
                    </label>
                    <input
                      id="sc-email"
                      type="email"
                      required
                      className={errors.email ? 'is-invalid' : ''}
                      placeholder="namn@foretag.se"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value })
                        if (errors.email) setErrors({ ...errors, email: '' })
                      }}
                      autoComplete="email"
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="sc-org">
                      Organisationsnummer <span className="req">*</span>
                    </label>
                    <input
                      id="sc-org"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      required
                      className={errors.orgNumber ? 'is-invalid' : ''}
                      placeholder="55XXXXXX-XXXX"
                      maxLength={11}
                      value={form.orgNumber}
                      onChange={(e) => {
                        setForm({ ...form, orgNumber: formatOrgNumber(e.target.value, form.orgNumber) })
                        if (errors.orgNumber) setErrors({ ...errors, orgNumber: '' })
                      }}
                    />
                    {errors.orgNumber && <span className="form-error">{errors.orgNumber}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="sc-avtalstart">
                      Avtalsstart <span className="req">*</span>
                    </label>
                    <input
                      id="sc-avtalstart"
                      type="date"
                      required
                      className={errors.avtalStart ? 'is-invalid' : ''}
                      value={(form.avtalStart || '').slice(0, 10)}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          avtalStart: e.target.value ? new Date(e.target.value).toISOString() : ''
                        })
                        if (errors.avtalStart) setErrors({ ...errors, avtalStart: '' })
                      }}
                    />
                    {errors.avtalStart && <span className="form-error">{errors.avtalStart}</span>}
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="sc-delivery">
                      Leveransadress <span className="req">*</span>
                    </label>
                    <input
                      id="sc-delivery"
                      type="text"
                      required
                      className={errors.deliveryAddress ? 'is-invalid' : ''}
                      placeholder="Gatan 1, 123 45 Staden"
                      value={form.deliveryAddress}
                      onChange={(e) => {
                        setForm({ ...form, deliveryAddress: e.target.value })
                        if (errors.deliveryAddress) setErrors({ ...errors, deliveryAddress: '' })
                      }}
                    />
                    {errors.deliveryAddress && <span className="form-error">{errors.deliveryAddress}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="sc-invoice">
                      Fakturaadress <span className="req">*</span>
                    </label>
                    <input
                      id="sc-invoice"
                      type="text"
                      required
                      className={errors.invoiceAddress ? 'is-invalid' : ''}
                      placeholder="Gatan 1, 123 45 Staden"
                      value={form.invoiceAddress}
                      onChange={(e) => {
                        setForm({ ...form, invoiceAddress: e.target.value })
                        if (errors.invoiceAddress) setErrors({ ...errors, invoiceAddress: '' })
                      }}
                    />
                    {errors.invoiceAddress && <span className="form-error">{errors.invoiceAddress}</span>}
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
