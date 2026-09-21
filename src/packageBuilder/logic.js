import { MODE_LABELS } from './rules'

// =============================================================
// Paketbyggare – ren logik, oberoende av UI.
// Alla funktioner tar emot `rules` (Purspot idag, Moreflo i
// framtiden) så att samma motor kör båda regelverken utan
// omskrivning av komponenterna.
// =============================================================

// Id:n för en roll: 'main' | 'express' | 'terminal' | 'accessory' | 'kassa'
export function getRoleIds(rules, role) {
  if (!rules) return []
  switch (role) {
    case 'main': return rules.mainRegisters || []
    case 'express': return rules.expressRegisters || []
    case 'terminal': return Object.keys(rules.terminals || {})
    case 'accessory': return Object.keys(rules.accessories || {})
    case 'kassa': return [...(rules.mainRegisters || []), ...(rules.expressRegisters || [])]
    default: return []
  }
}

// Har aktuellt val någon enhet ur rollen `role`?
export function hasRole(rules, role, selectedIds) {
  return getRoleIds(rules, role).some((id) => selectedIds.includes(id))
}

// Har tillbehörets krav uppfyllts? (räcker med ETT av requires-alternativen)
// Varje alternativ kan vara en ROLL ('main'|'express'|'terminal'|'accessory'|'kassa')
// eller ett DIREKT enhets-id (t.ex. 'v2s').
export function accessoryRequirementMet(rules, deviceId, selectedIds) {
  const acc = rules.accessories && rules.accessories[deviceId]
  if (!acc) return { ok: true, reason: null }
  const ok = (acc.requires || []).some((entry) => {
    const roleIds = getRoleIds(rules, entry)
    if (roleIds.length) return roleIds.some((id) => selectedIds.includes(id))
    return selectedIds.includes(entry)
  })
  return { ok, reason: ok ? null : acc.message }
}

// =============================================================
// Driftsätt (Läge A/B/C)
// =============================================================

// Vilka driftsätt är giltiga för en terminal givet nuvarande val?
export function getAvailableModes(rules, deviceId, selectedIds) {
  const terminal = rules.terminals && rules.terminals[deviceId]
  if (!terminal) return []
  return (terminal.modes || []).map((modeId) => {
    const dep = rules.modeDependencies && rules.modeDependencies[modeId]
    let allowed = true
    if (dep) allowed = hasRole(rules, dep.requires, selectedIds)
    const meta = MODE_LABELS[modeId] || { badge: modeId, label: modeId, desc: '' }
    return {
      id: modeId,
      badge: meta.badge,
      label: meta.label,
      desc: meta.desc,
      disabled: !allowed,
      reason: allowed ? null : (dep && dep.message)
    }
  })
}

// Standarddriftsätt för nytillagd enhet (första giltiga läge)
export function getDefaultMode(rules, deviceId, selectedIds) {
  const modes = getAvailableModes(rules, deviceId, selectedIds)
  if (!modes.length) return null
  const valid = modes.find((m) => !m.disabled)
  return valid ? valid.id : modes[0].id
}

// Status för valbar enhet: 'enabled' | 'disabled' (+ reason)
export function getDeviceStatus(rules, deviceId, selectedIds) {
  const terminal = rules.terminals && rules.terminals[deviceId]
  if (terminal) {
    const modes = getAvailableModes(rules, deviceId, selectedIds)
    if (!modes.length) return { state: 'disabled', reason: 'Inte tillgänglig med nuvarande val' }
    const enabled = modes.find((m) => !m.disabled)
    if (enabled) return { state: 'enabled', reason: null }
    const dep = rules.modeDependencies && rules.modeDependencies[modes[0].id]
    return { state: 'disabled', reason: (dep && dep.message) || 'Inte tillgänglig med nuvarande val' }
  }
  if (rules.accessories && rules.accessories[deviceId]) {
    const acc = accessoryRequirementMet(rules, deviceId, selectedIds)
    return { state: acc.ok ? 'enabled' : 'disabled', reason: acc.ok ? null : acc.reason }
  }
  return { state: 'enabled', reason: null }
}

