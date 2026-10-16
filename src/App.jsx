import React, { useState, useEffect } from 'react'
import { categories, devices, floCategories, floDevices, brands, formatSEK } from './data'
import PackageBuilder from './packageBuilder/PackageBuilder'
import CustomerRegistry from './CustomerRegistry'
import { startCustomerSync, stopCustomerSync } from './customers'

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
            <div className="hero-stat hero-stat-support">
              <span className="hero-support-label">Support</span>
              <a className="hero-support-phone" href={`tel:${meta.support.phone.replace(/\s/g, '')}`}>{meta.support.phone}</a>
              <a className="hero-support-mail" href={`mailto:${meta.support.email}`}>{meta.support.email}</a>
            </div>
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

function GenericLightbox({ img, onClose }) {
  useEffect(() => {
    if (!img) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [img, onClose])

  if (!img) return null

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Stäng">✕</button>
      <img
        className="lightbox-img"
        src={img.src}
        alt={img.caption}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="lightbox-caption" onClick={(e) => e.stopPropagation()}>{img.caption}</div>
    </div>
  )
}

function BoShot({ src, alt, caption, onZoom, small }) {
  return (
    <figure
      className={`bo-shot${small ? ' bo-shot-sm' : ''}`}
      role="button"
      tabIndex="0"
      aria-label={`Förstora bild: ${caption}`}
      onClick={() => onZoom({ src, caption })}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onZoom({ src, caption })
        }
      }}
    >
      <img src={src} alt={alt} loading="lazy" />
      <span className="bo-zoom-hint">Klicka för att förstora</span>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

const boIconInfo = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
)

const boIconWarn = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
)

const boNav = [
  {
    id: 'bo-oversikt',
    label: 'Översikt',
    items: [{ id: 'bo-oversikt', label: 'Översikt' }]
  },
  {
    id: 'bo-rapporter',
    label: 'Rapporter',
    items: [
      { id: 'bo-report-x', label: 'X-Rapport' },
      { id: 'bo-report-z', label: 'Z-Rapporter' },
      { id: 'bo-report-zdag', label: 'Z-Dagsrapport' },
      { id: 'bo-report-period', label: 'Periodrapporter' },
      { id: 'bo-report-artikel', label: 'Artikelrapport' },
      { id: 'bo-report-tid', label: 'Tidsrapport Personal' },
      { id: 'bo-report-tim', label: 'Timförsäljningsrapport' },
      { id: 'bo-report-kasso', label: 'Kassörapport' }
    ]
  },
  {
    id: 'bo-transaktioner',
    label: 'Transaktioner',
    items: [
      { id: 'bo-kvitton', label: 'Kvitton' },
      { id: 'bo-ordrar', label: 'Ordrar' }
    ]
  },
  {
    id: 'bo-produkter',
    label: 'Produkter',
    items: [
      { id: 'bo-p-kategorier', label: 'Kategorier' },
      { id: 'bo-p-artiklar', label: 'Produkter (Artikelregister)' },
      { id: 'bo-p-prislistor', label: 'Prislistor' },
      { id: 'bo-p-tillval', label: 'Tillvalskategorier & Tillval' },
      { id: 'bo-p-tillvalslistor', label: 'Tillvalslistor & Tillvalsmappning' },
      { id: 'bo-p-vyer', label: 'Produktvyer & Produktmappning' },
      { id: 'bo-p-skrivarstationer', label: 'Skrivarstationer & Åtgärdshändelser' },
      { id: 'bo-p-import', label: 'Import / Export & Menybyggare (AI)' }
    ]
  }
]

const BO_TARGETS = [
  'bo-oversikt', 'bo-rapporter',
  'bo-report-x', 'bo-report-z', 'bo-report-zdag', 'bo-report-period',
  'bo-report-artikel', 'bo-report-tid', 'bo-report-tim', 'bo-report-kasso',
  'bo-transaktioner', 'bo-kvitton', 'bo-ordrar',
  'bo-produkter', 'bo-p-kategorier', 'bo-p-artiklar', 'bo-p-prislistor',
  'bo-p-tillval', 'bo-p-tillvalslistor', 'bo-p-vyer', 'bo-p-skrivarstationer', 'bo-p-import'
]

const boMetrics = [
  { n: 'Total Försäljning', d: 'Summan av all försäljning' },
  { n: 'Antal ordrar', d: 'Antal genomförda ordrar' },
  { n: 'Antal Produkter', d: 'Antal sålda produkter' },
  { n: 'Snitt Försäljning per order', d: 'Genomsnittlig ordervärde' },
  { n: 'Snitt antal produkter per order', d: 'Produkter per order i snitt' },
  { n: 'Återbetalningar', d: 'Antal utförda återbetalningar' },
  { n: 'Totalt givna rabatter', d: 'Summan av alla rabatter' }
]

