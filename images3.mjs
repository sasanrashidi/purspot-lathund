// 1. Test SUNMI CDN candidates for k2-mini
const k2Candidates = [
  'p1-bg-n.jpg', 'p1-1.jpg', 'p2-1.jpg', 'p3-1.jpg', 'sunmi-home-1-n.jpg',
  'sunmi-home-2.jpg', 'p4-1.jpg', 'p5-1.jpg', 'p1-bg.jpg', 'p2-bg.jpg'
]
console.log('== K2 MINI SUNMI CDN candidates ==')
for (const f of k2Candidates) {
  const u = `https://file.cdn.sunmi.com/newebsite/products/k2-mini/lg/${f}`
  try {
    const r = await fetch(u, { method: 'HEAD', headers: { 'user-agent': 'Mozilla/5.0' } })
    const len = r.headers.get('content-length')
    console.log(`  ${r.status} ${len || '?'} ${f}`)
  } catch (e) {
    console.log(`  ERR ${f}`)
  }
}

// 2. PAX A920 - fetch product page images
console.log('\n== PAX A920 images ==')
try {
  const r = await fetch('https://www.pax.us/product/a920', { headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } })
  const t = await r.text()
  const imgs = [...new Set([...t.matchAll(/https?:\/\/[^"'\s]+\.(?:jpg|jpeg|png|webp)(?:\?[^"'\s]*)?/g)].map(m => m[0]))]
    .filter(u => /(a920|A920|payment)/.test(u) && !/logo|icon/i.test(u))
  console.log('  status:', r.status, 'imgs:', imgs.length)
  imgs.slice(0, 12).forEach(i => console.log('  ', i))
} catch (e) {
  console.log('  ERR', e.message)
}

// 3. Verify other SUNMI CDN picks
console.log('\n== Verify others ==')
const checks = [
  ['v2s', 'https://file.cdn.sunmi.com/newebsite/products/v2s/lg/preview-base.jpg'],
  ['flex3', 'https://file.cdn.sunmi.com/newebsite/products/flex-3/lg/p10-1-2.jpg'],
  ['d3mini', 'https://file.cdn.sunmi.com/newebsite/products/d3-mini/lg/p3-1-1.jpg'],
  ['p3', 'https://file.cdn.sunmi.com/newebsite/products/p3-family/lg/s5-0.jpg']
]
for (const [k, u] of checks) {
  const r = await fetch(u, { method: 'HEAD', headers: { 'user-agent': 'Mozilla/5.0' } })
  console.log(`  ${k}: ${r.status} ${r.headers.get('content-length')}`)
}