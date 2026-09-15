const pages = [
  ['v2s', 'https://static.cdn.sunmi.com/official-website/6.0.4/_next/static/chunks/pages/v2s-d071e63a62d41028.js'],
  ['flex3', 'https://static.cdn.sunmi.com/official-website/6.0.4/_next/static/chunks/pages/flex-3*.js'],
  ['k2mini', 'https://static.cdn.sunmi.com/official-website/6.0.4/_next/static/chunks/pages/k2-mini*.js'],
  ['t2mini', 'https://static.cdn.sunmi.com/official-website/6.0.4/_next/static/chunks/pages/t2-mini*.js'],
  ['t3pro', 'https://static.cdn.sunmi.com/official-website/6.0.4/_next/static/chunks/pages/t3-pro*.js'],
  ['d3mini', 'https://static.cdn.sunmi.com/official-website/6.0.4/_next/static/chunks/pages/d3-mini*.js'],
  ['p3family', 'https://static.cdn.sunmi.com/official-website/6.0.4/_next/static/chunks/pages/p3-family*.js']
]

// First get all page HTMLs to find the JS chunk filenames
const htmlPages = [
  ['v2s', 'https://www.sunmi.com/en/v2s/'],
  ['flex3', 'https://www.sunmi.com/en/flex-3/'],
  ['k2mini', 'https://www.sunmi.com/en/k2-mini'],
  ['t2mini', 'https://www.sunmi.com/en/t2-mini/'],
  ['t3pro', 'https://www.sunmi.com/en/t3-pro-series'],
  ['d3mini', 'https://www.sunmi.com/en/d3-mini'],
  ['p3family', 'https://www.sunmi.com/en/p3-family'],
  ['a920', 'https://www.paxtechnology.com/product/pax-a920/']
]

for (const [key, url] of htmlPages) {
  try {
    const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } })
    const html = await r.text()
    
    // Find all chunk JS files for this page
    const chunks = [...html.matchAll(/_next\/static\/chunks\/pages\/([^"'\s]+\.js)/g)].map(m => `https://static.cdn.sunmi.com/official-website/6.0.4/_next/static/chunks/pages/${m[1]}`)
    
    // Find product-specific images directly from HTML (for non-Next.js pages)
    const htmlImgs = [...new Set([...html.matchAll(/https?:\/\/[^"'\s]+\.(?:jpg|png|webp)(?:\?[^"'\s]*)?/g)].map(m => m[0]))]
      .filter(u => !u.includes('logo') && !u.includes('icon/') && !u.includes('home-1') && !u.includes('home-2') && !u.includes('home-3') && !u.includes('arms-retcode'))
    
    console.log(`\n---- ${key} (${r.status}) chunks=${chunks.length} htmlImgs=${htmlImgs.length}`)
    htmlImgs.slice(0, 5).forEach(i => console.log('  HTML:', i))
    
    // Fetch each JS chunk and look for product images
    for (const chunk of chunks.slice(0, 2)) {
      try {
        const cr = await fetch(chunk, { headers: { 'user-agent': 'Mozilla/5.0' } })
        const ct = await cr.text()
        const imgs = [...new Set([...ct.matchAll(/https?:\/\/[^"'\s\\]+\.(?:jpg|png|webp)(?:\?[^"'\s\\]*)?/g)].map(m => m[0]))]
          .filter(u => !u.includes('logo') && !u.includes('icon') && u.includes('sunmi') && !u.includes('home-1') && !u.includes('home-2') && !u.includes('home-3') && !u.includes('cms/sunmi'))
        if (imgs.length > 0) {
          console.log(`  CHUNK ${chunk.split('/').pop()}:`)
          imgs.slice(0, 8).forEach(i => console.log('    ', i))
        }
      } catch (e) {}
    }
  } catch (e) {
    console.log(`\n---- ${key} ERR: ${e.message}`)
  }
}
