const pages = [
  ['v2s', 'https://www.sunmi.com/en/v2s/'],
  ['flex3', 'https://www.sunmi.com/en/flex-3/'],
  ['k2mini', 'https://www.sunmi.com/en/k2-mini'],
  ['t2mini', 'https://www.sunmi.com/en/t2-mini/'],
  ['t3pro', 'https://www.sunmi.com/en/t3-pro-series'],
  ['d3mini', 'https://www.sunmi.com/en/d3-mini'],
  ['p3family', 'https://www.sunmi.com/en/p3-family']
]

for (const [key, url] of pages) {
  try {
    const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } })
    const html = await r.text()
    const og = html.match(/og:image["\s]+content="([^"]+)"/)?.[1] || null
    const cdnImages = [...new Set([...html.matchAll(/https:\/\/(?:cdn|static)\.sunmi\.com[^"')\s>]+\.(?:png|jpg|webp)/g)].map(m => m[0]))]
    console.log(`---- ${key} (${r.status}) og=${og}`)
    if (og) console.log('  OG:', og)
    cdnImages.slice(0, 8).forEach(i => console.log('  CDN:', i))
  } catch (e) {
    console.log(`---- ${key} ERR: ${e.message}`)
  }
}
