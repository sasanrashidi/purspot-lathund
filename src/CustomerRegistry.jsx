import React, { useState, useEffect, useMemo } from 'react'
import { subscribeToCustomers, addCustomer, updateCustomer, deleteCustomer, customerFullName } from './customers'
import { devices as deviceCatalog, formatSEK } from './data'
import { resolveRules, MODE_LABELS } from './packageBuilder/rules'
import { groupSelection } from './packageBuilder/logic'

const rules = resolveRules('purspot')

function getDeviceMeta(id) {
  return deviceCatalog.find((d) => d.id === id) || { id, model: id }
}

function formatDate(iso) {
  if (!iso) return null
  try {
    return new Date(iso).toLocaleDateString('sv-SE')
  } catch {
    return iso
  }
}

function addMonths(iso, months) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  d.setMonth(d.getMonth() + months)
  return d.toISOString()
}

function statusClass(status) {
  return (
    'status-' +
    (status || 'Utkast')
      .toLowerCase()
      .replace(/[åä]/g, 'a')
      .replace(/ö/g, 'o')
      .replace(/\s+/g, '-')
  )
}

function contractLabel(contract) {
  return contract === 'buy' ? 'Direktköp' : '48 mån'
}

// Bryt ned ett paket: hårdvara (kassor/express/terminaler) respektive
// tillbehör & mjukvara – samt engångsköp.
function calculateBreakdown(packageData) {
  const res = { hwMonthly: 0, swMonthly: 0, buy: 0, groups: [], hasMonthly: false }
  if (!packageData || !packageData.selected || !Object.keys(packageData.selected).length) return res
  const groups = groupSelection(rules, packageData.selected)
  for (const g of groups) {
    const isHardware = g.role === 'main' || g.role === 'express' || g.role === 'terminal'
    for (const it of g.items) {
      const meta = getDeviceMeta(it.id)
      const qty = packageData.quantities?.[it.id] || 1
      const contract = packageData.contracts?.[it.id] || (meta.monthly48 ? '48' : 'buy')
      if (contract === 'buy') {
        res.buy += (meta.buyPrice || 0) * qty
      } else {
        res.hasMonthly = true
        if (isHardware) res.hwMonthly += (meta.monthly48 || 0) * qty
        else res.swMonthly += (meta.monthly48 || 0) * qty
      }
    }
  }
  res.groups = groups.map((g) => ({
    ...g,
    title: g.role === 'accessory' ? 'Tillbehör & Mjukvara' : g.title
  }))
  return res
}

function calculateTotals(packageData) {
  const bd = calculateBreakdown(packageData)
  return { buy: bd.buy, monthly: bd.hwMonthly + bd.swMonthly }
}

function formatTotalsStr(totals) {
  if (totals.buy > 0 && totals.monthly > 0)
    return `${formatSEK(totals.buy)} + ${formatSEK(totals.monthly)}/mån`
  if (totals.buy > 0) return formatSEK(totals.buy)
  if (totals.monthly > 0) return `${formatSEK(totals.monthly)}/mån`
  return '–'
}