// Ersätter/utökar getDeviceStatus: tar även hänsyn till vilken
// verksamhetstyp som är vald. En enhet som inte finns i
// verksamhetstypens lista gråmarkeras och blir ej valbar. Krav
// på tillbehör/terminaler (t.ex. "kräver en huvudkassa") gäller
// endast om den krävda rollen över huvud taget erbjuds av den
// valda verksamhetstypen.
export function getDeviceAvailability(rules, deviceId, businessId, selectedIds) {
  const biz =
    businessId && rules.businessTypes && rules.businessTypes[businessId]
      ? rules.businessTypes[businessId]
      : null
  const devices = biz ? biz.devices || [] : []
  const allowedByBusiness = !devices.length || devices.includes(deviceId)
  if (!allowedByBusiness) {
    return { state: 'disabled', reason: 'Ej tillgänglig för vald verksamhetstyp' }
  }

  const terminal = rules.terminals && rules.terminals[deviceId]
  if (terminal) {
    const modes = getAvailableModes(rules, deviceId, selectedIds)
    const enabled = modes.find((m) => !m.disabled)
    if (enabled) return { state: 'enabled', reason: null }
    return { state: 'disabled', reason: 'Inget giltigt driftsätt med nuvarande val' }
  }

  const acc = rules.accessories && rules.accessories[deviceId]
  if (acc) {
    // Verksamhetstyp kan ha "tillbehör alltid valbara" – då finns inga krav
    if (biz && biz.accessoriesUnconditional) return { state: 'enabled', reason: null }
    for (const entry of acc.requires || []) {
      const roleIds = getRoleIds(rules, entry)
      if (roleIds.length) {
        const offered = roleIds.some((id) => devices.includes(id))
        const satisfied = roleIds.some((id) => selectedIds.includes(id))
        if (offered && !satisfied) {
          return { state: 'disabled', reason: acc.message }
        }
      } else {
        const offered = devices.includes(entry)
        const satisfied = selectedIds.includes(entry)
        if (offered && !satisfied) {
          return { state: 'disabled', reason: acc.message }
        }
      }
    }
    return { state: 'enabled', reason: null }
  }

  return { state: 'enabled', reason: null }
}

// =============================================================
// Reconcile – justerar valet så att det alltid är giltigt:
//  - terminaler med ogiltigt driftsätt återställs till första
//    giltiga läget, eller tas bort om inget läge är giltigt.
//  - övriga enheter (kassa/express/tillbehör) behålls med 'on'.
//    (Antal ligger i en separat `quantities`-map.)
// Returnerar nytt val + enheter som togs bort (för avisering).
// =============================================================
export function reconcileSelection(rules, selected, businessId) {
  const ids = Object.keys(selected || {})
  const allowed =
    businessId && rules.businessTypes && rules.businessTypes[businessId]
      ? rules.businessTypes[businessId].devices
      : null
  const next = {}
  const drops = []
  for (const id of ids) {
    if (allowed && !allowed.includes(id)) {
      drops.push(id)
      continue
    }
    const terminal = rules.terminals && rules.terminals[id]
    if (terminal) {
      const modes = getAvailableModes(rules, id, ids)
      if (modes.some((m) => !m.disabled && m.id === selected[id])) {
        next[id] = selected[id]
        continue
      }
      const valid = modes.find((m) => !m.disabled)
      if (valid) next[id] = valid.id
      else drops.push(id)
      continue
    }
    next[id] = 'on'
  }
  return { selection: next, drops }
}

// =============================================================
// Gruppera valet i roller för sammanställningen
// =============================================================
const GROUP_TITLES = {
  main: 'Huvudkassor',
  express: 'Expresskassor',
  terminal: 'Kortterminaler',
  accessory: 'Tillbehör'
}
const GROUP_ORDER = ['main', 'express', 'terminal', 'accessory']

export function groupSelection(rules, selected) {
  const ids = Object.keys(selected || {})
  const groups = GROUP_ORDER.map((role) => ({
    role,
    title: GROUP_TITLES[role],
    items: getRoleIds(rules, role)
      .filter((id) => ids.includes(id))
      .map((id) => ({ id, mode: selected[id] }))
  }))
  return groups.filter((g) => g.items.length)
}

// Sortera enhetslista i gruppordning för nätet
export function sortDevicesByRole(rules, deviceIds) {
  const rank = {}
  GROUP_ORDER.forEach((role, i) => {
    getRoleIds(rules, role).forEach((id) => { if (rank[id] === undefined) rank[id] = i })
  })
  return [...deviceIds].sort((a, b) => (rank[a] ?? 99) - (rank[b] ?? 99))
}
