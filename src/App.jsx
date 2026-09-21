import React, { useState, useEffect } from 'react'
import { categories, devices, floCategories, floDevices, brands, softposSteps, softposFeatures, formatSEK } from './data'
import PackageBuilder from './packageBuilder/PackageBuilder'

// =============================================================
// Tillstånds-persistens – sparar enkla värden i localStorage så
// att val och framsteg överlever siduppdateringar och navigation.
// =============================================================
const PERSIST_PREFIX = 'pu_'

function loadPersisted(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PERSIST_PREFIX + key)
    if (raw === null || raw === undefined) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function savePersisted(key, value) {
  try {
    window.localStorage.setItem(PERSIST_PREFIX + key, JSON.stringify(value))
  } catch {
    // localStorage otillgänglig – ignorera tyst
  }
}

function DeviceIcon({ category, palette }) {
  const g = palette || { body: '#2a5142', stroke: '#96dac1', screen: '#69cba7', dark: '#1f3c32' }

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
  if (category === 'Kassasystem' || category === 'Kassadator') {
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
  if (category === 'Kvittoskrivare' || category === 'Etikettskrivare') {
    return (
      <svg viewBox="0 0 140 140" width="140" height="140">
        <rect x="20" y="34" width="100" height="72" rx="6" fill={g.body} stroke={g.stroke} strokeWidth="1.5" />
        <rect x="28" y="42" width="84" height="22" rx="3" fill={g.screen} opacity="0.3" />
        <rect x="28" y="70" width="60" height="10" rx="2" fill={g.screen} />
        <circle cx="106" cy="80" r="14" fill={g.dark} stroke={g.screen} strokeWidth="1.5" />
        <circle cx="106" cy="80" r="6" fill={g.screen} opacity="0.8" />
        <rect x="88" y="96" width="36" height="4" rx="2" fill={g.screen} />
        <rect x="30" y="96" width="40" height="4" rx="2" fill={g.screen} opacity="0.6" />
        <rect x="30" y="103" width="30" height="3" rx="1.5" fill={g.stroke} opacity="0.5" />
      </svg>
    )
  }
  if (category === 'Streckkodsläsare') {
    return (
      <svg viewBox="0 0 140 140" width="140" height="140">
        <rect x="26" y="26" width="40" height="58" rx="5" fill={g.body} stroke={g.stroke} strokeWidth="1.5" />
        <rect x="31" y="31" width="30" height="22" rx="2" fill={g.screen} opacity="0.3" />
        <rect x="32" y="57" width="11" height="4" rx="1" fill={g.screen} />
        <rect x="46" y="57" width="11" height="4" rx="1" fill={g.screen} />
        <rect x="60" y="72" width="40" height="12" rx="4" fill={g.body} stroke={g.stroke} strokeWidth="1" />
        <rect x="98" y="70" width="14" height="28" rx="3" fill={g.dark} stroke={g.stroke} strokeWidth="1" />
        <circle cx="105" cy="98" r="5" fill={g.screen} />
        <line x1="44" y1="72" x2="70" y2="84" stroke={g.stroke} strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }
  if (category === 'Kassavåg') {
    return (
      <svg viewBox="0 0 140 140" width="140" height="140">
        <rect x="25" y="24" width="90" height="14" rx="4" fill={g.body} stroke={g.stroke} strokeWidth="1.5" />
        <rect x="20" y="34" width="100" height="10" rx="3" fill={g.dark} />
        <rect x="32" y="44" width="8" height="40" rx="2" fill={g.body} stroke={g.stroke} strokeWidth="1" />
        <rect x="100" y="44" width="8" height="40" rx="2" fill={g.body} stroke={g.stroke} strokeWidth="1" />
        <rect x="24" y="84" width="92" height="8" rx="3" fill={g.body} stroke={g.stroke} strokeWidth="1" />
        <rect x="62" y="30" width="20" height="4" rx="2" fill={g.screen} />
        <rect x="54" y="92" width="32" height="12" rx="2" fill={g.dark} />
        <rect x="60" y="96" width="20" height="4" rx="1" fill={g.screen} />
        <rect x="112" y="40" width="18" height="42" rx="3" fill={g.screen} />
        <rect x="115" y="44" width="12" height="30" rx="2" fill={g.dark} />
      </svg>
    )
  }
  if (category === 'Kassalåda') {
    return (
      <svg viewBox="0 0 140 140" width="140" height="140">
        <rect x="18" y="34" width="104" height="72" rx="8" fill={g.body} stroke={g.stroke} strokeWidth="1.5" />
        <rect x="18" y="34" width="104" height="14" rx="8" fill={g.dark} />
        <rect x="24" y="56" width="46" height="10" rx="3" fill={g.screen} />
        <rect x="74" y="56" width="42" height="10" rx="3" fill={g.screen} opacity="0.6" />
        <rect x="24" y="72" width="46" height="10" rx="3" fill={g.screen} />
        <rect x="74" y="72" width="42" height="10" rx="3" fill={g.screen} opacity="0.6" />
        <rect x="24" y="88" width="46" height="10" rx="3" fill={g.screen} />
        <rect x="74" y="88" width="42" height="10" rx="3" fill={g.screen} opacity="0.6" />
        <circle cx="66" cy="42" r="3.5" fill={g.screen} />
      </svg>
    )
  }
  if (category === 'Förbrukning') {
    return (
      <svg viewBox="0 0 140 140" width="140" height="140">
        <circle cx="52" cy="66" r="38" fill={g.body} stroke={g.stroke} strokeWidth="1.5" />
        <circle cx="52" cy="66" r="26" fill={g.dark} />
        <circle cx="52" cy="66" r="10" fill={g.screen} opacity="0.8" />
        <rect x="96" y="34" width="18" height="64" rx="9" fill={g.screen} />
        <rect x="100" y="26" width="10" height="80" rx="5" fill={g.dark} />
        <rect x="103" y="18" width="4" height="96" rx="2" fill={g.screen} opacity="0.6" />
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

function DeviceCard({ device, index, brand, onZoom, onInfo }) {
  const [imgFailed, setImgFailed] = useState(false)
  const meta = brands[brand]

  const specMeta = [
    { key: 'screen', label: 'Skärm', icon: '🖥️', value: device.specs.screen },
    { key: 'printer', label: 'Skrivare', icon: '🖨️', value: device.specs.printer },
    { key: 'card', label: 'Kort / NFC', icon: '💳', value: device.specs.card },
    { key: 'network', label: 'Nätverk', icon: '📶', value: device.specs.network }
  ].filter(s => s.value && s.value !== '-')

  const infoTag = device.purspot
    ? { emoji: brands.purspot.infoEmoji, title: 'Innehåller info från Purspot' }
    : device.flo
      ? { emoji: brands.flo.infoEmoji, title: 'Innehåller pris och info från shop.flopay.se' }
      : null

  const hasBothPrices = brand === 'purspot' && device.buyPrice && device.monthly48

  return (
    <div className="device-card" style={{ '--delay': `${index * 70}ms` }}>
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
          <DeviceIcon category={device.category} palette={meta.iconColors} />
        )}
        {device.imageUrl && !imgFailed && <span className="zoom-hint">🔍 Förstora</span>}
      </div>
      <div className="card-body">
        <div className="card-topline">
          <span className="card-category-badge">{device.category}</span>
          {infoTag && <span className="card-has-info" title={infoTag.title}>{infoTag.emoji}</span>}
        </div>
        <h3 className="card-model">{device.model}</h3>
        <p className="card-formfactor">{device.formFactor}</p>
        {brand === 'purspot' && device.buyPrice ? (
          hasBothPrices ? (
            <div className="card-price-pair">
              <div className="card-price-line">
                <span className="card-price-tag">Direktköp</span>
                <span className="card-price-main">{formatSEK(device.buyPrice)}</span>
              </div>
              <div className="card-price-line">
                <span className="card-price-tag">48 mån avtal</span>
                <span className="card-price-main">{device.monthly48.toLocaleString('sv-SE')} kr/mån</span>
              </div>
            </div>
          ) : (
            <div className="card-price-row">
              <span className="card-price">{formatSEK(device.buyPrice)}</span>
            </div>
          )
        ) : (
          device.price && (
            <div className="card-price-row">
              {device.listPrice && <span className="card-list-price">{device.listPrice}</span>}
              <span className="card-price">{device.price}</span>
            </div>
          )
        )}
        {specMeta.length > 0 && (
          <ul className="card-specs">
            {specMeta.map(s => (
              <li key={s.key}>
                <span className="spec-label"><span className="spec-icon">{s.icon}</span>{s.label}</span>
                <span className="spec-value">{s.value}</span>
              </li>
            ))}
          </ul>
        )}
        <button className="card-link" onClick={() => onInfo(device)}>
          Mer information <span className="card-link-arrow">→</span>
        </button>
      </div>
    </div>
  )
}

function HardwareTab({ brand, filter, setFilter, onZoom, onInfo }) {
  const [query, setQuery] = useState(() => loadPersisted(`hw_query_${brand}`, ''))
  const meta = brands[brand]
  const cats = brand === 'flo' ? floCategories : categories
  const devs = brand === 'flo' ? floDevices : devices

  useEffect(() => savePersisted(`hw_query_${brand}`, query), [brand, query])

  const counts = {}
  devs.forEach(d => {
    counts[d.category] = (counts[d.category] || 0) + 1
  })
  counts['Alla'] = devs.length

  const filtered = devs.filter(d => filter === 'Alla' || d.category === filter).filter(d => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    const hay = `${d.model} ${d.category} ${d.formFactor} ${d.price || ''} ${d.buyPrice || ''} ${d.monthly48 || ''} ${d.sku || ''} ${d.specs.screen} ${d.specs.printer} ${d.specs.card} ${d.specs.network}`.toLowerCase()
    return hay.includes(q)
  })

  return (
    <section>
      <div className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-badge">{meta.badge}</div>
          <h1 className="hero-title">{meta.titleStart} <span className="gradient-text">{meta.titleAccent}</span> {meta.titleEnd}</h1>
          <p className="hero-sub">{meta.sub}</p>
          <div className="hero-search">
            <span className="hero-search-icon">🔍</span>
            <input
              type="text"
              className="hero-search-input"
              placeholder={meta.searchPlaceholder}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button className="hero-search-clear" onClick={() => setQuery('')} aria-label="Rensa sökning">✕</button>
            )}
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>{devs.length}</strong><span>produkter</span></div>
            <div className="hero-stat"><strong>{cats.length - 1}</strong><span>kategorier</span></div>
            <div className="hero-stat"><strong>SEK</strong><span>{meta.statsLabel}</span></div>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        {cats.map(c => (
          <button
            key={c}
            className={`filter-btn ${filter === c ? 'active' : ''}`}
            onClick={() => setFilter(c)}
          >
            {c}
            <span className="filter-count">{counts[c] ?? 0}</span>
          </button>
        ))}
      </div>

      <h2 className="list-title">
        {filter === 'Alla' ? 'Alla produkter' : filter}
        {query && <span className="list-title-query"> · matchar "{query}"</span>}
      </h2>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-emoji">🔍</div>
          <p>Inga enheter matchar din sökning.</p>
          <button className="empty-reset" onClick={() => { setQuery(''); setFilter('Alla') }}>Visa alla produkter</button>
        </div>
      ) : (
        <div className="device-grid" key={filter + query}>
          {filtered.map((d, i) => (
            <DeviceCard key={d.id} device={d} index={i} brand={brand} onZoom={onZoom} onInfo={onInfo} />
          ))}
        </div>
      )}

      <div className="cta-band">
        <div>
          <h3>{meta.cta.heading}</h3>
          <p>{meta.cta.text}</p>
        </div>
        <a className="btn-primary" href={meta.cta.url} target="_blank" rel="noopener noreferrer">
          {meta.cta.label}
        </a>
      </div>
    </section>
  )
}