// -------------------------------------------------------------
// Exportera PDF – öppnar ett print-vänligt fönster med kundens
// uppgifter, paket och totalsummor.
// -------------------------------------------------------------
function exportCustomerPdf(customer) {
  const bd = calculateBreakdown(customer.packageData)
  const name = customer.company || customerFullName(customer) || 'Kund'
  const totalMonthly = bd.hwMonthly + bd.swMonthly
  const packageHtml = bd.groups.length
    ? bd.groups
        .map(
          (g) => `
        <h3>${g.title}</h3>
        <table>
          <tbody>
            ${g.items
              .map((it) => {
                const meta = getDeviceMeta(it.id)
                const qty = customer.packageData?.quantities?.[it.id] || 1
                const contract = customer.packageData?.contracts?.[it.id] || (meta.monthly48 ? '48' : 'buy')
                const price =
                  contract === 'buy'
                    ? formatSEK((meta.buyPrice || 0) * qty)
                    : `${formatSEK((meta.monthly48 || 0) * qty)}/mån`
                return `<tr><td>${qty}× ${meta.model || meta.id}</td><td class="muted">${contractLabel(contract)}</td><td class="num">${price}</td></tr>`
              })
              .join('')}
          </tbody>
        </table>`
        )
        .join('')
    : '<p class="muted">Inget paket sparat ännu.</p>'

  const html = `<!doctype html><html lang="sv"><head><meta charset="utf-8"><title>Kundkort – ${name}</title>
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0f172a;margin:40px;max-width:720px}
    h1{font-size:22px;margin:0 0 4px}h2{font-size:15px;margin:28px 0 8px}h3{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#6b7280;margin:20px 0 6px}
    table{width:100%;border-collapse:collapse;font-size:13px}td{padding:7px 0;border-bottom:1px solid #e5e7eb}
    .muted{color:#6b7280}.num{text-align:right;font-weight:600}.meta{font-size:13px;color:#475569;line-height:1.7}
    .summary{margin-top:24px;border:1px solid #e5e7eb;border-radius:12px;padding:14px 16px}
    .summary .row{display:flex;justify-content:space-between;padding:4px 0;font-size:14px}
    .summary .total{font-weight:700;border-top:1px solid #e5e7eb;margin-top:6px;padding-top:8px}
    footer{margin-top:36px;font-size:11px;color:#94a3b8}
  </style></head><body>
  <h1>${name}</h1>
  <div class="meta">
    ${customer.company && customerFullName(customer) ? `Kontakt: ${customerFullName(customer)}<br>` : ''}
    ${customer.phone ? `Telefon: ${customer.phone}<br>` : ''}
    ${customer.email ? `E-post: ${customer.email}<br>` : ''}
    ${customer.orgNumber ? `Org.nr: ${customer.orgNumber}<br>` : ''}
    Status: ${customer.status || 'Utkast'}
  </div>
  <h2>Paket</h2>
  ${packageHtml}
  <div class="summary">
    <div class="row"><span>Hårdvara /mån</span><span class="num">${formatSEK(bd.hwMonthly)}/mån</span></div>
    <div class="row"><span>Mjukvara & tillbehör /mån</span><span class="num">${formatSEK(bd.swMonthly)}/mån</span></div>
    ${bd.buy > 0 ? `<div class="row"><span>Engångsköp</span><span class="num">${formatSEK(bd.buy)}</span></div>` : ''}
    <div class="row total"><span>Totalt avtalsvärde /mån</span><span class="num">${formatSEK(totalMonthly)}/mån</span></div>
  </div>
  <footer>Genererad ${new Date().toLocaleDateString('sv-SE')} · Purspot Kundregister</footer>
  </body></html>`

  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(html)
  w.document.close()
  w.focus()
  window.setTimeout(() => w.print(), 400)
}

function customerFirstNameRow(customer) {
  return customer.company ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim().replace(/^$/, '').concat(customer.firstName || customer.lastName ? `<br>` : '') : ''
}

const EMPTY_CUSTOMER = {
  company: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  orgNumber: '',
  deliveryAddress: '',
  invoiceAddress: '',
  avtalStart: '',
  status: 'Utkast'
}

// -------------------------------------------------------------
// Ikoner (stroke = currentColor)
// -------------------------------------------------------------
const svgBase = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.8',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true'
}

