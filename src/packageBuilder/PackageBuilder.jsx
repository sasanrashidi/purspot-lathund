import React, { useState, useEffect } from 'react'
import { resolveRules } from './rules'
import { reconcileSelection, getDefaultMode, sortDevicesByRole, groupSelection } from './logic'
import { normalizeDiscounts } from './discounts'
import { devices as deviceCatalog } from '../data'
import BusinessSelector from './BusinessSelector'
import DevicePicker from './DevicePicker'
import PackageSummary from './PackageSummary'
import SaveToCustomer from './SaveToCustomer'

// =============================================================
// Tillstånds-persistens – Paketbyggarens val sparas i
// localStorage så de inte nollställs vid siduppdateringar eller
// när man navigerar till en annan sektion och tillbaka.
// =============================================================
const PKG_PREFIX = 'pkg_'

function pkgLoad(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PKG_PREFIX + key)
    if (raw === null || raw === undefined) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function pkgSave(key, value) {
  try {
    window.localStorage.setItem(PKG_PREFIX + key, JSON.stringify(value))
  } catch {
    // localStorage otillgänglig – ignorera tyst
  }
}

// =============================================================
// Paketbyggare – container (tillstånd + kopplar ihop stegen).
// App.jsx renderar <PackageBuilder /> i "Paket"-fliken.
//
// Flöde:
//   1. Välj verksamhetstyp (BusinessSelector)
//   2. Välj enheter + driftsätt (DevicePicker <-> ModePicker)
//   3. Reconcile – håller valet giltigt när regler/verksamhet
//      ändras, och noterar enheter som togs bort.
//   4. Sammanställning (PackageSummary)
//
// Allt tillstånd ligger här; komponenterna nedan är kontrollerade
// och tar emot `rules`, `selected` (objekt id -> mode) samt
// återanropsfunktioner. Inga regler hårdkodas i UI:t.
// =============================================================
export default function PackageBuilder({ loadFor, onLoadHandled }) {
  const rules = resolveRules('purspot')
  const [businessId, setBusinessId] = useState(() => pkgLoad('businessId', firstBusinessId(rules)))
  const [selected, setSelected] = useState(() => pkgLoad('selected', {}))
  const [quantities, setQuantities] = useState(() => {
    const saved = pkgLoad('quantities', {})
    const sel = pkgLoad('selected', {})
    const migrated = { ...saved }
    for (const id of Object.keys(sel)) {
      const v = sel[id]
      if (typeof v === 'number' && v >= 1 && migrated[id] === undefined) migrated[id] = v
    }
    return migrated
  })
  const [contracts, setContracts] = useState(() => pkgLoad('contracts', {}))
  const [discounts, setDiscounts] = useState(() => normalizeDiscounts(pkgLoad('discounts', null)))
  const [linkedCustomerId, setLinkedCustomerId] = useState(() => pkgLoad('linkedCustomerId', ''))

  useEffect(() => pkgSave('businessId', businessId), [businessId])
  useEffect(() => pkgSave('selected', selected), [selected])
  useEffect(() => pkgSave('quantities', quantities), [quantities])
  useEffect(() => pkgSave('contracts', contracts), [contracts])
  useEffect(() => pkgSave('discounts', discounts), [discounts])
  useEffect(() => pkgSave('linkedCustomerId', linkedCustomerId), [linkedCustomerId])

  // Ladda ett kundpaket ("Öppna i Paketbyggare" från Kundregistret).
  useEffect(() => {
    if (!loadFor) return
    if (loadFor.packageData) {
      const pd = loadFor.packageData
      const nextBusiness = pd.businessId || firstBusinessId(rules)
      const res = reconcileSelection(rules, pd.selected || {}, nextBusiness)
      setBusinessId(nextBusiness)
      setSelected(res.selection)
      setQuantities(pd.quantities || {})
      setContracts(pd.contracts || {})
      setDiscounts(normalizeDiscounts(pd.discounts))
    }
    if (loadFor.id) setLinkedCustomerId(loadFor.id)
    if (onLoadHandled) onLoadHandled()
  }, [loadFor])

  // =========================================================
  // Reconcile – applicerar en förändring och låter logiken
  // städa valet (tar bort ogiltiga enheter/driftsätt). Antal
  // och köpform för borttagna enheter rensas i takt med valet.
  // =========================================================
  function applyChange(nextSelected, nextBusinessId) {
    const res = reconcileSelection(rules, nextSelected, nextBusinessId)
    setSelected(res.selection)
    setQuantities((prev) => {
      const next = {}
      for (const id of Object.keys(prev || {})) {
        if (res.selection[id] !== undefined) next[id] = prev[id]
      }
      return next
    })
    setContracts((prev) => {
      const next = {}
      for (const id of Object.keys(prev || {})) {
        if (res.selection[id] !== undefined) next[id] = prev[id]
      }
      return next
    })
    setDiscounts((prev) => {
      const nextItems = {}
      for (const id of Object.keys(prev.items || {})) {
        if (res.selection[id] !== undefined) nextItems[id] = prev.items[id]
      }
      return { items: nextItems, total: prev.total }
    })
  }

  // ---------------------------------------------------------
  // 1. Byt verksamhetstyp → rekonciliera hela valet mot de
  //    nya reglerna (t.ex. event tar bort kassalådor).
  // ---------------------------------------------------------
  function handleBusinessChange(id) {
    setBusinessId(id)
    applyChange(selected, id)
  }

  // ---------------------------------------------------------
  // 2a. Lägg till / ta bort en enhet.
  // Kortterminaler får ett giltigt driftsätt direkt vid tillägg
  // (ModePicker justerar det i efterhand).
  // ---------------------------------------------------------
  function handleToggleDevice(deviceId) {
    const isSelected = selected[deviceId] !== undefined
    const isTerminal = Boolean(rules.terminals && rules.terminals[deviceId])

    if (isSelected) {
      const next = { ...selected }
      delete next[deviceId]
      applyChange(next, businessId)
      return
    }

    if (isTerminal) {
      const mode = getDefaultMode(rules, deviceId, Object.keys(selected))
      if (!mode) return // inget giltigt driftsätt just nu
      applyChange({ ...selected, [deviceId]: mode }, businessId)
      return
    }

    applyChange({ ...selected, [deviceId]: 'on' }, businessId)
  }

  // 2b. Sätt driftsätt (A/B/C) för en specifik terminal.
  function handleSetMode(deviceId, mode) {
    applyChange({ ...selected, [deviceId]: mode }, businessId)
  }

  // 2c. Ändra antal för en enhet (qty <= 0 tar bort den).
  function handleQtyChange(deviceId, qty) {
    if (qty <= 0) {
      const next = { ...selected }
      delete next[deviceId]
      applyChange(next, businessId)
      return
    }
    setQuantities((prev) => ({ ...prev, [deviceId]: qty }))
    if (selected[deviceId] === undefined) handleToggleDevice(deviceId)
  }

  // 2d. Ta bort en enhet direkt från Paketöversikten.
  function handleRemove(deviceId) {
    const next = { ...selected }
    delete next[deviceId]
    applyChange(next, businessId)
  }

  // 2e. Välj köpform per enhet: 'buy' (direktköp) eller '48' (48 mån avtal).
  function handleContractChange(deviceId, contract) {
    setContracts((prev) => ({ ...prev, [deviceId]: contract }))
  }

  // 2f. Sätt/ta bort rad-rabatt för en enhet (null tar bort rabatten).
  function handleItemDiscount(deviceId, discount) {
    setDiscounts((prev) => {
      const items = { ...prev.items }
      if (discount) items[deviceId] = discount
      else delete items[deviceId]
      return { ...prev, items }
    })
  }

  // 2g. Sätt/ta bort totalrabatt på hela paketet (null tar bort).
  function handleTotalDiscount(discount) {
    setDiscounts((prev) => ({ ...prev, total: discount }))
  }

  const selectedCount = Object.keys(selected).length
  const orderedIds = sortDevicesByRole(rules, Object.keys(selected))
  const deviceById = {}
  for (const d of deviceCatalog) deviceById[d.id] = d
  const groups = groupSelection(rules, selected).map((g) => ({
    ...g,
    items: g.items.map((item) => {
      const meta = deviceById[item.id] || {}
      return {
        ...item,
        name: meta.model || item.id,
        qty: quantities[item.id] || 1,
        buyPrice: meta.buyPrice || 0,
        monthly48: meta.monthly48 || 0,
        contract: contracts[item.id] || (meta.monthly48 ? '48' : 'buy')
      }
    })
  }))

  const businessMeta =
    (rules.businessTypes && rules.businessTypes[businessId]) || {}

  return (
    <div className="pkg-container">
      <main className="pkg-main">
        <BusinessSelector
          rules={rules}
          value={businessId}
          onChange={handleBusinessChange}
        />

        <DevicePicker
          rules={rules}
          businessId={businessId}
          devices={deviceCatalog}
          selected={selected}
          quantities={quantities}
          contracts={contracts}
          onToggle={handleToggleDevice}
          onSetMode={handleSetMode}
          onSetQty={handleQtyChange}
          onSetContract={handleContractChange}
        />
      </main>

      <aside className="pkg-side">
        <PackageSummary
          groups={groups}
          businessType={businessMeta}
          onRemove={handleRemove}
          discounts={discounts}
          onItemDiscount={handleItemDiscount}
          onTotalDiscount={handleTotalDiscount}
        />

        <SaveToCustomer
          businessId={businessId}
          selected={selected}
          quantities={quantities}
          contracts={contracts}
          discounts={discounts}
          linkedCustomerId={linkedCustomerId}
          onLinkedCustomerChange={setLinkedCustomerId}
        />
      </aside>
    </div>
  )
}

// =============================================================
// Hjälp – första verksamhetstypen ur reglerna blir förvald.
// =============================================================
function firstBusinessId(rules) {
  const types = (rules && rules.businessTypes) || {}
  return Object.keys(types)[0] || 'restaurant'
}