const boReports = [
  { id: 'bo-report-x', tag: 'Dag', n: 'X-Rapport', d: 'Total försäljning sedan start.' },
  { id: 'bo-report-z', tag: 'Dag', n: 'Z-Rapporter', d: 'Sammanställda dagsrapporter för alla enheter. Syns dagen efter, eftersom dagsavslut sker automatiskt.' },
  { id: 'bo-report-zdag', tag: 'Dag', n: 'Z-Dagsrapport', d: 'Dagsrapport uppdelad per individuell enhet (t.ex. huvudkassa, expresskassa).' },
  { id: 'bo-report-period', n: 'Periodrapporter', d: 'Försäljning samlad för en vald tidsperiod.' },
  { id: 'bo-report-artikel', n: 'Artikelrapport', d: 'Försäljning uppdelad per artikel.' },
  { id: 'bo-report-tid', n: 'Tidsrapport Personal', d: 'Arbetstider och närvaro för personalen.' },
  { id: 'bo-report-tim', n: 'Timförsäljningsrapport', d: 'Försäljning uppdelad per timme.' },
  { id: 'bo-report-kasso', n: 'Kassörapport', d: 'Underlag för kassaräkning och avstämning.' },
  { id: 'bo-report-journal', n: 'Journaler', d: 'Händelser och loggar från kassan.' },
  { id: 'bo-report-presentkort', n: 'Presentkortsrapport', d: 'Översikt över utfärdade och inlösta presentkort.' }
]

