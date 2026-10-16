import React, { useState, useEffect } from 'react'
import { subscribeToCustomers, addCustomer, updateCustomer, deleteCustomer, customerFullName } from './customers'
import { devices as deviceCatalog, formatSEK } from './data'
import { resolveRules } from './packageBuilder/rules'
import { groupSelection } from './packageBuilder/logic'

const rules = resolveRules('purspot')

function getDeviceMeta(id) {
  return deviceCatalog.find((d) => d.id === id) || { id, model: id }
}

function formatDate(iso) {
  if (!iso) return '-'
  try {
    return new Date(iso).toLocaleDateString('sv-SE')
  } catch {
    return iso
  }
}

function calculateTotals(packageData) {
  if (!packageData) return { buy: 0, monthly: 0 }
  const groups = groupSelection(rules, packageData.selected || {})
  const totals = { buy: 0, monthly: 0 }
  for (const g of groups) {
    for (const it of g.items) {
      const meta = getDeviceMeta(it.id)
      const qty = packageData.quantities?.[it.id] || 1
      const contract = packageData.contracts?.[it.id] || (meta.monthly48 ? '48' : 'buy')
      if (contract === 'buy') totals.buy += (meta.buyPrice || 0) * qty
      else totals.monthly += (meta.monthly48 || 0) * qty
    }
  }
  return totals
}

function formatTotalsStr(totals) {
  if (totals.buy > 0 && totals.monthly > 0)
    return `${formatSEK(totals.buy)} + ${formatSEK(totals.monthly)}/mån`
  if (totals.buy > 0) return formatSEK(totals.buy)
  if (totals.monthly > 0) return `${formatSEK(totals.monthly)}/mån`
  return '-'
}

const EMPTY_CUSTOMER = {
  company: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  status: 'Utkast'
}