function InfoModal({ device, brand, onClose }) {
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

  const meta = brands[brand]
  const infoField = device.purspot || device.flo
  const isFlo = brand === 'flo'

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

          {brand === 'purspot' && device.buyPrice ? (
            device.monthly48 ? (
              <div className="modal-price-pair">
                <div className="modal-price-line">
                  <span className="modal-price-tag">Direktköp</span>
                  <span className="modal-price-main">{formatSEK(device.buyPrice)}</span>
                </div>
                <div className="modal-price-line">
                  <span className="modal-price-tag">48 mån avtal</span>
                  <span className="modal-price-main">{device.monthly48.toLocaleString('sv-SE')} kr/mån</span>
                </div>
              </div>
            ) : (
              <div className="modal-price-row">
                <span className="modal-price">{formatSEK(device.buyPrice)}</span>
              </div>
            )
          ) : (
            device.price && (
              <div className="modal-price-row">
                {device.listPrice && <span className="modal-list-price">{device.listPrice}</span>}
                <span className="modal-price">{device.price}</span>
              </div>
            )
          )}
          {device.sku && device.sku !== 'Inte tillgänglig' && (
            <div className="modal-sku">Artikelnr: {device.sku}</div>
          )}
          {isFlo && device.price && <div className="modal-price-note">Alla priser exkl. moms.</div>}

          {infoField && (
            <div className="modal-purspot">
              <div className="modal-label">{meta.infoEmoji} {meta.infoLabel}</div>
              <p>{infoField}</p>
              {device.sourceUrl && (
                <a className="modal-link" href={device.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {meta.infoLink}
                </a>
              )}
            </div>
          )}

          {device.extra && (
            <div className="modal-note"><strong>Kort om enheten:</strong> {device.extra}</div>
          )}

          {device.desc && (
            <div className="modal-note"><strong>Beskrivning:</strong> {device.desc}</div>
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

function BackofficeTab({ brand }) {
  const meta = brands[brand]
  const mockArticles = [
    { name: brand === 'flo' ? 'Kvittorull 80mm (multipack)' : 'SUNMI V2s skärmfilm', category: brand === 'flo' ? 'Förbrukning' : 'Tillbehör', price: brand === 'flo' ? '599' : '149', moms: '25' },
    { name: 'Kvittorull 58mm (10-pack)', category: 'Förbrukning', price: '89', moms: '25' },
    { name: 'Kvittorull 80mm (10-pack)', category: 'Förbrukning', price: '99', moms: '25' }
  ]

  return (
    <section>
      <div className="bo-header">
        <h1>{meta.label} Backoffice</h1>
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

// =============================================================
// Välkomstskärm – visas första besöket (innan ett system sparats).
// Två stora, färgstarka knappar för att välja system.
// =============================================================
function SystemPicker({ onPick }) {
  return (
    <section className="sys-picker" aria-label="Välj system">
      <div className="sys-picker-glow" aria-hidden="true" />

      <div className="sys-picker-head">
        <span className="sys-picker-mark">P</span>
        <h1 className="sys-picker-title">Välj system</h1>
        <p className="sys-picker-sub">
          Vilket kassasystem ska få starta lathunden? Du kan alltid byta
          längst upp till höger när som helst.
        </p>
      </div>

      <div className="sys-picker-options">
        <button
          type="button"
          className="sys-picker-card is-purspot"
          onClick={() => onPick('purspot')}
        >
          <span className="sys-picker-blob" aria-hidden="true" />
          <span className="sys-picker-card-top">
            <span className="sys-picker-emoji" aria-hidden="true">💚</span>
            <span className="sys-picker-name">Purspot</span>
            <span className="sys-picker-arrow" aria-hidden="true">→</span>
          </span>
          <span className="sys-picker-desc">
            Kassasystem, expresskassor, kortterminaler och tillbehör från
            Purspot — komplett utbud under ett tak.
          </span>
          <span className="sys-picker-badge">Öppna Purspot</span>
        </button>

        <button
          type="button"
          className="sys-picker-card is-flo"
          onClick={() => onPick('flo')}
        >
          <span className="sys-picker-blob" aria-hidden="true" />
          <span className="sys-picker-card-top">
            <span className="sys-picker-emoji" aria-hidden="true">💜</span>
            <span className="sys-picker-name">Moreflo · Northmill</span>
            <span className="sys-picker-arrow" aria-hidden="true">→</span>
          </span>
          <span className="sys-picker-desc">
            Kassadatorer, kortterminaler, skrivare, vågar och tillbehör från
            Flo Pay — med pris och artikelnummer.
          </span>
          <span className="sys-picker-badge">Öppna Moreflo</span>
        </button>
      </div>
    </section>
  )
}

export default function App() {
  const [brand, setBrand] = useState(() => loadPersisted('pu_brand', 'purspot'))
  const [tab, setTab] = useState(() => loadPersisted('pu_tab', 'hardware'))
  const [filter, setFilter] = useState(() => loadPersisted('pu_filter', 'Alla'))
  const [zoomDevice, setZoomDevice] = useState(null)
  const [infoDevice, setInfoDevice] = useState(null)
  const [showSystemPicker, setShowSystemPicker] = useState(() => {
    try {
      return !window.localStorage.getItem('pu_brand')
    } catch {
      return true
    }
  })

  const meta = brands[brand]

  useEffect(() => savePersisted('pu_brand', brand), [brand])
  useEffect(() => savePersisted('pu_tab', tab), [tab])
  useEffect(() => savePersisted('pu_filter', filter), [filter])

  const pickSystem = (next) => {
    setBrand(next)
    setFilter('Alla')
    setShowSystemPicker(false)
  }

  const switchBrand = (next) => {
    if (next === brand) return
    setBrand(next)
    setFilter('Alla')
    setZoomDevice(null)
    setInfoDevice(null)
    if (next === 'flo' && (tab === 'softpos' || tab === 'paket')) setTab('hardware')
  }

  if (showSystemPicker) {
    return (
      <div className="app theme-purspot">
        <div className="aurora" aria-hidden="true">
          <div className="aurora-blob aurora-blob-1" />
          <div className="aurora-blob aurora-blob-2" />
          <div className="aurora-blob aurora-blob-3" />
        </div>
        <SystemPicker onPick={pickSystem} />
        <footer className="footer">Purspot AB · Internt · Alla enheter är Android-baserade</footer>
      </div>
    )
  }

  return (
    <div className={`app theme-${brand}`}>
      <div className="aurora" aria-hidden="true">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>

      <nav className="topnav">
        <div className="nav-main">
          <button
            type="button"
            className="nav-left nav-home"
            onClick={() => {
              setTab('hardware')
              setShowSystemPicker(true)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            aria-label="Till startsidan (välj plattform)"
            title="Till startsidan"
          >
            <span className="brand-mark">{meta.mark}</span>
            <span className="brand-text">LATHUNDEN</span>
          </button>
          <div className="nav-right">
            <div className="nav-tabs">
              {[
                { id: 'hardware', icon: '📱', label: 'Hårdvara' },
                ...(brand === 'purspot' ? [{ id: 'paket', icon: '🧩', label: 'Paketbyggare' }] : []),
                ...(brand === 'purspot' ? [{ id: 'softpos', icon: '💳', label: 'SoftPOS' }] : []),
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
            <div className="brand-switch" role="group" aria-label="Välj system">
              <button
                className={`brand-switch-btn ${brand === 'purspot' ? 'active' : ''}`}
                onClick={() => switchBrand('purspot')}
              >
                <span>💚</span> Purspot
              </button>
              <button
                className={`brand-switch-btn ${brand === 'flo' ? 'active' : ''}`}
                onClick={() => switchBrand('flo')}
              >
                <span>💜</span> Moreflo/Northmill
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="content" key={brand + tab}>
        {tab === 'hardware' && (
          <HardwareTab
            brand={brand}
            filter={filter}
            setFilter={setFilter}
            onZoom={setZoomDevice}
            onInfo={setInfoDevice}
          />
        )}
        {tab === 'paket' && <PackageBuilder />}
        {tab === 'softpos' && <SoftposTab />}
        {tab === 'backoffice' && <BackofficeTab brand={brand} />}
      </main>

      <footer className="footer">
        {meta.footer} · {new Date().getFullYear()}
      </footer>

      <InfoModal device={infoDevice} brand={brand} onClose={() => setInfoDevice(null)} />
      <ImageLightbox device={zoomDevice} onClose={() => setZoomDevice(null)} />
    </div>
  )
}