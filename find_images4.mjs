// K2 mini and T2 mini chunks - find any http URLs with image extensions
const chunks = [
  ['k2mini', 'https://static.cdn.sunmi.com/official-website/6.0.4/_next/static/chunks/pages/k2-mini-9893b53b0d9e1e08.js'],
  ['t2mini', 'https://static.cdn.sunmi.com/official-website/6.0.4/_next/static/chunks/pages/t2-mini-6250aff1581036dc.js']
]

for (const [key, url] of chunks) {
  const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } })
  const t = await r.text()
  // find all URLs
  const urls = [...new Set([...t.matchAll(/https?:\/\/[^"'\\\s]+/g)].map(m => m[0]))]
  const imgs = urls.filter(u => /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(u))
  console.log(`\n---- ${key}: ${t.length} chars, ${urls.length} urls, ${imgs.length} img-like`)
  imgs.slice(0, 20).forEach(u => console.log('  ', u.slice(0, 150)))
  
  // Also look for src!= image URLs but store as data: or relative paths
  const rel = urls.filter(u => u.includes('/products/') && !/\.(js|json|css|xml)$/i.test(u))
  console.log(`  product-path urls: ${rel.length}`)
  rel.slice(0, 15).forEach(u => console.log('  REL:', u.slice(0, 150)))
}