function BackofficeTab({ brand, onZoom }) {
  const meta = brands[brand]
  const [activeId, setActiveId] = useState('bo-atkomst')
  const [copied, setCopied] = useState(false)
  const [openCat, setOpenCat] = useState(null)

  const isMobile = () => window.matchMedia('(max-width: 767px)').matches

  useEffect(() => {
    if (!isMobile()) return
    const g = boNav.find(g => g.id === activeId || g.items.some(it => it.id === activeId))
    if (g) setOpenCat(g.id)
  }, [activeId])

  useEffect(() => {
    const els = BO_TARGETS.map(id => document.getElementById(id)).filter(Boolean)
    if (els.length === 0) return
    let ticking = false
    let disposed = false
    const update = () => {
      ticking = false
      const offset = 130
      let current = els[0]
      for (let i = 0; i < els.length; i++) {
        if (els[i].getBoundingClientRect().top - offset <= 0) current = els[i]
      }
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
        current = els[els.length - 1]
      }
      if (!disposed) setActiveId(current.id)
    }
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update) }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      disposed = true
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const copyUrl = async () => {
    const url = 'https://bo.purspot.com/login'
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt('Kopiera länken:', url)
    }
  }

  return (
    <section>
      <div className="bo-header">
        <h1>{meta.label} Backoffice</h1>
        <p className="bo-sub">Instruktionshandbok – åtkomst, översikt, rapporter och transaktioner</p>
        <div className="bo-badge">Guide</div>
      </div>

      <div className="bo-guide">
        <aside className="bo-toc" aria-label="Snabbnavigering">
          {boNav.map(g => {
            const catActive = activeId === g.id || g.items.some(it => it.id === activeId)
            const open = openCat === g.id
            return (
              <div key={g.id} className={`bo-toc-group${open ? ' open' : ''}`}>
                <a
                  href={'#' + g.id}
                  className={`bo-toc-link bo-toc-cat${catActive ? ' active' : ''}`}
                  aria-expanded={open}
                  onClick={e => {
                    if (isMobile()) {
                      e.preventDefault()
                      setOpenCat(open ? null : g.id)
                    }
                  }}
                >
                  <span className="bo-toc-cat-label">{g.label}</span>
                  <span className="bo-toc-chev" aria-hidden="true">▾</span>
                </a>
                <div className="bo-toc-subs">
                  {g.items.map(it => (
                    <a
                      key={it.id}
                      href={'#' + it.id}
                      className={`bo-toc-link bo-toc-sub${activeId === it.id ? ' active' : ''}`}
                      onClick={() => isMobile() && setOpenCat(null)}
                    >
                      {it.label}
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
          <p className="bo-toc-foot">4 kategorier · 28 skärmbilder</p>
        </aside>

        <div className="bo-body">

          {/* ---------- 1. Åtkomst & Inloggning ---------- */}
          <div className="bo-sec-head" id="bo-atkomst">
            <span className="bo-sec-num">1</span>
            <h2>Åtkomst &amp; Inloggning</h2>
          </div>
          <section className="bo-card">
            <p className="bo-lead">Backoffice är helt webbaserat – det finns inget att installera. Du loggar bara in i en webbläsare och har full översikt över försäljning, rapporter och transaktioner.</p>

            <ul className="bo-list">
              <li><strong>Fungerar på alla våra enheter:</strong> huvudkassa, expresskassa och minikassa.</li>
              <li><strong>Fungerar på externa enheter:</strong> dator, mobil och surfplatta – med webbläsare och uppkoppling.</li>
              <li><strong>Vid köp av hårdvara</strong> får du ett välkomstbrev som innehåller alla inloggningsuppgifter.</li>
            </ul>

            <h4>Så loggar du in</h4>
            <ol className="bo-steps">
              <li>Gå till adressen nedan i valfri webbläsare.</li>
              <li>Använd inloggningsuppgifterna från välkomstbrevet.</li>
              <li>Du hamnar på välkomstsidan <strong>"Hem"</strong> – härifrån navigerar du mellan flikarna i Backoffice.</li>
            </ol>

            <div className="bo-url">
              <code>https://bo.purspot.com/login</code>
              <button type="button" onClick={copyUrl}>{copied ? 'Kopierat!' : 'Kopiera'}</button>
            </div>

            <div className="bo-note-box info">
              {boIconInfo}
              <p>Spara gärna länken som bokmärke i webbläsaren så har du alltid snabb åtkomst till Backoffice.</p>
            </div>

            <BoShot
              src="/images/backoffice/01-atkomst-inloggning.png"
              alt="Backoffice – välkomstsidan (Hem) efter inloggning"
              caption={`Välkomstsidan "Hem" som du ser efter inloggning.`}
              onZoom={onZoom}
            />
          </section>

          {/* ---------- 2. Översikt ---------- */}
          <div className="bo-sec-head" id="bo-oversikt">
            <span className="bo-sec-num">2</span>
            <h2>Översikt</h2>
          </div>
          <section className="bo-card">
            <p className="bo-lead">Fliken <strong>"Översikt"</strong> ger en visuell och statistisk överblick över försäljningen. Här ser du hur det går – i realtid och utan att behöva gå in i de tyngre rapporterna.</p>

            <h3 className="bo-first">Mätpunkter</h3>
            <p className="bo-muted">Nyckeltalen visar försäljningen i den period du har valt:</p>
            <div className="bo-metrics">
              {boMetrics.map(m => (
                <div className="bo-metric" key={m.n}>
                  <strong>{m.n}</strong>
                  <span>{m.d}</span>
                </div>
              ))}
            </div>

            <h3>Grafer och topplistor</h3>
            <ul className="bo-list">
              <li><strong>Total försäljning per timme</strong> – se när försäljningen toppar under dagen.</li>
              <li><strong>Timförsäljning per säljställe/kassa</strong> – jämför prestanda mellan enheterna.</li>
              <li><strong>Toppförsäljning per produkt/huvudgrupp</strong> – vad som säljer bäst.</li>
              <li><strong>Top Försäljare</strong> – ranking av personalens försäljning.</li>
            </ul>

            <BoShot
              src="/images/backoffice/02-oversikt.png"
              alt="Backoffice – fliken Översikt med nyckeltal, grafer och topplistor"
              caption="Översikten med nyckeltal, grafer och topplistor."
              onZoom={onZoom}
            />
          </section>

          {/* ---------- 3. Rapporter & Automatisk Bokföring ---------- */}
          <div className="bo-sec-head" id="bo-rapporter">
            <span className="bo-sec-num">3</span>
            <h2>Rapporter &amp; Automatisk Bokföring</h2>
          </div>
          <section className="bo-card">
            <p className="bo-lead">Under fliken <strong>"Rapporter"</strong> hittar du alla rapporter som behövs för daglig administration, bokföring och uppföljning.</p>

            <h3 className="bo-first">Rapporttyper</h3>
            <div className="bo-report-grid">
{boReports.map(r => (
            <div className="bo-report" id={r.id} key={r.n}>
                  <b>{r.tag && <span className="bo-tag">{r.tag}</span>}{r.n}</b>
                  <span>{r.d}</span>
                </div>
              ))}
            </div>

            <h3>Filtrering på enheter</h3>
            <p>Du kan filtrera på specifika kassaregister/terminaler för att se enhetsspecifika rapporter – till exempel endast huvudkassan, eller alla tre enheter samtidigt.</p>
            <div className="bo-pills">
              <span className="bo-pill">Huvudkassa</span>
              <span className="bo-pill">Expresskassa</span>
              <span className="bo-pill">Minikassa</span>
              <span className="bo-pill">Alla enheter</span>
            </div>

            <h3 id="bo-auto-bokforing">Automatisk bokföring &amp; e-post</h3>
            <p>Inställningarna hittar du under <strong>Inställningar &rarr; Rapporter</strong>.</p>
            <ul className="bo-list">
              <li><strong>Dagsavslut sker automatiskt</strong> på den tid du väljer. Rapporten skickas både via e-post och sparas i Backoffice.</li>
              <li><strong>Månadsrapporter</strong> skickas automatiskt den 1:a varje månad kl. 05:00.</li>
            </ul>

            <h4>Inställningsflikar</h4>
            <div className="bo-tabs">
              <span className="bo-tab on">Z-Dagsrapport</span>
              <span className="bo-tab">Automatisk Z-Rapport</span>
              <span className="bo-tab">Månadsrapport</span>
              <span className="bo-tab">Presentkortsrapport</span>
            </div>

            <h4>Standardinställningar</h4>
            <ol className="bo-steps">
              <li>Fyll i din <strong>e-postadress</strong>.</li>
              <li>Bocka i <strong>"Skicka Dagsrapport som PDF"</strong>.</li>
              <li>Bocka i <strong>"Skicka SIE"</strong>.</li>
            </ol>

            <h3>Manuella åtgärder i rapporter</h3>
            <p>Markera en rapport i listan och välj vilken åtgärd du behöver:</p>
            <div className="bo-actions">
              <span className="bo-action primary">Exportera till Fortnox</span>
              <span className="bo-action">Ladda ner SIE</span>
              <span className="bo-action">Ladda ner PDF</span>
              <span className="bo-action">E-posta PDF</span>
            </div>

            <div className="bo-note-box info">
              {boIconInfo}
              <p><strong>E-posta PDF</strong> är praktiskt när du eller kunden behöver en kopia direkt i inkorgen.</p>
            </div>

            <BoShot
              src="/images/backoffice/03-rapporter.png"
              alt="Backoffice – rapportöversikt med alla rapporttyper och filter"
              caption="Rapportöversikten med alla rapporttyper och filter."
              onZoom={onZoom}
            />
          </section>

          {/* ---------- 4. Transaktioner ---------- */}
          <div className="bo-sec-head" id="bo-transaktioner">
            <span className="bo-sec-num">4</span>
            <h2>Transaktioner</h2>
          </div>
          <section className="bo-card">
            <p className="bo-lead" style={{ margin: 0 }}>Fliken <strong>"Transaktioner"</strong> samlar kvitton, ordrar och presentkort på ett ställe. Nedan går vi igenom de tre underflikarna.</p>
          </section>

          <section className="bo-card" id="bo-kvitton">
            <h3 className="bo-first">Kvitton</h3>
            <ol className="bo-steps">
              <li>Sök på <strong>"Från"-</strong> och <strong>"Till"-datum</strong>.</li>
              <li>Klicka på <strong>Uppdatera</strong> för att visa listan.</li>
              <li>Listan visar <strong>kvittonummer, ordernr, datum och belopp</strong>.</li>
              <li>Klicka på ett kvitto för att se detaljer – därifrån kan du <strong>Exportera till Fortnox, Ladda ner SIE, Ladda ner PDF eller E-posta PDF</strong>.</li>
            </ol>

            <div className="bo-note-box info">
              {boIconInfo}
              <p><strong>E-posta PDF</strong> är perfekt om kunden behöver en kopia via e-post – kvittot skickas direkt till angiven adress.</p>
            </div>

            <BoShot
              src="/images/backoffice/04-kvitton.png"
              alt="Backoffice – Transaktioner, fliken Kvitton"
              caption="Transaktioner – Kvitton: sök på datum och öppna ett kvitto för detaljer."
              onZoom={onZoom}
            />
          </section>

          <section className="bo-card" id="bo-ordrar">
            <h3 className="bo-first">Ordrar</h3>
            <p>Filtrera listan med hjälp av filtren:</p>

            <div className="bo-filter-row"><b>Datum</b> – välj Från- och Till-datum.</div>

            <div className="bo-filter-row">
              <b>Platser</b>
              <div className="bo-pills">
                <span className="bo-pill">Huvudkassa</span>
                <span className="bo-pill">Expresskassa</span>
              </div>
            </div>

            <div className="bo-filter-row">
              <b>Ursprung</b>
              <div className="bo-pills">
                <span className="bo-pill">Foodora</span>
                <span className="bo-pill">Uber</span>
                <span className="bo-pill">Wolt</span>
                <span className="bo-pill">POS</span>
              </div>
            </div>

            <div className="bo-filter-row">
              <b>Status</b>
              <div className="bo-pills">
                <span className="bo-pill">Avbruten</span>
                <span className="bo-pill">Godkänd</span>
                <span className="bo-pill">Skapad</span>
              </div>
            </div>

            <div className="bo-note-box warn">
              {boIconWarn}
              <p><strong>Viktigt:</strong> under enskilda ordrar går det <strong>inte</strong> att skicka eller exportera via Fortnox, PDF eller SIE. Använd fliken <strong>Kvitton</strong> när du behöver den typen av export.</p>
            </div>

            <BoShot
              src="/images/backoffice/05-ordrar.png"
              alt="Backoffice – Transaktioner, fliken Ordrar"
              caption="Transaktioner – Ordrar: filtrera på datum, plats, ursprung och status."
              onZoom={onZoom}
            />
          </section>

          <section className="bo-card" id="bo-presentkort">
            <h3 className="bo-first">Presentkort</h3>
            <p className="bo-muted">Överst visas en sammanfattning av presentkorten:</p>

            <div className="bo-stats">
              <div className="bo-stat"><strong>–</strong><span>Utestående Saldo</span></div>
              <div className="bo-stat"><strong>–</strong><span>Aktiva Kort</span></div>
              <div className="bo-stat"><strong>–</strong><span>Totalt Utfärdat</span></div>
              <div className="bo-stat"><strong>–</strong><span>Totalt Inlöst</span></div>
            </div>

            <p>Tabellen visar följande kolumner:</p>
            <div className="bo-table-card">
              <table>
                <thead>
                  <tr>
                    <th>Presentkorts-kod</th>
                    <th>Ursprungligt Belopp</th>
                    <th>Återstående Saldo</th>
                    <th>Status</th>
                    <th>Utfärdat Datum</th>
                    <th>Utgångsdatum</th>
                    <th>Användningshistorik</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>PC-1042</td>
                    <td>500,00 kr</td>
                    <td>350,00 kr</td>
                    <td><span className="bo-status on">Aktiv</span></td>
                    <td>2026-08-12</td>
                    <td>2027-08-12</td>
                    <td>1 inlösen – 150,00 kr</td>
                  </tr>
                  <tr>
                    <td>PC-0987</td>
                    <td>250,00 kr</td>
                    <td>0,00 kr</td>
                    <td><span className="bo-status off">Inaktiv</span></td>
                    <td>2026-05-03</td>
                    <td>2027-05-03</td>
                    <td>Fullt inlöst</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="bo-muted" style={{ marginTop: 10 }}>Tabellen ovan visar exempeldata endast för att illustrera kolumnerna.</p>

            <BoShot
              src="/images/backoffice/06-presentkort.png"
              alt="Backoffice – Transaktioner, fliken Presentkort"
              caption="Transaktioner – Presentkort: saldo, status och användningshistorik."
              onZoom={onZoom}
            />
          </section>

          {/* ---------- 5. Produkter ---------- */}
          <div className="bo-sec-head" id="bo-produkter">
            <span className="bo-sec-num">5</span>
            <h2>Produkter</h2>
          </div>
          <section className="bo-card">
            <p className="bo-lead" style={{ margin: 0 }}>Fliken <strong>"Produkter"</strong> är där du bygger hela menyn – kategorier, artiklar, priser, tillval, produktvyer och bongutskrift. Nedan går vi igenom arbetsflödet från grunden.</p>
          </section>

          <section className="bo-card" id="bo-p-kategorier">
            <h3 className="bo-first">Kategorier</h3>
            <p className="bo-muted">Kategorierna byggs i två steg: först en <strong>rapportkategori</strong> som styr moms och bokföring, sedan en <strong>produktkategori</strong> som bygger själva menyn i kassan.</p>

            <h4>Steg 1 – Skapa rapportkategori</h4>
            <p>Klicka på <strong>"Skapa rapportkategori"</strong> och fyll i:</p>
            <ul className="bo-list">
              <li><strong>Namn</strong> och <strong>Beskrivning</strong> (valfritt).</li>
              <li><strong>Standardmoms</strong> – 0%, 6%, 12% eller 25%.</li>
              <li><strong>Standardkonto</strong> och <strong>alternativa kontoinställningar</strong>.</li>
              <li><strong>Färg</strong> samt <strong>Ordning</strong> (1 visas först).</li>
            </ul>
            <div className="bo-note-box info">
              {boIconInfo}
              <p><strong>VIKTIG REGEL:</strong> aktivera <strong>"Tillåt ändring av take away-moms"</strong> för att automatiskt sänka momsen från 12% till 6% vid Take Away-beställningar.</p>
            </div>
            <BoShot
              src="/images/backoffice/products/bro-p01-skapa-rapportkategori.png"
              alt="Backoffice – Produkter, skapa rapportkategori"
              caption="Skapa rapportkategori: namn, beskrivning, moms, konto, färg och ordning."
              onZoom={onZoom}
              small
            />

            <h4>Steg 2 – Skapa produktkategori</h4>
            <p>Klicka på <strong>"Skapa Produktkategori"</strong> och fyll i:</p>
            <ul className="bo-list">
              <li><strong>Namn</strong> – syns i kassan.</li>
              <li><strong>Ordning</strong> – 1 hamnar längst till vänster i menyn.</li>
              <li><strong>Färg</strong> och koppling till din <strong>Rapportkategori</strong>.</li>
              <li><strong>Bild/ikon</strong> – rekommenderas en SVG-fil.</li>
            </ul>
            <BoShot
              src="/images/backoffice/products/bro-p02-skapa-produktkategori.png"
              alt="Backoffice – Produkter, skapa produktkategori"
              caption="Skapa produktkategori: namn, ordning, färg, rapportkategori och ikon."
              onZoom={onZoom}
              small
            />

            <h4>Översikt över kategorierna</h4>
            <BoShot
              src="/images/backoffice/products/bro-p03-kategorier-oversikt.png"
              alt="Backoffice – Produkter, översikt över kategorierna"
              caption="Kategorier – översikt över rapport- och produktkategorier."
              onZoom={onZoom}
            />
          </section>

          <section className="bo-card" id="bo-p-artiklar">
            <h3 className="bo-first">Produkter (Artikelregister)</h3>

            <h4>Skapa produkt</h4>
            <p>Klicka på <strong>"Skapa Produkt"</strong> och fyll i:</p>
            <ul className="bo-list">
              <li><strong>Namn</strong>, <strong>Beskrivning</strong>, <strong>Rapportkategori</strong> och <strong>Produktkategori</strong>.</li>
              <li><strong>Pris</strong> och <strong>Moms</strong>.</li>
              <li><strong>Tillvalslista</strong>, <strong>Skrivarstation</strong>, <strong>Färg</strong> och <strong>Produktnummer</strong>.</li>
            </ul>
            <div className="bo-note-box info">
              {boIconInfo}
              <p><strong>Nummerregel:</strong> produktnumret måste vara unikt. Börja gärna på <strong>1000</strong> och hoppa med 5 siffror per artikel (<strong>1000, 1005, 1010</strong>) för att ge utrymme åt framtida artiklar.</p>
            </div>
            <p>Kryssrutor på produkten:</p>
            <ul className="bo-list">
              <li><strong>"Visa produktalternativ vid köp"</strong> – öppnar tillvalen i kassan.</li>
              <li><strong>"Tillåt öppen antal och mängd"</strong> – låter kassabiträdet ändra antal fritt.</li>
              <li><strong>"Tillåt öppen rabatt"</strong>.</li>
              <li><strong>"Blockera take away/hemleverans"</strong>.</li>
              <li><strong>"Synlig"</strong> – <strong>MÅSTE VARA AKTIV</strong>.</li>
              <li><strong>"Online"</strong> – visar produkten i webbutiken.</li>
            </ul>
            <BoShot
              src="/images/backoffice/products/bro-p05-skapa-produkt.png"
              alt="Backoffice – Produkter, skapa produkt"
              caption="Skapa produkt: namn, priser, kategorier, tillval, skrivarstation och kryssrutor."
              onZoom={onZoom}
            />

            <h4>Lagerhantering</h4>
            <p>Klicka på <strong>"Visa fler inställningar"</strong> längst ner i skapa-rutan. Bocka i <strong>"Använd Lager"</strong> och fyll i antal. <strong>Systemet räknar ner automatiskt</strong> vid varje försäljning.</p>
            <BoShot
              src="/images/backoffice/products/bro-p06-lagerhantering.png"
              alt="Backoffice – Produkter, lagerhantering"
              caption="Lagerhantering: sätt på ”Använd Lager” och systemet räknar ner automatiskt."
              onZoom={onZoom}
              small
            />

            <h4>Kopiera &amp; snabbredigera</h4>
            <ul className="bo-list">
              <li><strong>Kopiera produkt</strong> via ikonen till höger i listan, eller välj <strong>"Spara och Kopiera"</strong> vid skapandet – ändra endast Namn, Pris och Produktnr.</li>
              <li><strong>Snabbredigering:</strong> klicka på knappen <strong>"Redigera"</strong> bredvid "Skapa produkt" för att göra samtliga fält i artikellistan redigerbara direkt i tabellen – nummer, namn, pris, lager, kategorier, färger och skrivarstationer.</li>
            </ul>
            <BoShot
              src="/images/backoffice/products/bro-p04-produktlista.png"
              alt="Backoffice – Produkter, produktlista"
              caption="Produktlista – samtliga artiklar med pris, kategori, lager och status."
              onZoom={onZoom}
            />
            <BoShot
              src="/images/backoffice/products/bro-p07-snabbredigera-artiklar.png"
              alt="Backoffice – Produkter, snabbredigering av artiklar"
              caption="Snabbredigering: redigera flera artiklar direkt i tabellen via knappen ”Redigera”."
              onZoom={onZoom}
            />
          </section>

          <section className="bo-card" id="bo-p-prislistor">
            <h3 className="bo-first">Prislistor</h3>
            <ul className="bo-list">
              <li>Används för att sätta <strong>olika priser</strong> på artiklar baserat på leveranstyp, t.ex. <strong>Äta här</strong> vs <strong>Take Away</strong>.</li>
              <li>Skapa prislistan och koppla den under <strong>"Leveranstyp Prislistor"</strong>.</li>
              <li>Välj sedan prislistan längst ner på den enskilda artikeln under <strong>"Redigera produkt"</strong>.</li>
            </ul>
            <BoShot
              src="/images/backoffice/products/bro-p08-prislistor.png"
              alt="Backoffice – Produkter, prislistor"
              caption="Prislistor: olika priser per leveranstyp, t.ex. Äta här vs Take Away."
              onZoom={onZoom}
            />
          </section>

          <section className="bo-card" id="bo-p-tillval">
            <h3 className="bo-first">Tillvalskategorier &amp; Tillval</h3>

            <p className="bo-muted">Så här syns tillvalskategorin under en artikel samt hur en kategoriruta ser ut:</p>

            <h4>Tillvalskategorier</h4>
            <p>Skapa kategorier/mappar först (t.ex. <strong>Ingredienser</strong>, <strong>Stekgrad</strong>, <strong>Dryck</strong>) med inställningar för <strong>Ordning</strong> samt <strong>Minimum-</strong> och <strong>Maximum-värde</strong> för antal val.</p>
            <BoShot
              src="/images/backoffice/products/bro-p09-tillvalskategori-vy.png"
              alt="Backoffice – Produkter, tillvalskategori som visas under en artikel"
              caption="Tillvalskategori som visas under en artikel i kassan."
              onZoom={onZoom}
            />
            <BoShot
              src="/images/backoffice/products/bro-p10-skapa-tillvalskategori.png"
              alt="Backoffice – Produkter, skapa tillvalskategori"
              caption="Skapa tillvalskategori: namn, ordning samt min/max antal val."
              onZoom={onZoom}
            />

            <h4>Tillval</h4>
            <p>Skapa unika tillval med egna produktnummer:</p>
            <ul className="bo-list">
              <li><strong>Produktnummer</strong> – hoppa med 5 siffror.</li>
              <li><strong>Pris</strong> (kan vara 0 kr), <strong>Moms</strong> och <strong>Synlig</strong>.</li>
              <li><strong>Tillvalskategori</strong>, <strong>Rapportkategori</strong> och <strong>Skrivarstation</strong>.</li>
              <li><strong>Min/Max-mängd</strong> per tillval.</li>
            </ul>
            <p>Använd knappen <strong>"Redigera"</strong> i tillvalslistan för snabbredigering av alla tillval direkt i tabellen.</p>
            <BoShot
              src="/images/backoffice/products/bro-p11-tillval-lista.png"
              alt="Backoffice – Produkter, tillvalslista"
              caption="Tillval – listan över samtliga tillval med pris, moms och status."
              onZoom={onZoom}
            />
            <BoShot
              src="/images/backoffice/products/bro-p12-skapa-tillval.png"
              alt="Backoffice – Produkter, skapa tillval"
              caption="Skapa tillval: namn, produktnummer, pris, moms, kategori och skrivarstation."
              onZoom={onZoom}
            />
            <BoShot
              src="/images/backoffice/products/bro-p13-snabbredigera-tillval.png"
              alt="Backoffice – Produkter, snabbredigera tillval"
              caption="Snabbredigering av tillval direkt i tabellen för snabbare ändringar."
              onZoom={onZoom}
            />
          </section>

          <section className="bo-card" id="bo-p-tillvalslistor">
            <h3 className="bo-first">Tillvalslistor &amp; Tillvalsmappning</h3>

            <h4>Tillvalslistor</h4>
            <p>Klicka på <strong>"Skapa Tillvalslista"</strong>, namnge listan och sätt <strong>Status till Aktiv</strong>.</p>
            <BoShot
              src="/images/backoffice/products/bro-p14-tillvalslistor.png"
              alt="Backoffice – Produkter, tillvalslistor"
              caption="Tillvalslistor som kopplas till artiklarna."
              onZoom={onZoom}
            />

            <h4>Tillvalsmappning</h4>
            <p>Visar tillvalslistorna i kolumner. <strong>Kryssa i</strong> vilka tillval som ska ingå i vilken lista – <strong>sparas automatiskt</strong> vid klick.</p>
            <BoShot
              src="/images/backoffice/products/bro-p15-tillvalsmappning.png"
              alt="Backoffice – Produkter, tillvalsmappning"
              caption="Tillvalsmappning: bestäm vilka tillvalslistor som ska ha vilka tillval."
              onZoom={onZoom}
            />

            <div className="bo-note-box info">
              {boIconInfo}
              <p>Koppla därefter tillvalslistan till önskad produkt under <strong>"Produkter"</strong>. Säkerställ att <strong>"Visa produktalternativ vid köp"</strong> är aktiverat på artikeln.</p>
            </div>
          </section>

          <section className="bo-card" id="bo-p-vyer">
            <h3 className="bo-first">Produktvyer &amp; Produktmappning</h3>

            <h4>Produktvyer</h4>
            <p>Skapa vyer för olika typer av kassor, t.ex. <strong>"Expresskassa"</strong>, <strong>"Huvudkassa"</strong> och <strong>"Minikassa"</strong>.</p>
            <BoShot
              src="/images/backoffice/products/bro-p16-produktvyer.png"
              alt="Backoffice – Produkter, produktvyer"
              caption="Produktvyer som skapas för att mappa huvudartiklar."
              onZoom={onZoom}
            />

            <h4>Produktmappning</h4>
            <p><strong>Kryssa i kolumnerna</strong> vilka produkter som ska visas i vilken produktvy – <strong>sparas automatiskt</strong>.</p>
            <BoShot
              src="/images/backoffice/products/bro-p17-produktmappning.png"
              alt="Backoffice – Produkter, produktmappning"
              caption="Produktmappning: välj vilka produktvyer som ska ha vilka artiklar."
              onZoom={onZoom}
            />
          </section>

          <section className="bo-card" id="bo-p-skrivarstationer">
            <h3 className="bo-first">Skrivarstationer &amp; Åtgärdshändelser</h3>

            <h4>Skrivarstationer</h4>
            <p>Skapa stationer för bongutskrift – standard är <strong>BAR</strong> och <strong>KÖK</strong>.</p>
            <BoShot
              src="/images/backoffice/products/bro-p18-skrivarstationer.png"
              alt="Backoffice – Produkter, skrivarstationer för bongutskrift"
              caption="Skrivarstationer för bongutskrift."
              onZoom={onZoom}
            />

            <h4>Åtgärdshändelser (regler för bongutskrift)</h4>
            <p>Vanliga typer:</p>
            <ul className="bo-list">
              <li><strong>NewOrder</strong> – nya ordrar.</li>
              <li><strong>NewParkingTicket</strong> – parkerade ordrar/bord.</li>
              <li><strong>TicketQueue</strong> – gemensam bong till köket när flera betalar var för sig.</li>
            </ul>
            <p>Konfiguration: sätt <strong>Namn</strong>, <strong>Typ</strong>, <strong>Aktiverad</strong>, <strong>Ursprung</strong> (POS, Online, Wolt m.fl.) och <strong>Skrivarstationer</strong> (Bar/Kök).</p>
            <ul className="bo-list">
              <li><strong>Tillgängliga POS-enheter</strong> – klicka <strong>"Lägg till"</strong> under <strong>Notifiera</strong>.</li>
              <li><strong>Tillgängliga Skrivare</strong> – klicka <strong>"Lägg till"</strong> under <strong>Skriv ut</strong>.</li>
            </ul>
            <BoShot
              src="/images/backoffice/products/bro-p19-skapa-atgardshandelse.png"
              alt="Backoffice – Produkter, skapa åtgärdshändelse"
              caption="Skapa åtgärdshändelse: namn, typ, ursprung, enheter och skrivare."
              onZoom={onZoom}
            />
            <BoShot
              src="/images/backoffice/products/bro-p20-exempel-atgardshandelse.png"
              alt="Backoffice – Produkter, exempel på åtgärdshändelse"
              caption="Exempel på hur en åtgärdshändelse kan se ut."
              onZoom={onZoom}
            />
          </section>

          <section className="bo-card" id="bo-p-import">
            <h3 className="bo-first">Import / Export &amp; Menybyggare (AI)</h3>

            <h4>Import / Export</h4>
            <p>Mallbaserad massuppladdning av Excel-menyer. Rekommendationen är att <strong>Purspot utför</strong> konverteringen åt kunden.</p>
            <BoShot
              src="/images/backoffice/products/bro-p21-import-export.png"
              alt="Backoffice – Produkter, import och export av meny"
              caption="Import / Export av meny via Excel-mall."
              onZoom={onZoom}
            />

            <h4>Menybyggare (AI)</h4>
            <p>AI-verktyg som läser av en menybild/PDF och <strong>skapar artiklar automatiskt</strong>.</p>
            <div className="bo-note-box warn">
              {boIconWarn}
              <p><strong>OBS:</strong> kunden ska alltid <strong>granska och kontrollera</strong> resultatet efter uppladdning.</p>
            </div>
            <BoShot
              src="/images/backoffice/products/bro-p22-menybyggare-ai.png"
              alt="Backoffice – Produkter, Menybyggare AI-verktyget"
              caption="Menybyggare (AI): skapar artiklar automatiskt från menybild/PDF."
              onZoom={onZoom}
            />
          </section>

        </div>
      </div>
    </section>
  )
}

// =============================================================
// Välkomstskärm – visas första besöket (innan ett system sparats).
// Två stora, färgstarka knappar för att välja system.
// =============================================================
function SystemPicker({ onPick }) {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <section className="sys-picker" aria-label="Välj system">
      <div className="sys-picker-glow" aria-hidden="true" />

      <div className="sys-picker-head">
        <span className="sys-picker-mark">P</span>
        <div className="sys-picker-title-row">
          <h1 className="sys-picker-title">Välj system</h1>
          <button
            type="button"
            className="sys-picker-info-btn"
            onClick={() => setShowInfo((v) => !v)}
            aria-expanded={showInfo}
            aria-label="Om denna sida"
            title="Om denna sida"
          >
            {showInfo ? '✕' : 'ⓘ'}
          </button>
        </div>
        {showInfo && (
          <div className="sys-picker-info" role="note">
            Den här startsidan hjälper dig att välja vilket kassasystem lathunden
            ska visa. Här väljer du mellan <strong>Purspot</strong> och{' '}
            <strong>Moreflo · Northmill</strong> – två olika leverantörer med
            egna produkter, priser och artiklar. Allt du behöver göra är att
            klicka på det system du vill utforska. Du kan när som helst byta
            system längst upp till höger.
          </div>
        )}
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
  const [tab, setTab] = useState(() => {
    const saved = loadPersisted('pu_tab', 'hardware')
    return saved === 'softpos' ? 'kunder' : saved
  })
  const [filter, setFilter] = useState(() => loadPersisted('pu_filter', 'Alla'))
  const [zoomDevice, setZoomDevice] = useState(null)
  const [infoDevice, setInfoDevice] = useState(null)
  const [boZoom, setBoZoom] = useState(null)
  const [showSystemPicker, setShowSystemPicker] = useState(() => {
    try {
      return !window.localStorage.getItem('pu_brand')
    } catch {
      return true
    }
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [pkgLoad, setPkgLoad] = useState(null)

  const meta = brands[brand]

  useEffect(() => savePersisted('pu_brand', brand), [brand])
  useEffect(() => savePersisted('pu_tab', tab), [tab])
  useEffect(() => savePersisted('pu_filter', filter), [filter])
  useEffect(() => setBoZoom(null), [tab, brand])
  useEffect(() => {
    startCustomerSync()
    return () => stopCustomerSync()
  }, [])
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

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
    if (next === 'flo' && (tab === 'kunder' || tab === 'paket')) setTab('hardware')
  }

  const openCustomerInBuilder = (customer) => {
    setPkgLoad({
      id: customer.id,
      packageData: customer.packageData || null
    })
    setTab('paket')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navItems = [
    { id: 'hardware', icon: '📱', label: 'Hårdvara' },
    ...(brand === 'purspot' ? [{ id: 'paket', icon: '🧩', label: 'Paketbyggare' }] : []),
    ...(brand === 'purspot' ? [{ id: 'kunder', icon: '👥', label: 'Kunder' }] : []),
    { id: 'backoffice', icon: '⚙️', label: 'Backoffice' }
  ]

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
          <button
            type="button"
            className="nav-burger"
            onClick={() => setMenuOpen(true)}
            aria-label="Öppna meny"
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
          <div className="nav-right">
            <div className="nav-tabs">
              {navItems.map(t => (
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

      <div className="brand-seg" role="group" aria-label="Välj system">
        <button
          type="button"
          className={`brand-switch-btn ${brand === 'purspot' ? 'active' : ''}`}
          onClick={() => switchBrand('purspot')}
        >
          <span>💚</span> Purspot
        </button>
        <button
          type="button"
          className={`brand-switch-btn ${brand === 'flo' ? 'active' : ''}`}
          onClick={() => switchBrand('flo')}
        >
          <span>💜</span> Moreflo/Northmill
        </button>
      </div>

      {menuOpen && (
        <>
          <button className="drawer-backdrop" onClick={() => setMenuOpen(false)} aria-label="Stäng meny" />
          <nav className="topnav-drawer" aria-label="Huvudmeny" role="dialog" aria-modal="true">
            <button
              type="button"
              className="drawer-close"
              onClick={() => setMenuOpen(false)}
              aria-label="Stäng meny"
            >
              ✕
            </button>
            <div className="drawer-tabs">
              {navItems.map(t => (
                <button
                  key={t.id}
                  className={`drawer-tab ${tab === t.id ? 'active' : ''}`}
                  onClick={() => {
                    setTab(t.id)
                    setMenuOpen(false)
                    window.scrollTo({ top: 0 })
                  }}
                >
                  <span className="tab-icon">{t.icon}</span>
                  <span className="tab-label">{t.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </>
      )}

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
        {tab === 'paket' && <PackageBuilder loadFor={pkgLoad} onLoadHandled={() => setPkgLoad(null)} />}
        {tab === 'kunder' && <CustomerRegistry onOpenInPackageBuilder={openCustomerInBuilder} />}
        {tab === 'backoffice' && <BackofficeTab brand={brand} onZoom={setBoZoom} />}
      </main>

      <footer className="footer">
        {meta.footer} · {new Date().getFullYear()}
      </footer>

      <InfoModal device={infoDevice} brand={brand} onClose={() => setInfoDevice(null)} />
      <ImageLightbox device={zoomDevice} onClose={() => setZoomDevice(null)} />
      <GenericLightbox img={boZoom} onClose={() => setBoZoom(null)} />
    </div>
  )
}