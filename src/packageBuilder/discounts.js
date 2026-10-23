// =============================================================
// Rabattlogik – delas av Paketbyggaren och Kundregistret.
//
// Datastruktur (sparas som `discounts` i packageData på kunden):
//   {
//     items: { [deviceId]: { type: 'percent' | 'fixed', value: number } },
//     total: { type: 'percent' | 'fixed', value: number } | null
//   }
// - 'percent' räknas på ordinarie radpris (skalar med antal)
// - 'fixed'   = fast avdrag i kr (kr/mån för månadsrader, kr för
//   engångsköpsrader) och dras av på hela raden
// =============================================================

function cleanDiscount(d) {
  if (!d || typeof d !== 'object') return null
  const value = Number(d.value)
  if (!Number.isFinite(value) || value <= 0) return null
  const type = d.type === 'fixed' ? 'fixed' : 'percent'
  return { type, value: type === 'percent' ? Math.min(value, 100) : value }
}

// Säker inläsning av sparad rabattdata (äldre paket saknar fältet).
export function normalizeDiscounts(raw) {
  const out = { items: {}, total: null }
  if (!raw || typeof raw !== 'object') return out
  if (raw.items && typeof raw.items === 'object') {
    for (const id of Object.keys(raw.items)) {
      const d = cleanDiscount(raw.items[id])
      if (d) out.items[id] = d
    }
  }
  out.total = cleanDiscount(raw.total)
  return out
}

// Beloppet som dras av på en rad (ordinarie radpris in, rabatt ut).
// Procent multiplicerar med radens pris; fast belopp är redan per rad.
// Returen är alltid inom 0..regular.
export function discountAmount(regular, discount) {
  const d = cleanDiscount(discount)
  if (!d || !regular) return 0
  const raw = d.type === 'percent' ? (regular * d.value) / 100 : d.value
  return Math.min(Math.max(raw, 0), regular)
}

// Kort visningsetikett: "−13%" eller "−50 kr".
export function discountLabel(discount) {
  const d = cleanDiscount(discount)
  if (!d) return null
  if (d.type === 'percent') return `−${Math.round(d.value)}%`
  return `−${Math.round(d.value).toLocaleString('sv-SE')} kr`
}

// Summerar en radlista ({ contract, regular, discount }) med valfri
// totalrabatt. Procent på totalen gäller både månad och engångsköp;
// fast totalrabatt (kr/mån) dras av på månadsdelen – eller på
// engångsköpet om paketet saknar månadspriser.
export function summarizeRows(rows, totalDiscount) {
  const s = {
    regularMonthly: 0,
    regularBuy: 0,
    rowDiscountMonthly: 0,
    rowDiscountBuy: 0,
    afterRowsMonthly: 0,
    afterRowsBuy: 0,
    totalDiscountMonthly: 0,
    totalDiscountBuy: 0,
    finalMonthly: 0,
    finalBuy: 0
  }
  for (const r of rows || []) {
    const regular = r.regular || 0
    if (r.contract === 'buy') {
      s.regularBuy += regular
      s.rowDiscountBuy += discountAmount(regular, r.discount)
    } else {
      s.regularMonthly += regular
      s.rowDiscountMonthly += discountAmount(regular, r.discount)
    }
  }
  s.afterRowsMonthly = s.regularMonthly - s.rowDiscountMonthly
  s.afterRowsBuy = s.regularBuy - s.rowDiscountBuy

  const total = cleanDiscount(totalDiscount)
  if (total) {
    if (total.type === 'percent') {
      s.totalDiscountMonthly = discountAmount(s.afterRowsMonthly, total)
      s.totalDiscountBuy = discountAmount(s.afterRowsBuy, total)
    } else if (s.afterRowsMonthly > 0) {
      s.totalDiscountMonthly = Math.min(total.value, s.afterRowsMonthly)
    } else {
      s.totalDiscountBuy = Math.min(total.value, s.afterRowsBuy)
    }
  }
  s.finalMonthly = Math.max(s.afterRowsMonthly - s.totalDiscountMonthly, 0)
  s.finalBuy = Math.max(s.afterRowsBuy - s.totalDiscountBuy, 0)
  return s
}