const Icons = {
  building: (
    <svg {...svgBase}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
    </svg>
  ),
  user: (
    <svg {...svgBase}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  phone: (
    <svg {...svgBase}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  mail: (
    <svg {...svgBase}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  ),
  hash: (
    <svg {...svgBase}>
      <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
    </svg>
  ),
  calendar: (
    <svg {...svgBase}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  pin: (
    <svg {...svgBase}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  package: (
    <svg {...svgBase}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </svg>
  ),
  pdf: (
    <svg {...svgBase}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M9 15h6" />
    </svg>
  ),
  trash: (
    <svg {...svgBase}>
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    </svg>
  ),
  edit: (
    <svg {...svgBase}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
    </svg>
  ),
  users: (
    <svg {...svgBase}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  krona: (
    <svg {...svgBase}>
      <path d="M18 7c0-2.2-2.7-4-6-4s-6 1.8-6 4 2.7 4 6 4 6 1.8 6 4-2.7 4-6 4-6-1.8-6-4M8 3l4 8 4-8M8 21l4-8 4 8" />
    </svg>
  ),
  check: (
    <svg {...svgBase}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4 12 14.01l-3-3" />
    </svg>
  ),
  pencil: (
    <svg {...svgBase}>
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  )
}

export default function CustomerRegistry({ onOpenInPackageBuilder }) {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [chip, setChip] = useState('alla')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)

  useEffect(() => {
    const unsub = subscribeToCustomers((next) => {
      setCustomers(next)
      setSelectedCustomer((prev) => (prev ? next.find((c) => c.id === prev.id) || null : null))
    })
    return unsub
  }, [])

  const kpis = useMemo(() => {
    let mrr = 0
    let active = 0
    let drafts = 0
    for (const c of customers) {
      const bd = calculateBreakdown(c.packageData)
      mrr += bd.hwMonthly + bd.swMonthly
      const status = (c.status || 'Utkast').toLowerCase()
      if (status === 'utkast') drafts += 1
      else if (status !== 'arkiverad') active += 1
    }
    return { total: customers.length, mrr, active, drafts }
  }, [customers])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return customers.filter((c) => {
      const status = (c.status || 'Utkast').toLowerCase()
      if (chip === 'aktiv' && (status === 'utkast' || status === 'arkiverad')) return false
      if (chip === 'utskast' && status !== 'utkast') return false
      if (!q) return true
      return (
        (c.company || '').toLowerCase().includes(q) ||
        customerFullName(c).toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.orgNumber || '').toLowerCase().includes(q)
      )
    })
  }, [customers, search, chip])

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

      <div className="cust-kpis">
        <div className="kpi-card">
          <div className="kpi-icon">{Icons.users}</div>
          <div className="kpi-text">
            <span className="kpi-label">Totalt antal kunder</span>
            <span className="kpi-value">{kpis.total}</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">{Icons.krona}</div>
          <div className="kpi-text">
            <span className="kpi-label">Totalt månadsvärde</span>
            <span className="kpi-value">
              {formatSEK(kpis.mrr)}<span className="kpi-suffix">/mån</span>
            </span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon is-green">{Icons.check}</div>
          <div className="kpi-text">
            <span className="kpi-label">Aktiva avtal</span>
            <span className="kpi-value">{kpis.active}</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon is-amber">{Icons.pencil}</div>
          <div className="kpi-text">
            <span className="kpi-label">Utkast</span>
            <span className="kpi-value">{kpis.drafts}</span>
          </div>
        </div>
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

      <div className="cust-chips" role="tablist" aria-label="Filter">
        {[
          { id: 'alla', label: 'Alla' },
          { id: 'aktiv', label: 'Aktiva' },
          { id: 'utskast', label: 'Utkast' }
        ].map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={chip === c.id}
            className={`cust-chip ${chip === c.id ? 'is-active' : ''}`}
            onClick={() => setChip(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="customer-list">
          <div className="customer-empty">
            <div className="customer-empty-icon">{Icons.users}</div>
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
                      <strong>{customer.company || customerFullName(customer) || '–'}</strong>
                      {customer.company && customerFullName(customer) && (
                        <div className="small-text">{customerFullName(customer)}</div>
                      )}
                    </td>
                    <td>
                      <div>{customerFullName(customer) || '–'}</div>
                      {customer.phone && <div className="small-text">{customer.phone}</div>}
                      {customer.email && <div className="small-text">{customer.email}</div>}
                    </td>
                    <td>
                      <div>{formatDate(customer.createdAt) || '–'}</div>
                      <div className="small-text">{formatDate(customer.updatedAt) || '–'}</div>
                    </td>
                    <td className="cust-cell-total">{formatTotalsStr(totals)}</td>
                    <td>
                      <span className={`status-badge ${statusClass(customer.status)}`}>
                        {customer.status || 'Utkast'}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="btn-secondary cust-btn-sm"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        Visa
                      </button>
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
        <CustomerDrawer
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onOpenInPackageBuilder={onOpenInPackageBuilder}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

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
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="cust-org">Organisationsnummer</label>
                    <input
                      id="cust-org"
                      type="text"
                      placeholder="55XXXXXX-XXXX"
                      value={editingCustomer?.orgNumber || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, orgNumber: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cust-avtalstart">Avtalsstart</label>
                    <input
                      id="cust-avtalstart"
                      type="date"
                      value={(editingCustomer?.avtalStart || '').slice(0, 10)}
                      onChange={(e) =>
                        setEditingCustomer({
                          ...editingCustomer,
                          avtalStart: e.target.value ? new Date(e.target.value).toISOString() : ''
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="cust-delivery">Leveransadress</label>
                  <input
                    id="cust-delivery"
                    type="text"
                    placeholder="Gatan 1, 123 45 Staden"
                    value={editingCustomer?.deliveryAddress || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, deliveryAddress: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cust-invoice">Fakturaadress</label>
                  <input
                    id="cust-invoice"
                    type="text"
                    placeholder="Gatan 1, 123 45 Staden (lämna tomt för samma som leverans)"
                    value={editingCustomer?.invoiceAddress || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, invoiceAddress: e.target.value })}
                  />
                </div>

                {editingCustomer?.id &&
                  editingCustomer.packageData?.selected &&
                  Object.keys(editingCustomer.packageData.selected).length > 0 && (
                    <div className="cust-serials">
                      <span className="cust-serials-label">Serienummer / Enhets-ID</span>
                      {groupSelection(rules, editingCustomer.packageData.selected).flatMap((g) =>
                        g.items.map((it) => {
                          const meta = getDeviceMeta(it.id)
                          return (
                            <div className="form-group" key={it.id}>
                              <label htmlFor={`serial-${it.id}`}>{meta.model || meta.id}</label>
                              <input
                                id={`serial-${it.id}`}
                                type="text"
                                placeholder="Serienummer / Enhets-ID"
                                value={editingCustomer.packageData.serials?.[it.id] || ''}
                                onChange={(e) =>
                                  setEditingCustomer({
                                    ...editingCustomer,
                                    packageData: {
                                      ...editingCustomer.packageData,
                                      serials: {
                                        ...(editingCustomer.packageData.serials || {}),
                                        [it.id]: e.target.value
                                      }
                                    }
                                  })
                                }
                              />
                            </div>
                          )
                        })
                      )}
                    </div>
                  )}

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

// -------------------------------------------------------------
// Slide-over drawer med kundens detaljer
// -------------------------------------------------------------
function CustomerDrawer({ customer, onClose, onOpenInPackageBuilder, onEdit, onDelete }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const bd = calculateBreakdown(customer.packageData)
  const totalMonthly = bd.hwMonthly + bd.swMonthly
  const startIso = customer.avtalStart || customer.createdAt
  const endIso = bd.hasMonthly ? addMonths(startIso, 48) : null
  const fullName = customerFullName(customer)

  return (
    <div className="cust-drawer-backdrop" onClick={onClose}>
      <aside
        className="cust-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={'Kunddetaljer – ' + (customer.company || fullName || '')}
      >
        <header className="cust-drawer-head">
          <div className="cust-drawer-title">
            <h2>{customer.company || fullName || 'Kund'}</h2>
            <div className="cust-drawer-sub">
              <span className={`status-badge ${statusClass(customer.status)}`}>
                {customer.status || 'Utkast'}
              </span>
              <span className="cust-drawer-since">Kund sedan {formatDate(customer.createdAt) || '–'}</span>
            </div>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Stäng">
            ✕
          </button>
        </header>

        <div className="cust-drawer-body">
          <div className="cust-drawer-actions">
            <button type="button" className="btn-secondary cust-drawer-action" onClick={() => onEdit(customer)}>
              {Icons.edit}
              Redigera
            </button>
            <button
              type="button"
              className="btn-secondary cust-drawer-action"
              onClick={() => exportCustomerPdf(customer)}
            >
              {Icons.pdf}
              Exportera PDF
            </button>
            <button
              type="button"
              className="btn-danger cust-drawer-action"
              onClick={() => onDelete(customer.id)}
            >
              {Icons.trash}
              Radera kund
            </button>
          </div>

          <section className="cust-card">
            <h3 className="cust-card-title">Kunduppgifter</h3>
            <div className="cust-info-grid">
              <InfoItem icon={Icons.building} label="Företag" value={customer.company} />
              <InfoItem icon={Icons.user} label="Kontakt" value={fullName} />
              <InfoItem icon={Icons.phone} label="Telefon" value={customer.phone} />
              <InfoItem icon={Icons.mail} label="E-post" value={customer.email} />
              <InfoItem icon={Icons.hash} label="Organisationsnummer" value={customer.orgNumber} />
              <InfoItem
                icon={Icons.calendar}
                label="Avtalsstart"
                value={bd.hasMonthly || customer.avtalStart ? formatDate(startIso) : null}
              />
              <InfoItem
                icon={Icons.calendar}
                label="Avtalsslut"
                value={endIso ? formatDate(endIso) : null}
                placeholder="Beräknas vid sparat paket"
              />
              <InfoItem icon={Icons.pin} label="Leveransadress" value={customer.deliveryAddress} full />
              <InfoItem icon={Icons.pin} label="Fakturaadress" value={customer.invoiceAddress} full placeholder="Samma som leveransadress" />
            </div>
          </section>

          <section className="cust-card">
            <h3 className="cust-card-title">Paketinnehåll</h3>
            {bd.groups.length === 0 ? (
              <p className="small-text">Inget paket sparat ännu.</p>
            ) : (
              bd.groups.map((group) => (
                <div key={group.role} className="cust-prod-section">
                  <h4 className="cust-prod-heading">{group.title}</h4>
                  {group.items.map((it) => {
                    const meta = getDeviceMeta(it.id)
                    const qty = customer.packageData?.quantities?.[it.id] || 1
                    const contract = customer.packageData?.contracts?.[it.id] || (meta.monthly48 ? '48' : 'buy')
                    const mode = group.role === 'terminal' ? MODE_LABELS[it.mode] : null
                    const serial = customer.packageData?.serials?.[it.id]
                    const price =
                      contract === 'buy'
                        ? formatSEK((meta.buyPrice || 0) * qty)
                        : `${formatSEK((meta.monthly48 || 0) * qty)}/mån`
                    return (
                      <div key={it.id} className="cust-prod-card">
                        <div className="cust-prod-main">
                          <div className="cust-prod-name">{meta.model || meta.id}</div>
                          <div className="cust-prod-badges">
                            <span className="cust-qty-badge">{qty}×</span>
                            <span className="cust-term-badge">{contractLabel(contract)}</span>
                            {mode && <span className="cust-mode-badge">Läge {mode.badge}</span>}
                          </div>
                          {serial && <div className="cust-prod-serial">S/N: {serial}</div>}
                        </div>
                        <div className={`cust-prod-price ${contract === 'buy' ? 'is-buy' : ''}`}>{price}</div>
                      </div>
                    )
                  })}
                </div>
              ))
            )}

            {bd.groups.length > 0 && (
              <div className="cust-summary">
                <div className="cust-summary-row">
                  <span>Totalt Hårdvara</span>
                  <strong>{formatSEK(bd.hwMonthly)}/mån</strong>
                </div>
                <div className="cust-summary-row">
                  <span>Totalt Mjukvara & Tillbehör</span>
                  <strong>{formatSEK(bd.swMonthly)}/mån</strong>
                </div>
                {bd.buy > 0 && (
                  <div className="cust-summary-row">
                    <span>Engångsköp</span>
                    <strong>{formatSEK(bd.buy)}</strong>
                  </div>
                )}
                <div className="cust-summary-row is-total">
                  <span>Totalt avtalsvärde</span>
                  <strong>{formatSEK(totalMonthly)}/mån</strong>
                </div>
              </div>
            )}
          </section>
        </div>

        <footer className="cust-drawer-foot">
          {onOpenInPackageBuilder ? (
            <button
              type="button"
              className="btn-primary cust-drawer-primary"
              onClick={() => onOpenInPackageBuilder(customer)}
            >
              Redigera i Paketbyggaren
            </button>
          ) : (
            <button type="button" className="btn-ghost cust-drawer-primary" onClick={onClose}>
              Stäng
            </button>
          )}
        </footer>
      </aside>
    </div>
  )
}

function InfoItem({ icon, label, value, placeholder = 'Ej ifyllt', full = false }) {
  return (
    <div className={`cust-info-item ${full ? 'is-full' : ''}`}>
      <span className="cust-info-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="cust-info-text">
        <span className="cust-info-label">{label}</span>
        <span className={`cust-info-value ${value ? '' : 'is-empty'}`}>{value || placeholder}</span>
      </span>
    </div>
  )
}