export default function CustomerRegistry({ onOpenInPackageBuilder }) {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (showModal) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [showModal])
  const [editingCustomer, setEditingCustomer] = useState(null)

  useEffect(() => {
    const unsub = subscribeToCustomers((next) => {
      setCustomers(next)
      setSelectedCustomer((prev) => (prev ? next.find((c) => c.id === prev.id) || null : null))
    })
    return unsub
  }, [])

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase()
    return (
      (c.company || '').toLowerCase().includes(q) ||
      customerFullName(c).toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q)
    )
  })

  const handleCreateNew = () => {
    setEditingCustomer({ ...EMPTY_CUSTOMER })
    setShowModal(true)
  }

  const handleEdit = (customer) => {
    setEditingCustomer({ ...customer })
    setShowModal(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (editingCustomer?.id) {
      const updated = updateCustomer(editingCustomer.id, editingCustomer)
      if (updated) setSelectedCustomer(updated)
    } else {
      const created = addCustomer(editingCustomer)
      setSelectedCustomer(created)
    }
    setShowModal(false)
    setEditingCustomer(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('Är du säker på att du vill ta bort kunden?')) {
      deleteCustomer(id)
      if (selectedCustomer?.id === id) setSelectedCustomer(null)
    }
  }

  return (
    <section className="customer-registry">
      <div className="section-header">
        <h1 className="section-title">Kundregister</h1>
        <p className="section-sub">Sök, skapa och hantera kunder – kopplade till Paketbyggaren</p>
      </div>

      <div className="customer-controls">
        <div className="customer-search-wrap">
          <svg
            className="customer-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="customer-search"
            placeholder="Sök på namn, telefon, e-post eller företag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Sök kund"
          />
        </div>
        <button type="button" className="btn-primary customer-create-btn" onClick={handleCreateNew}>
          <svg
            className="customer-create-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Skapa ny kund
        </button>
      </div>

      <div className="customer-layout">
        {filtered.length === 0 ? (
          <div className="customer-list">
            <div className="customer-empty">
              <div className="customer-empty-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3>{customers.length === 0 ? 'Inga kunder ännu' : 'Inga kunder hittades'}</h3>
              <p>
                {customers.length === 0
                  ? 'Skapa din första kund för att komma igång.'
                  : 'Prova att justera din sökning eller skapa en ny kund.'}
              </p>
              <button type="button" className="btn-primary" onClick={handleCreateNew}>
                + Skapa ny kund
              </button>
            </div>
          </div>
        ) : (
          <div className="customer-list">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Företag / Kund</th>
                  <th>Kontakt</th>
                  <th>Skapad / Uppdaterad</th>
                  <th>Total kostnad</th>
                  <th>Status</th>
                  <th>Åtgärder</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => {
                  const totals = calculateTotals(customer.packageData)
                  return (
                    <tr
                      key={customer.id}
                      className={selectedCustomer?.id === customer.id ? 'is-selected' : ''}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <td>
                        <strong>{customer.company || customerFullName(customer) || '-'}</strong>
                        {customer.company && customerFullName(customer) && (
                          <div className="small-text">{customerFullName(customer)}</div>
                        )}
                      </td>
                      <td>
                        <div>{customerFullName(customer) || '-'}</div>
                        {customer.phone && <div className="small-text">{customer.phone}</div>}
                        {customer.email && <div className="small-text">{customer.email}</div>}
                      </td>
                      <td>
                        <div>{formatDate(customer.createdAt)}</div>
                        <div className="small-text">{formatDate(customer.updatedAt)}</div>
                      </td>
                      <td>{formatTotalsStr(totals)}</td>
                      <td>
                        <span className={`status-badge status-${(customer.status || 'Utkast').toLowerCase().replace(/\s+/g, '-')}`}>
                          {customer.status || 'Utkast'}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="btn-secondary cust-btn-sm" onClick={() => handleEdit(customer)}>
                          Redigera
                        </button>
                        <button type="button" className="btn-danger cust-btn-sm" onClick={() => handleDelete(customer.id)}>
                          Ta bort
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {selectedCustomer && (
          <aside className="customer-detail">
            <h2>Kunddetaljer</h2>

            <div className="detail-section">
              <h3>Kontaktuppgifter</h3>
              <p><strong>Företag:</strong> {selectedCustomer.company || '-'}</p>
              <p><strong>Förnamn:</strong> {selectedCustomer.firstName || '-'}</p>
              <p><strong>Efternamn:</strong> {selectedCustomer.lastName || '-'}</p>
              <p><strong>Telefon:</strong> {selectedCustomer.phone || '-'}</p>
              <p><strong>E-post:</strong> {selectedCustomer.email || '-'}</p>
            </div>

            <div className="detail-section">
              <h3>Paket</h3>
              <CustomerPackage packageData={selectedCustomer.packageData} />
              {onOpenInPackageBuilder && (
                <button
                  type="button"
                  className="btn-primary detail-open-btn"
                  onClick={() => onOpenInPackageBuilder(selectedCustomer)}
                >
                  Öppna i Paketbyggare
                </button>
              )}
            </div>

            <div className="detail-section">
              <button type="button" className="btn-ghost" onClick={() => setSelectedCustomer(null)}>
                Stäng detaljvy
              </button>
            </div>
          </aside>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-panel cust-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button type="button" className="modal-close" onClick={() => setShowModal(false)} aria-label="Stäng">✕</button>
            <div className="cust-modal-body">
              <h2 className="modal-title">{editingCustomer?.id ? 'Redigera kund' : 'Skapa ny kund'}</h2>
              <form className="cust-form" onSubmit={handleSave}>
                <div className="form-group">
                  <label htmlFor="cust-company">Företag</label>
                  <input
                    id="cust-company"
                    type="text"
                    placeholder="Företagsnamn"
                    value={editingCustomer?.company || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, company: e.target.value })}
                  />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="cust-firstname">Förnamn</label>
                    <input
                      id="cust-firstname"
                      type="text"
                      autoComplete="given-name"
                      placeholder="Förnamn"
                      value={editingCustomer?.firstName || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, firstName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cust-lastname">Efternamn</label>
                    <input
                      id="cust-lastname"
                      type="text"
                      autoComplete="family-name"
                      placeholder="Efternamn"
                      value={editingCustomer?.lastName || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="cust-phone">Telefon</label>
                    <input
                      id="cust-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="07X XXX XX XX"
                      value={editingCustomer?.phone || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cust-email">E-post</label>
                    <input
                      id="cust-email"
                      type="email"
                      autoComplete="email"
                      placeholder="namn@foretag.se"
                      value={editingCustomer?.email || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>
                    Avbryt
                  </button>
                  <button type="submit" className="btn-primary">
                    Spara
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

function CustomerPackage({ packageData }) {
  if (!packageData || !packageData.selected || Object.keys(packageData.selected).length === 0) {
    return <p className="small-text">Inget paket sparat ännu.</p>
  }

  const groups = groupSelection(rules, packageData.selected)
  const totals = { buy: 0, monthly: 0 }

  return (
    <div className="customer-package">
      {groups.map((group) => (
        <div key={group.role} className="customer-package-group">
          <h4>{group.title}</h4>
          <ul>
            {group.items.map((it) => {
              const meta = getDeviceMeta(it.id)
              const qty = packageData.quantities?.[it.id] || 1
              const contract = packageData.contracts?.[it.id] || (meta.monthly48 ? '48' : 'buy')
              if (contract === 'buy') totals.buy += (meta.buyPrice || 0) * qty
              else totals.monthly += (meta.monthly48 || 0) * qty
              return (
                <li key={it.id}>
                  {qty}× {meta.model || meta.id} ({contract === 'buy' ? 'Direktköp' : '48 mån'}) —{' '}
                  {contract === 'buy'
                    ? formatSEK((meta.buyPrice || 0) * qty)
                    : `${formatSEK((meta.monthly48 || 0) * qty)}/mån`}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
      <div className="customer-package-totals">
        <strong>Totalt: {formatTotalsStr(totals)}</strong>
      </div>
    </div>
  )
}
