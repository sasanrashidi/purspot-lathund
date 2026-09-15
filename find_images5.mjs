const pages = [
  ['v2s', 'https://www.jarltech.com/en/sunmi-v2s'],
  ['k2mini', 'https://shopnfc.com/en/sunmi-nfc-terminals/607-sunmi-t3-pro-desktop-pos-one-screen-156.html'],
  ['t2mini', 'https://www.concept.biz/en/p/sunmi-t2-mini'],
  ['d3mini', 'https://www.jarltech.com/en/sunmi-d3-mini'],
  ['t3pro', 'https://shopnfc.com/en/sunmi-nfc-terminals/607-sunmi-t3-pro-desktop-pos-one-screen-156.html'],
  ['t2s', 'https://www.jarltech.com/en/sunmi-t2s-0']
]

for (const [key, url] of pages) {
  try {
    const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }, redirect: 'follow' })
    const t = await r.text()
    const openGraph = t.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1]
    const alt = t.match(/<meta[^>]+property=["']og:image:alt["'][^>]+content=["']([^"']+)["']/i)?.[1]
    const imgs = [...new Set([...t.matchAll(/https?:\/\/[^"'\s]+\.(?:jpg|jpeg|png|webp)(?:\?[^"'\s]*)?/g)].map(m => m[0]))]
      .filter(u => !/(logo|icon|badge|payment|favicon|loader|spinner)/i.test(u))
    console.log(`\n---- ${key} (${r.status})$`)
    console.log('  OG:', openGraph)
    imgs.slice(0, 10).forEach(i => console.log('  ', i))
  } catch (e) {
    console.log(`\n---- ${key} ERR: ${e.message}`)
  }
}