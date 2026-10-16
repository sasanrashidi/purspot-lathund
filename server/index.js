// =============================================================
// Delad kunddatabas – enkel Node-server utan externa beroenden.
// -------------------------------------------------------------
// Startas med:  npm run server
// Lyssnar på port 4001 (matchar Vite-proxyn i vite.config.js).
// Alla säljare som kör appen mot samma server ser samma kunder.
//
// Data sparas i server/data/customers.json så att den överlever
// omstarter och kan säkerhetskopieras/delas via fil.
//
// API:
//   GET    /api/customers        -> lista alla kunder
//   POST   /api/customers        -> skapa kund
//   PUT    /api/customers/:id    -> uppdatera kund
//   DELETE /api/customers/:id    -> ta bort kund
//   GET    /api/health           -> status
// =============================================================

import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'data')
const DATA_FILE = path.join(DATA_DIR, 'customers.json')
const PORT = process.env.PORT || 4001

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8')
}

function readCustomers() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeCustomers(customers) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(customers, null, 2), 'utf8')
}

function normalizeCustomer(customer) {
  if (!customer || typeof customer !== 'object') return customer
  const { name, contactPerson, ...rest } = customer
  const hasSplit = rest.firstName !== undefined || rest.lastName !== undefined
  if (hasSplit) return { ...rest, firstName: rest.firstName || '', lastName: rest.lastName || '' }
  const n = String(name || contactPerson || '').trim()
  const parts = n.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { ...rest, firstName: '', lastName: '' }
  if (parts.length === 1) return { ...rest, firstName: parts[0], lastName: '' }
  const last = parts.pop()
  return { ...rest, firstName: parts.join(' '), last: last, lastName: last }
}

function send(res, status, body) {
  const payload = body === undefined ? '' : JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  })
  res.end(payload)
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
      if (data.length > 5e6) req.destroy()
    })
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {})
      } catch {
        resolve({})
      }
    })
  })
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const { pathname } = url

  if (req.method === 'OPTIONS') return send(res, 204)

  if (pathname === '/api/health') {
    return send(res, 200, { ok: true, count: readCustomers().length })
  }

  if (pathname === '/api/customers') {
    if (req.method === 'GET') {
      return send(res, 200, readCustomers())
    }
    if (req.method === 'POST') {
      const body = await readBody(req)
      const customers = readCustomers()
      const now = new Date().toISOString()
  const customer = normalizeCustomer({
    ...body,
    id: body.id || makeId(),
    createdAt: body.createdAt || now,
    updatedAt: now,
    status: body.status || 'Utkast'
  })
      const existing = customers.findIndex((c) => c.id === customer.id)
      if (existing !== -1) customers[existing] = customer
      else customers.push(customer)
      writeCustomers(customers)
      return send(res, 201, customer)
    }
  }

  const match = pathname.match(/^\/api\/customers\/(.+)$/)
  if (match) {
    const id = decodeURIComponent(match[1])
    const customers = readCustomers()
    const idx = customers.findIndex((c) => c.id === id)

    if (req.method === 'PUT') {
      if (idx === -1) return send(res, 404, { error: 'not found' })
      const body = await readBody(req)
      customers[idx] = { ...customers[idx], ...body, id, updatedAt: new Date().toISOString() }
      writeCustomers(customers)
      return send(res, 200, customers[idx])
    }

    if (req.method === 'DELETE') {
      if (idx === -1) return send(res, 404, { error: 'not found' })
      customers.splice(idx, 1)
      writeCustomers(customers)
      return send(res, 204)
    }
  }

  send(res, 404, { error: 'not found' })
})

ensureStore()
server.listen(PORT, () => {
  console.log(`Kundregister-API körs på http://localhost:${PORT}/api/customers`)
})
