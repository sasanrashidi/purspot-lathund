// Direct fetch of K2 mini and T2 mini chunks
const chunks = [
  ['k2mini', 'https://static.cdn.sunmi.com/official-website/6.0.4/_next/static/chunks/pages/k2-mini-9893b53b0d9e1e08.js'],
  ['t2mini', 'https://static.cdn.sunmi.com/official-website/6.0.4/_next/static/chunks/pages/t2-mini-6250aff1581036dc.js']
]

for (const [key, url] of chunks) {
  const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } })
  const ct = await r.text()
  const all = [...new Set([...ct.matchAll(/https?:\/\/file\.cdn\.sunmi\.com[^"'\s\\]+\.(?:jpg|png|webp|mp4)/g)].map(m => m[0]))]
  console.log(`\n---- ${key} (${ct.length} chars) all imgs: ${all.length}`)
  all.forEach(i => console.log('  ', i))
}

// PAX - try alternative sources
console.log('\n---- PAX A920 alternative')
const paxAlt = [
  'https://www.paxpayglobal.com/products/pax-a920',
  'https://www.paxau.com/products/payment-terminals/pax-a920'
]
for (const u of paxAlt) {
  try {
    const r = await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }, redirect: 'follow' })
    const html = await r.text()
    const imgs = [...new Set([...html.matchAll(/https?:\/\/[^"'\s]+\.(?:jpg|png|webp)(?:\?[^"'\s]*)?/g)].map(m => m[0]))]
    console.log(`  ${u}: ${r.status} (${html.length})`)
    imgs.slice(0, 3).forEach(i => console.log('    ', i))
  } catch (e) { console.log(`  ${u}: ERR`) }
}

// Try Pixabay/Pexels for PAX A920
console.log('\n---- PAX A920 websearch hint')
const sr = await fetch('https://en.wikipedia.org/wiki/PAX_Technology', { headers: { 'user-agent': 'Mozilla/5.0' } }).catch(e => null)
if (sr) {
  const t = await sr.text()
  const paxImgs = [...t.matchAll(/https?:\/\/[^"'\s]+(?:a920|A920)[^"'\s]+\.(?:jpg|png)/g)].map(m => m[0])
  console.log('  wiki imgs:', paxImgs)
}
