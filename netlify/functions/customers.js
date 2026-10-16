// =============================================================
// Delad kunddatabas för Netlify – serverless funktion.
// -------------------------------------------------------------
// Lagrar kundregistret i Netlify Blobs så att ALLA säljare ser
// samma data, oavsett webbläsare. Ingen extern tjänst behövs.
//
// Varje kund sparas under sin egen nyckel (id) vilket gör att
// samtidiga skrivningar från olika säljare inte skriver över
// varandra.
//
// Anropas via /api/customers (se redirects i netlify.toml):
//   GET    /api/customers        -> lista alla kunder
//   POST   /api/customers        -> skapa/uppdatera kund
//   PUT    /api/customers/:id    -> uppdatera kund
//   DELETE /api/customers/:id    -> ta bort kund
// =============================================================

import { getStore } from '@netlify/blobs'

const STORE_NAME = 'customers'

function store() {
  return getStore(STORE_NAME)
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: body === undefined ? '' : JSON.stringify(body)
  }
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
  return { ...rest, firstName: parts.join(' '), lastName: last }
}

function parseBody(event) {
  if (!event.body) return {}
  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : event.body
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function parseId(event) {
  const path = event.path || ''
  const parts = path.split('/').filter(Boolean)
  const idx = parts.lastIndexOf('customers')
  return idx >= 0 && parts[idx + 1] ? decodeURIComponent(parts[idx + 1]) : null
}

async function getCustomer(id) {
  return store().get(id, { type: 'json' })
}

async function readAll() {
  const { blobs } = await store().list()
  const items = await Promise.all(
    blobs.map((b) => store().get(b.key, { type: 'json' }).catch(() => null))
  )
  return items.filter(Boolean)
}

async function saveCustomer(customer) {
  await store().setJSON(customer.id, customer)
  return customer
}

export async function handler(event) {
  const method = event.httpMethod

  if (method === 'OPTIONS') return json(204)

  const id = parseId(event)

  try {
    if (method === 'GET') {
      return json(200, await readAll())
    }

    if (method === 'POST') {
      const body = parseBody(event)
      const now = new Date().toISOString()
      const existing = body.id ? await getCustomer(body.id).catch(() => null) : null
      const customer = normalizeCustomer({
        ...(existing || {}),
        ...body,
        id: body.id || (existing && existing.id) || makeId(),
        createdAt: (existing && existing.createdAt) || body.createdAt || now,
        updatedAt: now,
        status: body.status || (existing && existing.status) || 'Utkast'
      })
      await saveCustomer(customer)
      return json(201, customer)
    }

    if (method === 'PUT') {
      if (!id) return json(400, { error: 'missing id' })
      const body = parseBody(event)
      const existing = await getCustomer(id).catch(() => null)
      if (!existing) return json(404, { error: 'not found' })
      const customer = normalizeCustomer({ ...existing, ...body, id, updatedAt: new Date().toISOString() })
      await saveCustomer(customer)
      return json(200, customer)
    }

    if (method === 'DELETE') {
      if (!id) return json(400, { error: 'missing id' })
      await store().delete(id)
      return json(204)
    }

    return json(405, { error: 'method not allowed' })
  } catch (err) {
    return json(500, { error: String(err && err.message ? err.message : err) })
  }
}
