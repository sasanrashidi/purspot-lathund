import React, { useState, useEffect } from 'react'
import { categories, devices, softposSteps, softposFeatures } from './data'

const g = {
  body: '#2a5142',
  stroke: '#96dac1',
  screen: '#69cba7',
  dark: '#1f3c32'
}

function DeviceIcon({ category }) {
  if (category === 'Expresskassa') {
    return (
      <svg viewBox="0 0 140 140" width="140" height="140">
        <rect x="35" y="10" width="70" height="100" rx="6" fill={g.body} stroke={g.stroke} strokeWidth="1.5" />
        <rect x="40" y="16" width="60" height="60" rx="3" fill={g.screen} opacity="0.25" />
        <circle cx="70" cy="88" r="3" fill={g.screen} />
        <rect x="55" y="110" width="30" height="6" rx="3" fill={g.screen} />
        <rect x="50" y="116" width="40" height="4" rx="2" fill={g.dark} />
        <rect x="60" y="120" width="20" height="8" rx="2" fill={g.body} />
      </svg>
    )
  }
  if (category === 'Kassasystem') {
    return (
      <svg viewBox="0 0 140 140" width="140" height="140">
        <rect x="15" y="18" width="95" height="62" rx="5" fill={g.body} stroke={g.stroke} strokeWidth="1.5" />
        <rect x="20" y="23" width="85" height="42" rx="3" fill={g.screen} opacity="0.25" />
        <rect x="40" y="80" width="40" height="8" rx="2" fill={g.screen} />
        <rect x="20" y="92" width="100" height="6" rx="3" fill={g.dark} stroke={g.body} strokeWidth="1" />
        <rect x="105" y="94" width="30" height="24" rx="3" fill={g.body} stroke={g.stroke} strokeWidth="1" />
        <rect x="108" y="97" width="24" height="4" rx="1" fill="#ffffff" opacity="0.35" />
        <rect x="108" y="104" width="24" height="4" rx="1" fill="#ffffff" opacity="0.22" />
        <rect x="108" y="111" width="24" height="3" rx="1" fill="#ffffff" opacity="0.16" />
      </svg>
    )
  }
  if (category === 'Tillbehör') {
    return (
      <svg viewBox="0 0 140 140" width="140" height="140">
        <rect x="20" y="30" width="70" height="55" rx="6" fill={g.body} stroke={g.stroke} strokeWidth="1.5" />
        <rect x="24" y="34" width="62" height="28" rx="3" fill={g.screen} opacity="0.25" />
        <rect x="30" y="66" width="50" height="8" rx="2" fill={g.screen} />
        <rect x="92" y="55" width="26" height="18" rx="3" fill={g.screen} />
        <rect x="20" y="88" width="100" height="4" rx="2" fill={g.stroke} opacity="0.6" />
        <rect x="20" y="95" width="100" height="4" rx="2" fill={g.screen} opacity="0.6" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 140 140" width="140" height="140">
      <rect x="42" y="12" width="56" height="108" rx="8" fill={g.body} stroke={g.stroke} strokeWidth="1.5" />
      <rect x="47" y="18" width="46" height="68" rx="4" fill={g.screen} opacity="0.25" />
      <rect x="48" y="94" width="20" height="10" rx="2" fill={g.dark} />
      <rect x="72" y="94" width="20" height="10" rx="2" fill={g.dark} />
      <rect x="48" y="108" width="44" height="8" rx="2" fill={g.dark} />
      <rect x="60" y="8" width="20" height="3" rx="1.5" fill={g.screen} />
      <circle cx="70" cy="125" r="4" fill={g.dark} stroke={g.screen} strokeWidth="1" />
    </svg>
  )
}

function SpecRow({ label, value }) {
  if (!value || value === '-') return null
  return (
    <div className="spec-row">
      <span className="spec-label">{label}</span>
      <span className="spec-value">{value}</span>
    </div>
  )
}

function DeviceCard({ device, onZoom, onInfo }) {
  const [imgFailed, setImgFailed] = useState(false)
  return (
    <div className="device-card">
      <div
        className="card-icon-wrap"
        onClick={() => onZoom(device)}
        role="button"
        tabIndex="0"
        aria-label={`Förstora bild för ${device.model}`}
      >
        {device.imageUrl && !imgFailed ? (
          <img
            src={device.imageUrl}
            alt={device.model}
            className="device-photo"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <DeviceIcon category={device.category} />
        )}
        {device.imageUrl && !imgFailed && <span className="zoom-hint">🔍 Förstora</span>}
      </div>
      <div className="card-body">
        <div className="card-category-badge">{device.category}</div>
        <h3 className="card-model">{device.model}</h3>
        <p className="card-formfactor">{device.formFactor}</p>
        <ul className="card-specs">
          <li><span className="spec-label">Skärm</span><span className="spec-value">{device.specs.screen}</span></li>
          <li><span className="spec-label">Skrivare</span><span className="spec-value">{device.specs.printer}</span></li>
          <li><span className="spec-label">Kort / NFC</span><span className="spec-value">{device.specs.card}</span></li>
          <li><span className="spec-label">Nätverk</span><span className="spec-value">{device.specs.network}</span></li>
        </ul>
        <button className="card-link" onClick={() => onInfo(device)}>
          Mer information
        </button>
      </div>
    </div>
  )
}

function HardwareTab({ filter, setFilter, onZoom, onInfo }) {
  const filtered = filter === 'Alla'
    ? devices
    : devices.filter(d => d.category === filter)

  return (
    <section>
      <h1 className="section-title">Hårdvarukatalog</h1>
      <p className="section-sub">Alla enheter och tillbehör från Purspot.</p>

      <div className="filter-bar">
        {categories.map(c => (
          <button
            key={c}
            className={`filter-btn ${filter === c ? 'active' : ''}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>Inga enheter i denna kategori ännu.</p>
        </div>
      ) : (
        <div className="device-grid">
          {filtered.map(d => (
            <DeviceCard key={d.id} device={d} onZoom={onZoom} onInfo={onInfo} />
          ))}
        </div>
      )}
    </section>
  )
}

function InfoModal({ device, onClose }) {
  useEffect(() => {
    if (!device) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [device, onClose])

  if (!device) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Stäng">✕</button>
        {device.imageUrl && (
          <div className="modal-media">
            <img src={device.imageUrl} alt={device.model} />
          </div>
        )}
        <div className="modal-content">
          <span className="card-category-badge">{device.category}</span>
          <h2 className="modal-title">{device.model}</h2>
          <p className="modal-formfactor">{device.formFactor}</p>

          {device.purspot && (
            <div className="modal-purspot">
              <div className="modal-label">💚 Purspot</div>
              <p>{device.purspot}</p>
              {device.sourceUrl && (
                <a className="modal-link" href={device.sourceUrl} target="_blank" rel="noopener noreferrer">
                  Mer info på Purspot.com ↗
                </a>
              )}
            </div>
          )}

          {device.extra && (
            <div className="modal-note"><strong>Kort om enheten:</strong> {device.extra}</div>
          )}

          <div className="modal-specs">
            <div className="modal-label">Specifikationer</div>
            <SpecRow label="Skärm" value={device.specs.screen} />
            <SpecRow label="Skrivare" value={device.specs.printer} />
            <SpecRow label="Kort / NFC" value={device.specs.card} />
            <SpecRow label="Nätverk" value={device.specs.network} />
          </div>

          <div className="modal-actions">
            {device.manufacturerUrl && (
              <a className="btn-secondary" href={device.manufacturerUrl} target="_blank" rel="noopener noreferrer">
                Tillverkarens sida ↗
              </a>
            )}
            <button className="btn-primary" onClick={onClose}>Stäng</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ImageLightbox({ device, onClose }) {
  useEffect(() => {
    if (!device) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [device, onClose])

  if (!device) return null

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Stäng">✕</button>
      <img
        className="lightbox-img"
        src={device.imageUrl}
        alt={device.model}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="lightbox-caption" onClick={(e) => e.stopPropagation()}>
        {device.model}
      </div>
    </div>
  )
}

function PhoneMockup() {
  return (
    <div className="phone-mockup">
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="phone-header">Purspot SoftPOS</div>
          <div className="phone-amount">149,00 kr</div>
          <div className="phone-hint">Kunden håller kortet mot baksidan</div>
          <div className="phone-wave">〰️〰️〰️</div>
        </div>
      </div>
    </div>
  )
}

function SoftposTab() {
  return (
    <section className="softpos-section">
      <h1 className="section-title">Purspot SoftPOS</h1>
      <p className="section-sub">
        Förvandla en vanlig Android-smartphone till en godkänd kassa och kortterminal
        utan extern hårdvara.
      </p>

      <div className="softpos-intro-row">
        <div className="softpos-intro-text">
          <h2>Hur fungerar det?</h2>
          <p>
            Med Purspot SoftPOS kan du ta emot kortbetalningar direkt på en Android-mobil.
            Appen gör om din telefon till en PCI-godkänd betalterminal genom att använda
            NFC-chippet – ingen extra terminal behövs.
          </p>
          <div className="softpos-req-box">
            <h4>Krav</h4>
            <ul>
              <li>Android 9.1 eller högre</li>
              <li>Enhet med NFC</li>
              <li>Purspot SoftPOS-appen från Google Play</li>
            </ul>
          </div>
        </div>
        <PhoneMockup />
      </div>

      <h2 className="subsection-title">Flöde: Så fungerar en betalning</h2>
      <div className="flow-steps">
        {softposSteps.map((step, i) => (
          <React.Fragment key={step.num}>
            <div className="flow-step">
              <div className="flow-num">{step.num}</div>
              <div className="flow-icon">{step.icon}</div>
              <div className="flow-label">{step.label}</div>
            </div>
            {i < softposSteps.length - 1 && <div className="flow-arrow">→</div>}
          </React.Fragment>
        ))}
      </div>

      <h2 className="subsection-title">Funktioner</h2>
      <div className="features-grid">
        {softposFeatures.map(f => (
          <div key={f.title} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function BackofficeTab() {
  const mockArticles = [
    { name: 'SUNMI V2s skärmfilm', category: 'Tillbehör', price: '149', moms: '25' },
    { name: 'Kvittorull 58mm (10-pack)', category: 'Förbrukning', price: '89', moms: '25' },
    { name: 'Kvittorull 80mm (10-pack)', category: 'Förbrukning', price: '99', moms: '25' }
  ]

  return (
    <section>
      <div className="bo-header">
        <h1>Purspot Backoffice</h1>
        <p className="bo-sub">Artikel & Sortimenthantering</p>
        <div className="bo-badge">Kommer i nästa steg</div>
      </div>

      <div className="bo-toolbar">
        <input type="text" placeholder="Sök artikel..." className="bo-search" disabled />
        <button className="btn-primary" disabled>+ Lägg till artikel</button>
      </div>

      <div className="bo-table-wrap">
        <table className="bo-table">
          <thead>
            <tr>
              <th>Artikelnamn</th>
              <th>Kategori</th>
              <th>Pris inkl. moms</th>
              <th>Moms %</th>
              <th>Åtgärd</th>
            </tr>
          </thead>
          <tbody>
            {mockArticles.map((a, i) => (
              <tr key={i}>
                <td className="bo-cell-name">{a.name}</td>
                <td>{a.category}</td>
                <td>{a.price} kr</td>
                <td>{a.moms}%</td>
                <td className="bo-cell-actions">
                  <button className="btn-ghost" disabled>Redigera</button>
                  <button className="btn-ghost btn-danger" disabled>Ta bort</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="bo-note">
        Funktionalitet för artikelhantering implementeras i nästa steg.
      </p>
    </section>
  )
}

export default function App() {
  const [tab, setTab] = useState('hardware')
  const [filter, setFilter] = useState('Alla')
  const [zoomDevice, setZoomDevice] = useState(null)
  const [infoDevice, setInfoDevice] = useState(null)

  return (
    <div className="app">
      <nav className="topnav">
        <div className="nav-left">
          <span className="brand-mark">P</span>
          <span className="brand-text">Purspot Lathund</span>
        </div>
        <div className="nav-tabs">
          {[
            { id: 'hardware', icon: '📱', label: 'Hårdvara' },
            { id: 'softpos', icon: '💳', label: 'SoftPOS' },
            { id: 'backoffice', icon: '⚙️', label: 'Backoffice' }
          ].map(t => (
            <button
              key={t.id}
              className={`nav-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span className="tab-icon">{t.icon}</span>
              <span className="tab-label">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="content">
        {tab === 'hardware' && (
          <HardwareTab
            filter={filter}
            setFilter={setFilter}
            onZoom={setZoomDevice}
            onInfo={setInfoDevice}
          />
        )}
        {tab === 'softpos' && <SoftposTab />}
        {tab === 'backoffice' && <BackofficeTab />}
      </main>

      <footer className="footer">
        Purspot AB · Internt · Alla enheter är Android-baserade · {new Date().getFullYear()}
      </footer>

      <InfoModal device={infoDevice} onClose={() => setInfoDevice(null)} />
      <ImageLightbox device={zoomDevice} onClose={() => setZoomDevice(null)} />
    </div>
  )
}