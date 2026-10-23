// =============================================================
// Kundlagring (delad mellan säljare).
// -------------------------------------------------------------
// Data sparas alltid i localStorage som snabb cache. Den synkas
// dessutom mot en gemensam backend via /api/customers:
//   • Lokalt (npm run server): Vite proxar /api -> localhost:4001.
//   • Produktion (Netlify): /api/customers -> Netlify Function som
//     lagrar kundregistret i Netlify Blobs.
// Listan hämtas vid start och uppdateras med jämna mellanrum så att
// alla säljare ser samma kundregister. Ändringar skickas till API:t.
//
// Om API:t inte svarar fungerar appen ändå med lokal cache, och
// delar mellan flikar i samma webbläsare via BroadcastChannel.
// =============================================================

const CUSTOMERS_KEY = 'pu_customers_v1'

const API_URL = '/api/customers'

const SYNC_INTERVAL_MS = 15000

function makeId() {
  return 'cust_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11)
}

// -------------------------------------------------------------
// Namnfält. Kundnamn lagras som separata fält: firstName + lastName.
// Äldre poster som bara har `name` (och kontaktperson) normaliseras
// vid inläsning så att hela appen ser enhetlig data.
// -------------------------------------------------------------
function splitLegacyName(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { firstName: '', lastName: '' }
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  const lastName = parts.pop()
  return { firstName: parts.join(' '), lastName }
}

export function normalizeCustomer(customer) {
  if (!customer) return customer
  const { name, contactPerson, ...rest } = customer
  const split =
    customer.firstName !== undefined || customer.lastName !== undefined
      ? { firstName: customer.firstName || '', lastName: customer.lastName || '' }
      : splitLegacyName(name || contactPerson)
  return { ...rest, ...split }
}

export function customerFullName(customer) {
  if (!customer) return ''
  const full = [customer.firstName, customer.lastName].filter(Boolean).join(' ').trim()
  return full || customer.name || ''
}

// Mask för organisationsnummer: endast siffror, max 10 siffror och
// bindestreck automatiskt efter 6:e siffran (556800-1234).
// `prev` är det aktuella fältvärdet – används för att hantera
// backspace "fastnat" på bindestrecket: raderas bara strecket
// tolkas det som att användaren vill radera en siffra.
export function formatOrgNumber(value, prev = '') {
  const next = String(value == null ? '' : value)
  let digits = next.replace(/\D/g, '')
  const prevDigits = String(prev == null ? '' : prev).replace(/\D/g, '')
  // Backspace "fastnade" på bindestrecket (samma siffror kvar men ett
  // tecken kortare): tolka som önskad radering av senaste siffran.
  if (next.length < prev.length && digits.length > 0 && digits === prevDigits) {
    digits = digits.slice(0, -1)
  }
  digits = digits.slice(0, 10)
  if (digits.length <= 6) return digits
  return digits.slice(0, 6) + '-' + digits.slice(6)
}

function loadFromLocal() {
  try {
    const raw = window.localStorage.getItem(CUSTOMERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(normalizeCustomer) : []
  } catch {
    return []
  }
}

function persistLocal(customers) {
  try {
    window.localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers))
    return true
  } catch {
    return false
  }
}

let cache = loadFromLocal()
let listeners = []
let channel = null
let lastSerialized = JSON.stringify(cache)

if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    channel = new BroadcastChannel('pu_customers')
    channel.onmessage = () => {
      cache = loadFromLocal()
      lastSerialized = JSON.stringify(cache)
      emit()
    }
  } catch {
    channel = null
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === CUSTOMERS_KEY) {
      cache = loadFromLocal()
      lastSerialized = JSON.stringify(cache)
      emit()
    }
  })
}

function emit() {
  for (const cb of listeners) cb(cache)
}

function broadcast() {
  if (!channel) return
  try {
    channel.postMessage({ type: 'update' })
  } catch {
    // ignorera
  }
}

function commit(customers, silent) {
  cache = customers
  const serialized = JSON.stringify(customers)
  if (serialized === lastSerialized) return
  lastSerialized = serialized
  persistLocal(customers)
  emit()
  if (!silent) broadcast()
}

export function loadCustomers() {
  return cache
}

export function subscribeToCustomers(callback) {
  listeners.push(callback)
  callback(cache)
  return () => {
    listeners = listeners.filter((l) => l !== callback)
  }
}

export function getCustomer(id) {
  return cache.find((c) => c.id === id) || null
}

// -------------------------------------------------------------
// Backend-synk (valfritt). Alla anrop är "best effort" – misslyckas
// de fortsätter appen med lokal cache.
// -------------------------------------------------------------
async function apiRequest(method, path, body) {
  try {
    const res = await fetch(API_URL + (path || ''), {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    })
    if (!res.ok) return null
    if (res.status === 204) return true
    return await res.json()
  } catch {
    return null
  }
}

export async function syncFromServer() {
  const rawList = await apiRequest('GET')
  if (!Array.isArray(rawList)) return
  const list = rawList.map(normalizeCustomer)

  // Engångsmigrering: kunder som bara finns lokalt (skapade innan
  // den delade databasen togs i bruk) laddas upp till servern så att
  // de inte går förlorade.
  const MIGRATED_KEY = 'pu_customers_migrated'
  let migrated = false
  try {
    migrated = window.localStorage.getItem(MIGRATED_KEY) === '1'
  } catch {
    migrated = false
  }

  if (!migrated) {
    const serverIds = new Set(list.map((c) => c.id))
    const localOnly = cache.filter((c) => !serverIds.has(c.id))
    for (const c of localOnly) {
      await apiRequest('POST', '', c)
    }
    try {
      window.localStorage.setItem(MIGRATED_KEY, '1')
    } catch {
      // ignorera
    }
    if (localOnly.length) {
      const fresh = await apiRequest('GET')
      if (Array.isArray(fresh)) commit(fresh, true)
      return
    }
  }

  commit(list, true)
}

let syncTimer = null

export function startCustomerSync() {
  if (syncTimer) return
  syncFromServer()
  syncTimer = setInterval(syncFromServer, SYNC_INTERVAL_MS)
}

export function stopCustomerSync() {
  if (syncTimer) {
    clearInterval(syncTimer)
    syncTimer = null
  }
}

// -------------------------------------------------------------
// CRUD
// -------------------------------------------------------------
export function addCustomer(customer) {
  const normalized = normalizeCustomer(customer)
  const id = normalized.id || makeId()
  const newCustomer = {
    ...normalized,
    id,
    createdAt: normalized.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: normalized.status || 'Utkast'
  }
  commit([...cache, newCustomer])
  apiRequest('POST', '', newCustomer)
  return newCustomer
}

export function updateCustomer(id, updates) {
  const idx = cache.findIndex((c) => c.id === id)
  if (idx === -1) return null
  const updatedCustomer = normalizeCustomer({
    ...cache[idx],
    ...updates,
    updatedAt: new Date().toISOString()
  })
  const next = cache.slice()
  next[idx] = updatedCustomer
  commit(next)
  apiRequest('PUT', '/' + encodeURIComponent(id), updatedCustomer)
  return updatedCustomer
}

export function deleteCustomer(id) {
  const next = cache.filter((c) => c.id !== id)
  commit(next)
  apiRequest('DELETE', '/' + encodeURIComponent(id))
  return next
}

export function archiveCustomer(id) {
  return updateCustomer(id, { status: 'Arkiverad', archived: true })
}
