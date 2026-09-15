// Fetch K2 mini and T2 mini JS chunks + PAX A920
const htmlPages = [
  ['k2mini', 'https://www.sunmi.com/en/k2-mini'],
  ['t2mini', 'https://www.sunmi.com/en/t2-mini/']
]

for (const [key, url] of htmlPages) {
  const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } })
  const html = await r.text()
  const chunks = [...html.matchAll(/_next\/static\/chunks\/pages\/([^"'\s]+\.js)/g)]
    .map(m => `https://static.cdn.sunmi.com/official-website/6.0.4/_next/static/chunks/pages/${m[1]}`)
    .filter(u => !u.includes('index') && !u.includes('about') && !u.includes('login'))
  
  console.log(`\n---- ${key} chunks:`, chunks.map(c => c.split('/').pop()))
  for (const chunk of chunks) {
    const cr = await fetch(chunk, { headers: { 'user-agent': 'Mozilla/5.0' } })
    const ct = await cr.text()
    const imgs = [...new Set([...ct.matchAll(/https?:\/\/file\.cdn\.sunmi\.com[^"'\s\\]+\.(?:jpg|png|webp)/g)].map(m => m[0]))]
      .filter(u => u.includes('/lg/'))
    if (imgs.length) {
      imgs.slice(0, 10).forEach(i => console.log('  ', i))
    }
  }
}

// PAX A920
console.log('\n---- PAX A920')
const paxUrls = [
  'https://www.paxtechnology.com/product/pax-a920/',
  'https://www.paxglobal.com/products/payment-terminals/pax-a920'
]
for (const u of paxUrls) {
  try {
    const r = await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } })
    const html = await r.text()
    const imgs = [...new Set([...html.matchAll(/https?:\/\/[^"'\s]+\.(?:jpg|png|webp)(?:\?[^"'\s]*)?/g)].map(m => m[0]))]
      .filter(u => u.includes('a920') || u.includes('A920'))
    console.log(`  ${u}: ${r.status}, imgs=${imgs.length}`)
    imgs.slice(0, 5).forEach(i => console.log('    ', i))
  } catch (e) {
    console.log(`  ${u}: ERR ${e.message}`)
  }
}
