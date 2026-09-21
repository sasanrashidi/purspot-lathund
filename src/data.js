export const categories = [
  'Alla',
  'Kassasystem',
  'Expresskassa',
  'Kortterminal',
  'Tillbehör'
]

// =============================================================
// EXEMPELPRISER – Purspot (SEK exkl. moms).
// -------------------------------------------------------------
// Ersätt siffrorna nedan med riktiga priser när de finns på
// plats. Varje enhet har två alternativ:
//   buyPrice   – engångspris vid direktköp
//   monthly48  – månadskostnad vid 48 månaders avtal
// Enheter som saknas i tabellen visar inte något pris.
// =============================================================
export const purspotPricing = {
  v2s:        { buyPrice: 8900,  monthly48: 249 },
  'flex3-counter': { buyPrice: 18900, monthly48: 449 },
  'flex3-floor':   { buyPrice: 21500, monthly48: 499 },
  t2:         { buyPrice: 12900, monthly48: 329 },
  t3:         { buyPrice: 15900, monthly48: 399 },
  t3promax:   { buyPrice: 18500, monthly48: 449 },
  d3mini:     { buyPrice: 10900, monthly48: 289 },
  kds:        { buyPrice: 8900,  monthly48: 249 },
  orb:        { buyPrice: 9900,  monthly48: 269 },
  cloudprinter: { buyPrice: 4900, monthly48: 129 },
  kassalada:  { buyPrice: 1900,  monthly48: 49 },
  kvittorullar: { buyPrice: 799 },
  rx5000:     { buyPrice: 5900,  monthly48: 169 },
  dx8000:     { buyPrice: 6500,  monthly48: 189 },
  a920:       { buyPrice: 5900,  monthly48: 169 }
}

// Formatera antal till sverige-format, t.ex. 15900 -> "15 900 kr"
export function formatSEK(n) {
  if (n === undefined || n === null) return null
  return n.toLocaleString('sv-SE') + ' kr'
}

export const devices = [
  {
    id: 'v2s',
    model: 'SUNMI V2s',
    category: 'Kassasystem',
    formFactor: 'Portabel kassa & kortterminal',
    specs: {
      screen: '5.5"',
      printer: '58 mm kvittoskrivare',
      card: 'NFC / Blipp + Streckkodsläsare',
      network: '4G / Wi-Fi'
    },
    extra: 'Handhållen allt-i-ett med batteri. Passar säsongsförsäljning och mobila verksamheter.',
    purspot: 'Purspot GO — portabel kassa & kortterminal. Smidig, liten och batteridriven. Perfekt som fristående kassa för mindre verksamheter eller integrerad med ditt befintliga system.',
    sourceUrl: 'https://purspot.com/produkter/kassasystem/purspot-go',
    manufacturerUrl: 'https://www.jarltech.com/en/sunmi-v2s',
    imageUrl: 'https://www.eftsolutions.com/wp-content/uploads/2024/09/Sunmi-V2s_B.png'
  },
  {
    id: 'flex3-counter',
    model: 'SUNMI Flex 3 Countertop',
    category: 'Expresskassa',
    formFactor: 'Självutcheckningskiosk',
    specs: {
      screen: '22" / 27" (modulär)',
      printer: 'Integrerad kvittoskrivare',
      card: 'Integrerad kortläsare',
      network: 'Wi-Fi / Ethernet'
    },
    extra: 'Modulär Android-kiosk för bord. Inbyggd streckkodsläsare och betalterminal.',
    purspot: 'Purspot Express — självutcheckningskassa. Självservicekiosk med pekskärm och integrerad betalterminal som effektiviserar kundflödet, minskar köer och ökar kundnöjdheten.',
    sourceUrl: 'https://purspot.com/produkter/expresskassa/purspot-express',
    manufacturerUrl: 'https://www.sunmi.com/en/flex-3/',
    imageUrl: '/output-smallpngtools.png'
  },
  {
    id: 'flex3-floor',
    model: 'SUNMI Flex 3 Floorstand',
    category: 'Expresskassa',
    formFactor: 'Självutcheckningskiosk',
    specs: {
      screen: '22" / 27" (modulär)',
      printer: 'Integrerad kvittoskrivare',
      card: 'Integrerad kortläsare',
      network: 'Wi-Fi / Ethernet'
    },
    extra: 'Modulär Android-kiosk med golvstativ. Inbyggd streckkodsläsare och betalterminal.',
    purspot: 'Purspot Express — självutcheckningskassa. Selfservicekiosk som låter gästen beställa och betala själv direkt på skärmen.',
    sourceUrl: 'https://purspot.com/produkter/expresskassa/purspot-express',
    manufacturerUrl: 'https://www.sunmi.com/en/flex-3/',
    imageUrl: 'https://sunmi.com.bd/wp-content/uploads/2026/02/SUNMI-Flex-3-27-Restaurant-Version.png'
  },
  {
    id: 't2',
    model: 'SUNMI T2',
    category: 'Kassasystem',
    formFactor: 'Kompakt allt-i-ett-kassa',
    specs: {
      screen: '11.6" FHD pekskärm (1920x1080)',
      printer: '80 mm termoskrivare (auto-skär)',
      card: 'NFC & QR-betalning',
      network: 'Wi-Fi / Ethernet / 4G (tillval)'
    },
    extra: 'Kompakt kassa med kassalådestöd (RJ12) och microSD. Väger 2,1 kg.',
    purspot: 'Purspot One — kompakt men kraftfull kassa med inbyggd kortterminal, skanner och kvittoskrivare. En komplett kassa i en enda enhet, perfekt för snabb och flexibel helhetslösning.',
    sourceUrl: 'https://purspot.com/produkter/kassasystem/purspot-one',
    manufacturerUrl: 'https://www.sunmi.com/en/t2',
    imageUrl: 'https://www.sunmi.cz/en/assets/images/4-1-2000x1429.png'
  },
  {
    id: 't3',
    model: 'SUNMI T3',
    category: 'Kassasystem',
    formFactor: 'Flaggskeppskassa',
    specs: {
      screen: '15.6" FHD (400 nits, anti-fingerprint)',
      printer: '80 mm Seiko termoskrivare',
      card: 'NFC på skärmen (SoftPOS)',
      network: 'Wi-Fi 6E / 1000M LAN'
    },
    extra: 'Octa-core upp till 2,7 GHz, 6 GB RAM + 128 GB ROM, 8 MP kamera.',
    purspot: 'Purspot PRO — flexibel och kraftfull POS-lösning. Passar allt från små butiker och salonger till stora restauranger och nattklubbar. Användarvänligt gränssnitt som anpassas efter specifika behov.',
    sourceUrl: 'https://purspot.com/produkter/kassasystem/purspot-pro',
    manufacturerUrl: 'https://www.sunmi.com/en/t3-pro-series',
    imageUrl: 'https://www.jarltech.com/sites/default/files/images/product/main/SUN_T3-T3_80MM_left_shop.png'
  },
  {
    id: 't3promax',
    model: 'SUNMI T3 Pro Max',
    category: 'Kassasystem',
    formFactor: 'Flaggskeppskassa',
    specs: {
      screen: '15.6" FHD (400 nits, anti-fingerprint)',
      printer: '80 mm Seiko-skär',
      card: 'NFC på skärmen (SoftPOS)',
      network: 'Wi-Fi 6E / 1000M LAN'
    },
    extra: 'Octa-core upp till 2,7 GHz, 6 GB RAM + 128 GB ROM, vändbar huvudskärm och löstagbart kundskärmstöd.',
    purspot: 'Purspot PRO — flexibel och kraftfull POS-lösning med vändbar skärm för kunden. Passar allt från små butiker till stora restauranger, med ett gränssnitt som anpassas efter behov.',
    sourceUrl: 'https://purspot.com/produkter/kassasystem/purspot-pro',
    manufacturerUrl: 'https://www.sunmi.com/en/t3-pro-series',
    imageUrl: 'https://www.jarltech.com/sites/default/files/images/product/main/SUNMI_T3_Pro-Max_webshop.png'
  },
  {
    id: 'd3mini',
    model: 'SUNMI D3 Mini',
    category: 'Kassasystem',
    formFactor: 'Kompakt allt-i-ett-kassa',
    specs: {
      screen: '10.1" HD IPS (1280x800)',
      printer: '58 / 80 mm termoskrivare',
      card: 'NFC + 1D/2D-scanner',
      network: 'Wi-Fi 5 / Bluetooth / 4G (tillval)'
    },
    extra: 'Hexa-core upp till 2,4 GHz, inbyggt batteri (58 mm-version) och kundskärm (4").',
    purspot: 'Purspot One — kompakt men kraftfull kassa med inbyggd kortterminal, skanner och kvittoskrivare. En komplett kassa i en enda enhet, perfekt för snabb och flexibel helhetslösning.',
    sourceUrl: 'https://purspot.com/produkter/kassasystem/purspot-one',
    manufacturerUrl: 'https://www.sunmi.com/en/d3-mini',
    imageUrl: 'https://www.jarltech.com/sites/default/files/images/product/main/SUN_D3_Mini_black_left_shop.png'
  },
  {
    id: 'kds',
    model: 'SUNMI Köksskärm (KDS)',
    category: 'Tillbehör',
    formFactor: 'Köksdisplay',
    specs: {
      screen: '15.6" IPS pekskärm',
      printer: '-',
      card: '-',
      network: 'Wi-Fi / Ethernet'
    },
    extra: 'Realtidsvisning av beställningar i köket. Flexibel visning som anpassas efter arbetssättet.',
    purspot: 'Köksskärm (KDS) — inga fler papperslappar, ingen onödig stress. Beställningar visas direkt i realtid på skärmen med tydlig vy och full överblick över varje rätt — från order till servering.',
    sourceUrl: 'https://purspot.com/produkter/tillbehor/koksskarm',
    imageUrl: 'https://cdn.prod.website-files.com/6852772cc93c3df9b3c2ce95/692e9eac1b0a0a3870016728_Frame%20556.png'
  },
  {
    id: 'orb',
    model: 'ORB - Order Ready Board',
    category: 'Tillbehör',
    formFactor: 'Beställningsskärm',
    specs: {
      screen: '27" IPS display',
      printer: '-',
      card: '-',
      network: 'Wi-Fi / Ethernet'
    },
    extra: 'Visar orderstatus i realtid för gästerna. "Tillagas" → "Redo för upphämtning".',
    purspot: 'Beställningsskärm (ODS) — visar direkt när en order är klar att hämtas. Så fort personalen markerar en beställning som klar på köksskärmen flyttas den automatiskt till "Redo för upphämtning" på displayen.',
    sourceUrl: 'https://purspot.com/produkter/tillbehor/bestallningskarm',
    imageUrl: 'https://cdn.prod.website-files.com/6852772cc93c3df9b3c2ce95/692e9ea47a4530e0a1c633b3_Frame%20555.png'
  },
  {
    id: 'cloudprinter',
    model: 'SUNMI Cloud Printer',
    category: 'Tillbehör',
    formFactor: 'Kvittoskrivare',
    specs: {
      screen: '-',
      printer: '58 / 80 mm termoskrivare',
      card: '-',
      network: 'Bluetooth / LAN / Wi-Fi / 4G / USB'
    },
    extra: 'Molnbaserad kvittoskrivare. Skriver ut utan fysisk anslutning till kassan.',
    purspot: 'Sunmi Cloud Printer — kraftfull och pålitlig kvittoskrivare med IP52-klassning och oleofobisk yta som klarar vatten, ånga och fett. Automatisk återutskrift vid avbrott och ljud-/ljusnotiser för snabbare service.',
    sourceUrl: 'https://purspot.com/produkter/tillbehor/kvittoskrivare',
    imageUrl: 'https://cdn.prod.website-files.com/6852772cc93c3df9b3c2ce95/697870fe2301ce298aa4d465_Frame%201484582734.png'
  },
  {
    id: 'kassalada',
    model: 'Kassalåda',
    category: 'Tillbehör',
    formFactor: 'Kassalåda',
    specs: {
      screen: '-',
      printer: '-',
      card: 'RJ12 kassalådegränssnitt',
      network: '-'
    },
    extra: 'Elektronisk kassalåda med RJ12-anslutning. Kompatibel med SUNMI och Purspots kassasystem.',
    purspot: 'Kassalåda — robust kassalåda på 24 V med smart layout. 8 myntfack och 4 sedelfack för snabb hantering och smidiga växlingar. Kompakt format (33 x 33,5 x 10 cm) som passar de flesta kassadiskar.',
    sourceUrl: 'https://purspot.com/produkter/tillbehor/kassalada',
    imageUrl: 'https://cdn.prod.website-files.com/6852772cc93c3df9b3c2ce95/697871530e82cb68136f1c54_Frame%201484582735.png'
  },
  {
    id: 'kvittorullar',
    model: 'Kvittorullar',
    category: 'Tillbehör',
    formFactor: 'Förbrukning',
    specs: {
      screen: '-',
      printer: '80 mm passar T3/T2 och Cloud Printer, kort 80 mm passar D3 Mini/V3 Mix. 57 mm finns vit eller "Ej kvitto på köp".',
      card: '-',
      network: '-'
    },
    extra: 'Stabil utskrift varje dag. Kvittorullar i rätt format för Sunmi och kortterminaler.',
    purspot: 'Kvittorullar i rätt format för Sunmi och kortterminaler med stabil utskrift varje dag. 80 mm passar Sunmi T3/T2 och Cloud Printer, kort 80 mm passar D3 Mini/V3 Mix. 57 mm finns vit eller märkt "Ej kvitto på köp".',
    sourceUrl: 'https://purspot.com/produkter/tillbehor/kvittorullar',
    imageUrl: 'https://cdn.prod.website-files.com/6852772cc93c3df9b3c2ce95/698113e3087fd533d8a157ae_Frame%201484582737.png'
  },
  {
    id: 'rx5000',
    model: 'Worldline Bambora RX5000',
    category: 'Kortterminal',
    formFactor: 'Handhållen terminal',
    specs: {
      screen: '5.5" HD pekskärm',
      printer: 'Termoskrivare',
      card: 'PCI PTS 6.x kortläsare (Chip & PIN + Blipp)',
      network: '4G / Wi-Fi / Bluetooth'
    },
    extra: 'Bankterminal från Worldline. Stöder swish, kortbetalning och contactless.',
    purspot: 'Worldline — inlösen och terminaler. En etablerad aktör som levererar både kortinlösen och hårdvara med stabila lösningar för fristående och kassakopplade kortterminaler. Ta emot chip, kontaktlös blipp och mobila plånböcker (Apple Pay & Google Pay).',
    sourceUrl: 'https://purspot.com/betallosningar/kortterminal',
    manufacturerUrl: 'https://www.worldline.com',
    imageUrl: 'https://s7g10.scene7.com/is/image/worldlinesa/front-rx5000-mint-600x1200?ts=1780506199458&&fmt=png-alpha&dpr=off'
  },
  {
    id: 'dx8000',
    model: 'Worldline Bambora DX8000',
    category: 'Kortterminal',
    formFactor: 'Handhållen terminal',
    specs: {
      screen: '6" HD pekskärm',
      printer: 'Termoskrivare',
      card: 'PCI PTS 6.x kortläsare (Chip & PIN + Blipp)',
      network: '4G / Wi-Fi / Ethernet'
    },
    extra: 'Bankterminal från Worldline med större skärm. Stöder swish, kortbetalning och contactless.',
    purspot: 'Worldline — inlösen och terminaler. En etablerad aktör som levererar både kortinlösen och hårdvara med stabila lösningar för fristående och kassakopplade kortterminaler. Ta emot chip, kontaktlös blipp och mobila plånböcker (Apple Pay & Google Pay).',
    sourceUrl: 'https://purspot.com/betallosningar/kortterminal',
    manufacturerUrl: 'https://www.worldline.com',
    imageUrl: 'https://s7g10.scene7.com/is/image/worldlinesa/front-dx8000-mint-600x1200?ts=1780506199420&&fmt=png-alpha&dpr=off'
  },
  {
    id: 'a920',
    model: 'PAX A920 Pro',
    category: 'Kortterminal',
    formFactor: 'Handhållen terminal',
    specs: {
      screen: '5.5" HD pekskärm',
      printer: 'Snabb termoskrivare',
      card: 'PCI PTS 5.x kortläsare',
      network: '4G / Wi-Fi / Bluetooth'
    },
    extra: 'Kamera för streckkodsläsning. Stöder swish och mobila plånböcker.',
    purspot: 'Kortterminal — snabb och säker kortbetalning. Ta emot chip, kontaktlös blipp och mobila plånböcker som Apple Pay och Google Pay — allt i samma enhet.',
    sourceUrl: 'https://purspot.com/betallosningar/kortterminal',
    imageUrl: 'https://images.squarespace-cdn.com/content/v1/5ae31811da02bc3b1921974e/1721740837594-HPEIJX774TLQUSMWNV65/POS+PAX+A920-1.png'
  }
].map((device) => ({ ...device, ...(purspotPricing[device.id] || {}) }))

export const floCategories = [
  'Alla',
  'Kassadator',
  'Kortterminal',
  'Kvittoskrivare',
  'Streckkodsläsare',
  'Etikettskrivare',
  'Kassavåg',
  'Kassalåda',
  'Förbrukning',
  'Tillbehör'
]

export const floDevices = [
  {
    id: 'flo-pos80',
    model: 'Northmill POS80 15.6" + 11.6"',
    category: 'Kassadator',
    formFactor: 'Kassadator',
    specs: {
      screen: '15.6" pekskärm + 11.6" kunddisplay',
      printer: 'Inbyggd kvittoskrivare',
      network: 'Ethernet / Wi-Fi'
    },
    price: '16 995 kr',
    sku: 'POS80',
    extra: 'Kassadator särskilt utvecklad för butiksdatatillämpning med smidig inbyggd pekskärm, kunddisplay och kvittoskrivare.',
    flo: 'Northmill Flo-kassans kassadator — komplett allt-i-ett-lösning tillsammans med Northmill kassasystem och PAX-kortterminal.',
    sourceUrl: 'https://shop.flopay.se/butik/northmill-pos80-15-6/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/6a7bf357-1a90-4748-aa72-0e5ed245b7d9.jpg'
  },
  {
    id: 'flo-a35',
    model: 'Kortterminal PAX A35',
    category: 'Kortterminal',
    formFactor: 'Bords-/mobil kortterminal',
    specs: {
      screen: 'Pekskärm',
      card: 'Chip & PIN + Blipp (contactless)',
      network: 'Wi-Fi / Ethernet'
    },
    price: '299 kr/mån',
    sku: 'A35',
    extra: 'Kortterminal PAX A35 — används integrerad med Northmills kassasystem. Anslutning via Wi-Fi eller Ethernet.',
    flo: 'Kortterminal som hanteras av Northmill Flo Pay. Priset avser månadskostnad (exkl. moms).',
    sourceUrl: 'https://shop.flopay.se/butik/kortterminal-pax-a935/',
    manufacturerUrl: 'https://www.paxtechnology.com',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/a35-ny.png'
  },
  {
    id: 'flo-a920',
    model: 'Kortterminal PAX A920',
    category: 'Kortterminal',
    formFactor: 'Kortterminal med kvittoskrivare',
    specs: {
      screen: 'Stor pekskärm',
      printer: 'Inbyggd kvittoskrivare',
      card: 'Chip & PIN + Blipp (contactless)',
      network: 'Wi-Fi / 4G'
    },
    price: '299 kr/mån',
    sku: 'a920wh36',
    extra: 'Stilren och snygg kortterminal med inbyggd kvittoskrivare. Kan användas fristående eller integrerad med Northmills kassasystem.',
    flo: 'Kortterminalen PAX använder Android, vilket gör dem till små och smidiga handdatorer rustade för framtidens betallösningar. Kopplas upp via Wi-Fi eller mobilnät.',
    sourceUrl: 'https://shop.flopay.se/butik/kortterminal-pax-a920/',
    manufacturerUrl: 'https://www.paxtechnology.com',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/pax-a920.jpg'
  },
  {
    id: 'flo-a35-stativ',
    model: 'Stativ för PAX A35',
    category: 'Kortterminal',
    formFactor: 'Stativ',
    specs: {
      network: '-'
    },
    price: '999 kr',
    sku: 'PAX_mount1-1',
    extra: 'Smidigt och stabilt stativ som passar kortterminalen PAX A35.',
    flo: 'Tillbehör till PAX A35 — beställs tillsammans med terminalen via shop.flopay.se.',
    sourceUrl: 'https://shop.flopay.se/butik/stativ-for-pax-a35/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/2__48529.jpg'
  },
  {
    id: 'flo-a920-stativ',
    model: 'Stativ för PAX A920',
    category: 'Kortterminal',
    formFactor: 'Stativ',
    specs: {
      network: '-'
    },
    price: '399 kr',
    listPrice: '999 kr',
    sku: 'PAX_mount1',
    extra: 'Smidigt och stabilt stativ som passar kortterminalen PAX A920.',
    flo: 'Tillbehör till PAX A920 — REA-pris. Beställs tillsammans med terminalen via shop.flopay.se.',
    sourceUrl: 'https://shop.flopay.se/butik/stativ-for-pax-a920/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/PAXA92_1_1024x1024@2x-1.webp'
  },
  {
    id: 'flo-a920-ladd',
    model: 'Laddstation till PAX A920',
    category: 'Kortterminal',
    formFactor: 'Laddstation',
    specs: {
      network: '-'
    },
    price: '899 kr',
    sku: 'PAX_L920BC',
    extra: 'Laddstation i snygg och stilren design som passar kortterminalen PAX A920.',
    flo: 'Laddstation för dockning och laddning av PAX A920 när terminalen inte används.',
    sourceUrl: 'https://shop.flopay.se/butik/laddstation-till-pax-a920/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/PAX-A920-laddstation.jpg'
  },
  {
    id: 'flo-a920-ladd-nat',
    model: 'Laddstation till PAX A920 med nätverksuttag',
    category: 'Kortterminal',
    formFactor: 'Laddstation',
    specs: {
      network: 'Nätverksuttag (RJ45)'
    },
    price: '899 kr',
    sku: 'PAX_L920BM',
    extra: 'Laddstation med uttag för anslutning av nätverkskabel, passar PAX A920.',
    flo: 'Laddstation med inbyggt nätverksuttag — låter terminalen kopplas till nätverket via kabel medan den laddas.',
    sourceUrl: 'https://shop.flopay.se/butik/laddstation-till-pax-a920-med-natverksuttag/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/PAX-A920-laddstation-natverksuttag.jpg'
  },
  {
    id: 'flo-a920pro-ladd',
    model: 'Laddstation till PAX A920pro',
    category: 'Kortterminal',
    formFactor: 'Laddstation',
    specs: {
      network: '-'
    },
    price: '899 kr',
    sku: 'PAX_L920BC-1',
    extra: 'Laddstation i snygg och stilren design som passar kortterminalen PAX A920pro.',
    flo: 'Laddstation för dockning och laddning av den nyare PAX A920pro.',
    sourceUrl: 'https://shop.flopay.se/butik/laddstation-till-pax-a920pro/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/PAX-A920-laddstation.jpg'
  },
  {
    id: 'flo-mcp31-svart',
    model: 'Star Mc-Print3 – MCP31, Ethernet, USB, iOS, Svart',
    category: 'Kvittoskrivare',
    formFactor: 'Kvittoskrivare',
    specs: {
      printer: 'Direkttermo, 203 DPI, max 80 mm, 250 mm/sek, auto-cutter',
      network: 'USB-B / Ethernet / iOS (Lightning)'
    },
    price: '2 999 kr',
    listPrice: '3 349 kr',
    sku: '39651290-2',
    extra: 'En storsäljare bland kvittoskrivare, som nu även kan kopplas direkt till iPad/iPhone via Lightning-kabel (ingår ej).',
    flo: 'Populär kvittoskrivare för kassa, kök och bar. Levereras med inbyggd strömförsörjning.',
    desc: 'Star MC-Print3 (MCP31) är en kvittoskrivare med direkttermo, upplösning 203 DPI, pappersbredd max 80 mm, tryckbredd max 72 mm, rulldiameter max 83 mm, hastighet 250 mm/sek. Anslutning: USB-B, Ethernet och iOS (cutter). Kan kopplas via LAN, USB A (Lightning iOS) eller USB B (Windows).',
    sourceUrl: 'https://shop.flopay.se/butik/star-mc-print3-mcp31-ethernet-usb-ios-203dpi-cutter-svart/',
    manufacturerUrl: 'https://www.starmicronics.com',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/star-mc-print3-svart-lan-och-usb-inkl-natadapter.jpg'
  },
  {
    id: 'flo-mcp31-vit',
    model: 'Star Mc-Print3 – MCP31, Ethernet, USB, iOS, Vit',
    category: 'Kvittoskrivare',
    formFactor: 'Kvittoskrivare',
    specs: {
      printer: 'Direkttermo, 203 DPI, max 80 mm, 250 mm/sek, auto-cutter',
      network: 'USB-B / Ethernet / iOS (Lightning)'
    },
    price: '2 999 kr',
    listPrice: '3 349 kr',
    sku: '39651290',
    extra: 'En storsäljare bland kvittoskrivare, som nu även kan kopplas direkt till iPad/iPhone via Lightning-kabel (ingår ej).',
    flo: 'Populär kvittoskrivare för kassa, kök och bar. Levereras med inbyggd strömförsörjning.',
    desc: 'Star MC-Print3 (MCP31) är en kvittoskrivare med direkttermo, upplösning 203 DPI, pappersbredd max 80 mm, tryckbredd max 72 mm, rulldiameter max 83 mm, hastighet 250 mm/sek. Anslutning: USB-B, Ethernet och iOS (cutter). Kan kopplas via LAN, USB A (Lightning iOS) eller USB B (Windows).',
    sourceUrl: 'https://shop.flopay.se/butik/star-mc-print3-mcp30-ethernet-203dpi-cutter-vit/',
    manufacturerUrl: 'https://www.starmicronics.com',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/star_mc-print3_white.webp'
  },
  {
    id: 'flo-mcp31-vit-refurb',
    model: 'Star Mc-Print3 – MCP31, Ethernet, USB, iOS, Vit (Refurbish)',
    category: 'Kvittoskrivare',
    formFactor: 'Kvittoskrivare',
    specs: {
      printer: 'Direkttermo, 203 DPI, max 80 mm, 250 mm/sek, auto-cutter',
      network: 'USB-B / Ethernet / iOS (Lightning)'
    },
    price: '2 199 kr',
    sku: '39651290-1',
    extra: 'Refurbish-produkt som är testad och återställd. Kan kopplas direkt till iPad/iPhone via Lightning-kabel (ingår ej).',
    flo: 'Renoverad kvittoskrivare till lägre pris som är testad och återställd.',
    desc: 'Star MC-Print3 (MCP31) med direkttermo, 203 DPI, max 80 mm, 250 mm/sek. Anslutning: USB-B, Ethernet och iOS (cutter). Detta är en refurbish-produkt som är testad och återställd.',
    sourceUrl: 'https://shop.flopay.se/butik/star-mc-print3-mcp31-ethernet-usb-ios-203dpi-cutter-vit-begagnad/',
    manufacturerUrl: 'https://www.starmicronics.com',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/star_mc-print3_white.webp'
  },
  {
    id: 'flo-tsp143u-wifi',
    model: 'Star TSP143U+ WiFi – kvittoskrivare',
    category: 'Kvittoskrivare',
    formFactor: 'Nätverksskrivare',
    specs: {
      printer: 'Direkttermo, 250 mm/sek',
      network: 'Wi-Fi'
    },
    price: '3 499 kr',
    sku: '39464990-1',
    extra: 'Vår mest populära nätverksskrivare. Snabb och effektiv!',
    flo: 'Optimal som köksskrivare eller barskrivare — ansluts direkt till nätverket via Wi-Fi.',
    desc: 'Star TSP143U+ WiFi är en ny och uppdaterad variant av den populära kvittoskrivaren Star TSP100. Utrustad med Wi-Fi så att du kan ansluta den direkt till ditt nätverk — suffixet för köksskrivare eller barskrivare. Utskriftshastighet 250 mm/sek.',
    sourceUrl: 'https://shop.flopay.se/butik/star-tsp143u-wifi-kvittoskrivare/',
    manufacturerUrl: 'https://www.starmicronics.com',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/2017/11/star-tsp143iii-lan-naetverksansluten-kvittoskrivare-2.jpg'
  },
  {
    id: 'flo-tsp143iii-usb',
    model: 'Star TSP143III Lightning/USB – kvittoskrivare',
    category: 'Kvittoskrivare',
    formFactor: 'Kvittoskrivare',
    specs: {
      printer: 'Direkttermo, 250 mm/sek',
      network: 'USB / Lightning (iOS)'
    },
    price: '2 499 kr',
    sku: '39472390',
    extra: 'Uppföljaren till storsäljaren TSP143U med högre prestanda och stöd för iPad/iPhone via Lightning (kabel ingår ej).',
    flo: 'Tryggt val med lång livslängd från Star. Levereras komplett med inbyggd nätadapter, nätkabel, väggfäste och CD-skiva med svenska drivrutiner.',
    desc: 'Star TSP143III är uppföljaren till TSP143U med högre prestanda och stöd för iPad, iPhone eller PC via Lightning-kabel (ingår ej). Mindre risk för fel eller tappad kontakt — inget behov av bluetooth. Levereras komplett med inbyggd nätadapter, nätkabel, väggfäste och CD-skiva med svenska drivrutiner anpassade för kassalagen.',
    sourceUrl: 'https://shop.flopay.se/butik/star-tsp143iii-usb-kvittoskrivare-med-usb/',
    manufacturerUrl: 'https://www.starmicronics.com',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/star-tsp143-lightning.jpg'
  },
  {
    id: 'flo-tsp143iii-lan',
    model: 'Star TSP143III LAN – nätverksansluten kvittoskrivare',
    category: 'Kvittoskrivare',
    formFactor: 'Nätverksskrivare',
    specs: {
      printer: 'Direkttermo, 250 mm/sek',
      network: 'Ethernet (LAN)'
    },
    price: '2 995 kr',
    sku: '39464990',
    extra: 'Vår mest populära nätverksskrivare. Snabb och effektiv för kök och bar.',
    flo: 'Nätverksansluten kvittoskrivare som kopplas in direkt i nätverket. Stöder ej Wi-Fi — kopplas via router.',
    desc: 'Star TSP143III LAN är en ny och uppdaterad variant av Star TSP100 med nätverksanslutning. Supergsnabb kvittoskrivare med 250 mm/sek. Levereras med nätadapter, väggfäste och CD-skiva. Nätverkskabel köps separat. Söder ej Wi-Fi.',
    sourceUrl: 'https://shop.flopay.se/butik/star-tsp143iii-lan-natverksansluten-kvittoskrivare/',
    manufacturerUrl: 'https://www.starmicronics.com',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/2017/11/star-tsp143iii-lan-naetverksansluten-kvittoskrivare-2.jpg'
  },
  {
    id: 'flo-tsp143iiu-refurb',
    model: 'Star TSP143IIU – kvittoskrivare med USB (Refurbish)',
    category: 'Kvittoskrivare',
    formFactor: 'Kvittoskrivare',
    specs: {
      printer: 'Direkttermo',
      network: 'USB'
    },
    price: '749 kr',
    listPrice: '1 499 kr',
    sku: '39464031',
    extra: 'En av världens mest populära kvittoskrivare. Levereras komplett med inbyggd nätadapter, nätkabel, USB-kabel och väggfäste.',
    flo: 'Refurbish-exemplar till ett mycket bra pris.',
    desc: 'Star TSP143 är en av världens mest populära kvittoskrivare. Levereras komplett med inbyggd nätadapter, nätkabel, USB-kabel, väggfäste och CD-skiva med svenska drivrutiner anpassade för kassalagen.',
    sourceUrl: 'https://shop.flopay.se/butik/star-tsp143u-ii-eco-kvittoskrivare-med-usb/',
    manufacturerUrl: 'https://www.starmicronics.com',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/star-tsp143-lightning.jpg'
  },
  {
    id: 'flo-sunlux-2600a',
    model: 'Sunlux XL-2600A',
    category: 'Streckkodsläsare',
    formFactor: 'Bordsskanner',
    specs: {
      card: '1D streckkodsläsare',
      network: 'USB'
    },
    price: '1 499 kr',
    extra: 'Prisvärd bordsskanner som passar perfekt för detaljhandeln.',
    flo: 'Bordsskanner för kassan — enkel att installera och använda.',
    sourceUrl: 'https://shop.flopay.se/butik/sunlux-xl-2600a/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/NO-2023031760521_1.jpg'
  },
  {
    id: 'flo-sunlux-3610s',
    model: 'Sunlux XL-3610S USB',
    category: 'Streckkodsläsare',
    formFactor: 'Streckkodsläsare',
    specs: {
      card: '1D streckkodsläsare',
      network: 'USB'
    },
    price: '899 kr',
    extra: 'Den perfekta blandningen av prisvärdhet och prestanda.',
    flo: 'Kompakt streckkodsläsare för kassan till ett lågt pris.',
    sourceUrl: 'https://shop.flopay.se/butik/sunlux-xl-3610s/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/NO-2020923120759_s.png'
  },
  {
    id: 'flo-sunlux-9610',
    model: 'Sunlux XL-9610 1D & 2D Trådlös',
    category: 'Streckkodsläsare',
    formFactor: 'Trådlös streckkodsläsare',
    specs: {
      card: '1D & 2D-avläsning',
      network: 'Trådlös / USB'
    },
    price: '1 999 kr',
    extra: 'Den perfekta blandningen av prisvärdhet, prestanda och stil.',
    flo: 'Trådlös streckkodsläsare med stöd för både 1D- och 2D-koder.',
    sourceUrl: 'https://shop.flopay.se/butik/sunlux-xl-9610-1d-2d-tradlos/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/xl-9610.png'
  },
  {
    id: 'flo-eclipse',
    model: 'Streckkodsläsare Honeywell Eclipse',
    category: 'Streckkodsläsare',
    formFactor: 'Streckkodsläsare',
    specs: {
      card: 'Laserscanner (1D)',
      network: 'USB'
    },
    price: '199 kr',
    extra: 'Demoanvänd streckkodsläsare med laserscanner.',
    flo: 'Utförsäljning — demoanvänd enhet till ett fyndpris.',
    sourceUrl: 'https://shop.flopay.se/butik/metrologic-eclipse-usb-cable-fyndvara/',
    manufacturerUrl: 'https://www.honeywell.com',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/2017/11/honeywell-ms5145-eclipse-popular-streckkodslasare-med-usb-1.jpg'
  },
  {
    id: 'flo-tsc-tx310',
    model: 'TSC TX310 – etikettskrivare inkl. ethernetinterface',
    category: 'Etikettskrivare',
    formFactor: 'Etikettskrivare',
    specs: {
      printer: '203 DPI, direkttermo + termotransfer',
      network: 'Ethernet'
    },
    price: '7 899 kr',
    sku: 'TX310-A001-1202',
    extra: 'Kompakt etikettskrivare med inkluderat Ethernet-interface.',
    flo: 'TSC etikettskrivare lämplig för priseriket och streckkoder.',
    sourceUrl: 'https://shop.flopay.se/butik/tsc-tx310-etikettskrivare-inkl-ethernetinterface/',
    manufacturerUrl: 'https://www.tscprinters.com',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/tsc_tx_display.jpg'
  },
  {
    id: 'flo-zebra-zd421d',
    model: 'Zebra ZD421d – DT, 203 dpi, USB',
    category: 'Etikettskrivare',
    formFactor: 'Etikettskrivare',
    specs: {
      printer: 'Direkttermo, 203 dpi',
      network: 'USB'
    },
    price: '3 599 kr',
    sku: 'ZD4A042-D0EM00EZ',
    extra: 'En populär och snabb etikettskrivare med direkttermo.',
    flo: 'Snabbare och enklare än sina föregångare — ett bra val för dig som skriver ut etiketter med begränsad livslängd.',
    desc: 'Zebra ZD421d är en etikettskrivare med direkttermo. Snabbare och enklare än sina föregångare. Med direkttermo krävs inget färgband och laddningen går fort, men tryckets livslängd är kortare än vid termotransfer.',
    sourceUrl: 'https://shop.flopay.se/butik/zebra-zd421d-dt-203-dpi-usb/',
    manufacturerUrl: 'https://www.zebra.com',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/zd420d-product-photography-left-350.jpg'
  },
  {
    id: 'flo-pc43t',
    model: 'Honeywell Intermec PC43T – etikettskrivare inkl. ethernetinterface',
    category: 'Etikettskrivare',
    formFactor: 'Etikettskrivare',
    specs: {
      printer: 'Termotransfer',
      network: 'Ethernet'
    },
    price: '5 900 kr',
    listPrice: '6 499 kr',
    sku: 'PC43T_E',
    extra: 'Smidig och lättanvänd etikettskrivare med termotransferteknik. Passar stora som små företag.',
    flo: 'OBS! Erbjuder INGEN supportering eller hjälp med funktionalitet. Har inte LCD-display likt bilden.',
    sourceUrl: 'https://shop.flopay.se/butik/honeywell-intermec-pc43t/',
    manufacturerUrl: 'https://www.honeywell.com',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/pc43t.jpg'
  },
  {
    id: 'flo-vag-wtp',
    model: 'Våg för Flo WTP',
    category: 'Kassavåg',
    formFactor: 'Prisuträknande våg',
    specs: {
      screen: 'Kund- och operatörsdisplay',
      network: 'Kommunikationskabel'
    },
    price: '5 495 kr',
    sku: '28006-1',
    extra: 'Prisuträknande våg med kund- och operatörsdisplay. Vågplattformen i rostfritt stål, storlek 265x200 mm. Kommunikationskabel ingår.',
    flo: 'Kassavåg som kopplas till Flo-kassan för vägran av lösvikt och prisuträkning.',
    sourceUrl: 'https://shop.flopay.se/butik/vag-for-flo-wtp-15/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/WTP1.jpg'
  },
  {
    id: 'flo-vag-vgp',
    model: 'Våg för Flo VGP-MR 15 + POS-opt.',
    category: 'Kassavåg',
    formFactor: 'Prisminnesvåg',
    specs: {
      screen: 'Kund- och operatörsdisplay',
      network: 'Kommunikationskabel'
    },
    price: '5 995 kr',
    sku: '28006',
    extra: 'Prisminnesvåg med kund- och operatörsdisplay. Vågplattformen i rostfritt stål, storlek 230x250 mm. Kommunikationskabel ingår.',
    flo: 'Kassavåg med prisminne för snabbare vägning och prisuträkning i Flo-kassan.',
    sourceUrl: 'https://shop.flopay.se/butik/vag-for-moreflo-vgp-mr-15-pos-opt/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/vag-vgp-1.jpg'
  },
  {
    id: 'flo-kassalada-cb2002',
    model: 'Kassalåda Star CB-2002 410mm',
    category: 'Kassalåda',
    formFactor: 'Elektronisk kassalåda',
    specs: {
      card: 'Öppnas automatiskt vid kvittoutskrift'
    },
    price: '999 kr',
    sku: '55555561',
    extra: 'Vår storsäljande kassalåda från välkända Star Micronics.',
    flo: 'Kassalåda med nyckellås (tre lägen), fästen för sedelhållare, sedeldelare och låsbart kassalock. Extra nycklar och lås finns som tillval.',
    desc: 'Stadig och tillförlitlig kassalåda från Star Micronics. Nyckellås med tre lägen, fästen för sedelhållare, sedeldelare och låsbart kassalock. Öppnas automatiskt vid utskrift från en kompatibel kvittoskrivare. Mått (BxDxH): 410 x 415 x 114 mm.',
    sourceUrl: 'https://shop.flopay.se/butik/kassalada-star-cb-2002/',
    manufacturerUrl: 'https://www.starmicronics.com',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/2017/11/star-cb-2002-kassalada-1.jpg'
  },
  {
    id: 'flo-kassalada-cb2002-fynd',
    model: 'Kassalåda Star CB2002 410mm (Utförsäljning)',
    category: 'Kassalåda',
    formFactor: 'Elektronisk kassalåda',
    specs: {
      card: 'Öppnas automatiskt vid kvittoutskrift'
    },
    price: '399 kr',
    listPrice: '825 kr',
    sku: 'd_kassalåda_stor',
    extra: 'Stor kassalåda med nyckel. Utförsäljning till fyndpris.',
    flo: 'Fyndvara under utförsäljning — kompatibel med Star-kvittoskrivare.',
    sourceUrl: 'https://shop.flopay.se/butik/kassalada-stor-fyndvara/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/2017/11/kassalada-att-hyra-2.jpg'
  },
  {
    id: 'flo-kassalada-350',
    model: 'Kassalåda 350mm',
    category: 'Kassalåda',
    formFactor: 'Manuell kassalåda',
    specs: {
      card: '8 myntkoppar + 4 sedelfack'
    },
    price: '1 199 kr',
    sku: 'PT-33',
    extra: 'Liten och smidig manuell kassalåda för dig som vill ha en mindre variant. Mått (BxDxH): 350x405x90 mm.',
    flo: 'Rymlig, robust och flexibel kassalåda i lite mindre format — ett bra komplement till ditt kassasystem.',
    desc: 'Rymlig, robust och flexibel kassalåda i lite mindre format med 8 st myntkoppar och 4 st sedelfack.',
    sourceUrl: 'https://shop.flopay.se/butik/kassalada-i-mindre-format/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/draweer.jpeg'
  },
  {
    id: 'flo-monteringsvinkel',
    model: 'Monteringsvinkel hängande montage av kassalåda CB-2002',
    category: 'Kassalåda',
    formFactor: 'Tillbehör',
    specs: {
      network: '-'
    },
    price: '395 kr',
    sku: '99250025',
    extra: 'Montera din Star CB-2002 kassalåda under en bänk eller ett bord med hjälp av dessa smarta monteringsvinklar. Paketet innehåller fyra st vinklar.',
    flo: 'Tillbehör till kassalådan Star CB-2002 för hängande montage.',
    sourceUrl: 'https://shop.flopay.se/butik/monteringsvinkel-hangande-montage-av-kassalada-cb-2002/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/2017/11/monteringsvinkel-hangande-montage-av-kassalada-cb-2002-1.jpg'
  },
  {
    id: 'flo-extra-nycklar',
    model: 'Extra nycklar till kassalåda CB-2002 (2 st)',
    category: 'Kassalåda',
    formFactor: 'Tillbehör',
    specs: {
      network: '-'
    },
    price: '204 kr',
    sku: '99250017',
    extra: 'Extranycklar till din CB-2002 kassalåda för dig som tappat bort eller behöver fler nycklar.',
    flo: 'Reservnycklar till kassalådan Star CB-2002.',
    sourceUrl: 'https://shop.flopay.se/butik/extra-nycklar-till-kassalada-cb-2002-2-st/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/2017/11/extra-nycklar-till-kassalada-cb-2002-2-st-1.jpg'
  },
  {
    id: 'flo-kvittorullar-80',
    model: 'Kvittorullar 80mm (multipack)',
    category: 'Förbrukning',
    formFactor: 'Förbrukning',
    specs: {
      printer: '80 mm kvittorulle'
    },
    price: 'Från 599 kr',
    extra: 'Säljs i paket om 30, 60, 90 och 120. Köp fler, spara mer!',
    flo: 'Kvittorullar i 80 mm-format för kvittoskrivare och kortterminaler med utskrift.',
    sourceUrl: 'https://shop.flopay.se/butik/kvittorullar-80-multipack/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/kvittorulle-kategori.jpg'
  },
  {
    id: 'flo-kvittorullar-57',
    model: 'Kvittorullar – Thermorulle 57/36/12 – 100 st',
    category: 'Förbrukning',
    formFactor: 'Förbrukning',
    specs: {
      printer: '57 mm kvittorulle'
    },
    price: '599 kr',
    sku: '1523060L',
    extra: 'En av våra vanligaste kvittorullar. Förpackningen innehåller 100 st.',
    flo: 'Passar bland annat SM-S220i, SM-L200 samt vissa kortterminaler som ICT250, IWL250 och T103P.',
    sourceUrl: 'https://shop.flopay.se/butik/kvittorullar-thermorulle-57-36-12-100-st/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/2017/11/kvittorullar-thermorulle-57-36-12.jpg'
  },
  {
    id: 'flo-fargband-tsc',
    model: 'Färgband för TSC TX310 etikettskrivare, 1-pack',
    category: 'Förbrukning',
    formFactor: 'Förbrukning',
    specs: {
      printer: 'Färgband till TSC TX310'
    },
    price: '299 kr',
    sku: '3330110',
    extra: 'Färgband som passar till etikettskrivare från TSC TX310.',
    flo: 'Förbrukningsmaterial till TSC TX310.',
    sourceUrl: 'https://shop.flopay.se/butik/fargband-for-tsc-tx310-etikettskrivare-1-pack/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/fargband-intermec.jpg'
  },
  {
    id: 'flo-fargband-intermec-1',
    model: 'Färgband för Honeywell / Intermec etikettskrivare, 1-pack',
    category: 'Förbrukning',
    formFactor: 'Förbrukning',
    specs: {
      printer: '110 mm x 300 m'
    },
    price: '239 kr',
    sku: '1-970657-01-01',
    extra: 'Färgband som passar till etikettskrivare från Honeywell och Intermec. Bredd 110 mm och längd 300 m.',
    flo: 'Färgband till Honeywell/Intermec etikettskrivare.',
    sourceUrl: 'https://shop.flopay.se/butik/intermec-ribbon-hr03-91-resin-110mm-x-300m-inkout-1st/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/fargband-intermec.jpg'
  },
  {
    id: 'flo-fargband-intermec-10',
    model: 'Färgband för Honeywell / Intermec etikettskrivare, 10-pack',
    category: 'Förbrukning',
    formFactor: 'Förbrukning',
    specs: {
      printer: '110 mm x 300 m'
    },
    price: '2 299 kr',
    sku: '1-970657-01-0',
    extra: 'Färgband som passar till etikettskrivare från Honeywell och Intermec. 10 st i kartongen.',
    flo: 'Färgband till Honeywell/Intermec etikettskrivare i storpack.',
    sourceUrl: 'https://shop.flopay.se/butik/fargband-for-honeywell-intermec-etikettskrivare/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/fargband-intermec.jpg'
  },
  {
    id: 'flo-fargband-3200-110',
    model: 'Färgband, 3200 vax/harts, 110 mm x 74 m',
    category: 'Förbrukning',
    formFactor: 'Förbrukning',
    specs: {
      printer: '110 mm x 74 m'
    },
    price: '799 kr',
    sku: '03200GS11007',
    extra: 'Färgband till bl.a Zebra GK420t.',
    flo: 'Färgband till Zebra etikettskrivare.',
    sourceUrl: 'https://shop.flopay.se/butik/fargband-3200-vaxharts-110-mm-x-74-m/',
    manufacturerUrl: 'https://www.zebra.com',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/2017/11/fargband-3200-vax-harts-110-mm-x-74-m-1.jpg'
  },
  {
    id: 'flo-fargband-3200-84',
    model: 'Färgband, 3200 vax/harts, 84 mm x 74 m',
    category: 'Förbrukning',
    formFactor: 'Förbrukning',
    specs: {
      printer: '84 mm x 74 m'
    },
    price: '699 kr',
    sku: '03200GS08407',
    extra: 'Färgband till bl.a Zebra GK420t.',
    flo: 'Färgband till Zebra etikettskrivare.',
    sourceUrl: 'https://shop.flopay.se/butik/fargband-3200-vaxharts-84-mm-x-74-m/',
    manufacturerUrl: 'https://www.zebra.com',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/2017/11/fargband-3200-vax-harts-84-mm-x-74-m-1.jpg'
  },
  {
    id: 'flo-fargband-3200-64',
    model: 'Färgband, 3200 vax/harts, 64 mm x 74 m',
    category: 'Förbrukning',
    formFactor: 'Förbrukning',
    specs: {
      printer: '64 mm x 74 m'
    },
    price: '699 kr',
    sku: '03200GS06407',
    extra: 'Färgband till bl.a Zebra GK420t.',
    flo: 'Färgband till Zebra etikettskrivare.',
    sourceUrl: 'https://shop.flopay.se/butik/fargband-3200-vaxharts-64-mm-x-74-m/',
    manufacturerUrl: 'https://www.zebra.com',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/2017/11/fargband-3200-vax-harts-64-mm-x-74-m-1.jpg'
  },
  {
    id: 'flo-etikett-76x51',
    model: 'Etikettrulle Z-Select 2000D, 76 x 51, d 127 mm',
    category: 'Förbrukning',
    formFactor: 'Direkttermoetiketter',
    specs: {
      printer: '1370 etiketter per rulle'
    },
    price: '2 499 kr',
    sku: '800263-205',
    extra: 'Etikett för bl.a Zebra GK420d. 1370 etiketter per rulle.',
    flo: 'Direkttermoetiketter för Zebra GK420d med flera.',
    sourceUrl: 'https://shop.flopay.se/butik/etikettrulle-z-select-2000d-76-x-51-d-127-mm/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/2017/11/etikettrulle-z-select-2000d-76-x-51-dt-1370-etiketter-rulle-d-127-mm-1.jpg'
  },
  {
    id: 'flo-etikett-57x32',
    model: 'Etikettrulle Z-Select 2000D, 57 x 32, DT, d 127 mm',
    category: 'Förbrukning',
    formFactor: 'Direkttermoetiketter',
    specs: {
      printer: '-'
    },
    price: '2 099 kr',
    sku: '800262-125',
    extra: 'Etikett för bl.a Zebra GK420d.',
    flo: 'Direkttermoetiketter för Zebra GK420d med flera.',
    sourceUrl: 'https://shop.flopay.se/butik/etikettrulle-z-select-2000d-57-x-32-dt-d-127-mm/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/2017/11/etikettrulle-z-select-2000d-57-x-32-dt-d-127-mm-1.jpg'
  },
  {
    id: 'flo-etikett-57x19',
    model: 'Etikettrulle Z-Select 2000D, 57 x 19, DT, d 127 mm, 3.315/rulle',
    category: 'Förbrukning',
    formFactor: 'Direkttermoetiketter',
    specs: {
      printer: '3315 etiketter per rulle'
    },
    price: '2 199 kr',
    sku: '800262-075',
    extra: 'Etikett för bl.a Zebra GK420d. 3315 etiketter per rulle.',
    flo: 'Direkttermoetiketter för Zebra GK420d med flera.',
    sourceUrl: 'https://shop.flopay.se/butik/etikettrulle-z-select-2000d-57-x-19-dt-d-127-mm-3-315rulle/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/2017/11/etikettrulle-z-select-2000d-57-x-19-dt-d-127-mm-3315-rulle-1.jpg'
  },
  {
    id: 'flo-etikett-32x25',
    model: 'Etikettrulle Z-Select 2000D, 32 x 25, DT, d 127 mm',
    category: 'Förbrukning',
    formFactor: 'Direkttermoetiketter',
    specs: {
      printer: '-'
    },
    price: '1 399 kr',
    sku: '800261-105',
    extra: 'Etikett för bl.a Zebra GK420d.',
    flo: 'Direkttermoetiketter för Zebra GK420d med flera.',
    sourceUrl: 'https://shop.flopay.se/butik/etikettrulle-z-select-2000d-32-x-25-dt-d-127-mm/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/2017/11/etikettrulle-z-select-2000d-32-x-25-dt-d-127-mm-1.jpg'
  },
  {
    id: 'flo-etikett-102x38',
    model: 'Etikettrulle Z-Select 2000D, 102 x 38, DT, d 127 mm',
    category: 'Förbrukning',
    formFactor: 'Direkttermoetiketter',
    specs: {
      printer: '-'
    },
    price: '3 299 kr',
    sku: '800264-155',
    extra: 'Etikett för bl.a Zebra GK420d.',
    flo: 'Direkttermoetiketter för Zebra GK420d med flera.',
    sourceUrl: 'https://shop.flopay.se/butik/etikettrulle-z-select-2000d-102-x-38-dt-d-127-mm/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/2017/11/etikettrulle-z-select-2000d-102-x-38-dt-d-127-mm-1.jpg'
  },
  {
    id: 'flo-etikett-102x102',
    model: 'Etikettrulle Z-Select 2000D, 102 x 102, DT, d 127 mm',
    category: 'Förbrukning',
    formFactor: 'Direkttermoetiketter',
    specs: {
      printer: '700 etiketter per rulle'
    },
    price: '3 399 kr',
    sku: '800264-405',
    extra: '700 etiketter per rulle.',
    flo: 'Direkttermoetiketter för Zebra GK420d med flera.',
    sourceUrl: 'https://shop.flopay.se/butik/etikettrulle-z-select-2000d-102-x-102-dt-d-127-mm/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/2017/11/etikettrulle-z-select-2000d-102-x-102-dt-d-127-mm-700-etiketter-rulle-1.jpg'
  },
  {
    id: 'flo-etikett-removable-57x32',
    model: 'Etikettrulle Z-Select 2000D Removable, 57 x 32, DT, d 127 mm',
    category: 'Förbrukning',
    formFactor: 'Direkttermoetiketter',
    specs: {
      printer: 'Borttagbar (Removable)'
    },
    price: '2 299 kr',
    sku: '800262-127',
    extra: 'Etikett för bl.a Zebra GK420d.',
    flo: 'Direkttermoetiketter med borttagbart lim för Zebra GK420d med flera.',
    sourceUrl: 'https://shop.flopay.se/butik/etikettrulle-z-select-2000d-removable-57-x-32-dt-d-127-mm/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/2017/11/etikettrulle-z-select-2000d-removable-57-x-32-dt-d-127-mm-1.jpg'
  },
  {
    id: 'flo-etikett-removable-38x25',
    model: 'Etikettrulle Z-Select 2000D Removable, 38 x 25, DT, d 127 mm',
    category: 'Förbrukning',
    formFactor: 'Direkttermoetiketter',
    specs: {
      printer: 'Borttagbar (Removable)'
    },
    price: '1 899 kr',
    sku: '800261-107',
    extra: 'Etikett för bl.a Zebra GK420d.',
    flo: 'Direkttermoetiketter med borttagbart lim för Zebra GK420d med flera.',
    sourceUrl: 'https://shop.flopay.se/butik/etikettrulle-z-select-2000d-removable-38-x-25-dt-d-127-mm/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/2017/11/etikettrulle-z-select-2000d-removable-38-x-25-dt-d-127-mm-1.jpg'
  },
  {
    id: 'flo-bouncepad-vit',
    model: 'Bouncepad Eddy | Vit',
    category: 'Tillbehör',
    formFactor: 'Stativ för surfplatta',
    specs: {
      network: '-'
    },
    price: '1 995 kr',
    extra: 'Stativ för surfplatta, fungerar för iPad 10.2 – 12.9 tum.',
    flo: 'Stativ/hållare för surfplatta — passar för en självbetjäningslösning eller som kundlösning.',
    sourceUrl: 'https://shop.flopay.se/butik/bouncepad-eddy-vit/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/BouncepadEddyWhite-FrontThreeQuarter-1_1-HR.webp'
  },
  {
    id: 'flo-bouncepad-svart',
    model: 'Bouncepad Eddy | Svart',
    category: 'Tillbehör',
    formFactor: 'Stativ för surfplatta',
    specs: {
      network: '-'
    },
    price: '1 995 kr',
    extra: 'Stativ för surfplatta, fungerar för iPad 10.2 – 12.9 tum.',
    flo: 'Stativ/hållare för surfplatta — passar för en självbetjäningslösning eller som kundlösning.',
    sourceUrl: 'https://shop.flopay.se/butik/bouncepad-eddy-svart/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/51lU2aRnaEL.jpg'
  },
  {
    id: 'flo-kontrollenhet',
    model: 'Molnbaserad kontrollenhet (Klarsynt)',
    category: 'Tillbehör',
    formFactor: 'Kontrollenhet (Skatteverket)',
    specs: {
      network: 'Molnbaserad (Klarsynt)'
    },
    price: '149 kr/mån',
    sku: 'ISUPOS_CU',
    extra: 'Skippa den fysiska kontrollenheten och skaffa en molnbaserad. Gör din kassa godkänd gentemot Skatteverket (Svarta lådan).',
    flo: 'Endast kompatibel för kassor anslutna i Sverige (Klarsynt). Inte kompatibel för den norska marknaden.',
    sourceUrl: 'https://shop.flopay.se/butik/molnbaserad-kontrollenhet-klarsynt/',
    manufacturerUrl: 'https://klarsynt.se',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/Kontrollenhet.png'
  },
  {
    id: 'flo-molntbredband',
    model: 'Mobilt bredband med router',
    category: 'Tillbehör',
    formFactor: 'Router + abonnemang',
    specs: {
      network: '4G-router (Telia)'
    },
    price: '149 kr/mån',
    sku: 'ArcherMR200_sim',
    extra: 'Bredband med mobilabonnemang från Telia inkl. router. 1 GB surf/månad, 36 mån bindningstid.',
    flo: 'Månadskostnad avser abonnemang med 36 månaders bindningstid.',
    sourceUrl: 'https://shop.flopay.se/butik/bredband-med-4g-router/',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/flo-wifi-1.jpg'
  },
  {
    id: 'flo-yubikey',
    model: 'Yubikey 5 NFC',
    category: 'Tillbehör',
    formFactor: 'Säkerhetsnyckel',
    specs: {
      network: 'FIDO2 / U2F / NFC'
    },
    price: '899 kr',
    sku: 'Y5NFV',
    extra: 'Security Key 5-serien — stark tvåfaktorsautentisering, autentisering utan lösenord och användarvänlig touch-to-sign.',
    flo: 'Säkerhetsnyckel med stöd för FIDO2, FIDO U2F, engångslösenord (OTP) och smart card.',
    sourceUrl: 'https://shop.flopay.se/butik/yubikey-5-nfc/',
    manufacturerUrl: 'https://www.yubico.com',
    imageUrl: 'https://shop.flopay.se/wp-content/uploads/yubikey-5-nfc.jpg'
  }
]

export const brands = {
  purspot: {
    id: 'purspot',
    mark: 'P',
    label: 'Purspot',
    brandText: 'Purspot Lathund',
    iconColors: { body: '#2a5142', stroke: '#96dac1', screen: '#69cba7', dark: '#1f3c32' },
    chips: [
      { icon: '🖥️', label: 'Kassasystem' },
      { icon: '🛍️', label: 'Expresskassa' },
      { icon: '💳', label: 'Kortterminal' },
      { icon: '🧾', label: 'Tillbehör' },
      { icon: '📱', label: 'SoftPOS' }
    ],
    badge: '💚 Purspot Intranet',
    titleStart: 'Alla',
    titleAccent: 'enheter',
    titleEnd: 'på en plats',
    sub: 'Kassasystem, expresskassor, kortterminaler och tillbehör från Purspot — bläddra, förstora bilder och få all information om varje produkt.',
    searchPlaceholder: 'Sök enhet, t.ex. T3, Flex 3, kassalåda…',
    statsLabel: 'support',
    infoEmoji: '💚',
    infoLabel: 'Purspot',
    infoLink: 'Mer info på Purspot.com ↗',
    ctaHint: 'info finns för alla Purspot-produkter',
    footer: 'Purspot AB · Internt · Alla enheter är Android-baserade',
    cta: {
      heading: 'Vill du se en demo?',
      text: 'Kontakta Purspot så visar vi hur ett komplett kassasystem kan se ut i din verksamhet.',
      label: 'Kontakta oss ↗',
      url: 'https://purspot.com'
    }
  },
  flo: {
    id: 'flo',
    mark: 'F',
    label: 'Moreflo · Northmill',
    brandText: 'Flo · Moreflo Northmill',
    iconColors: { body: '#3a2e4f', stroke: '#cdb5f0', screen: '#9663cd', dark: '#241d30' },
    chips: [
      { icon: '🖥️', label: 'Kassadator' },
      { icon: '💳', label: 'Kortterminal' },
      { icon: '🖨️', label: 'Kvittoskrivare' },
      { icon: '🔎', label: 'Streckkodsläsare' },
      { icon: '🏷️', label: 'Etikettskrivare' },
      { icon: '🧾', label: 'Förbrukning' }
    ],
    badge: '💜 Moreflo · Northmill',
    titleStart: 'Alla',
    titleAccent: 'Flo-enheter',
    titleEnd: 'på en plats',
    sub: 'Kassadatorer, kortterminaler, kvittoskrivare, vågar, etikettskrivare och tillbehör från Northmill Flo — med pris, artikelnr och all information för varje produkt.',
    searchPlaceholder: 'Sök enhet, t.ex. PAX A920, TSP143, POS80…',
    statsLabel: 'priser exkl. moms',
    infoEmoji: '💜',
    infoLabel: 'Flo Pay',
    infoLink: 'Öppna i webshopen ↗',
    ctaHint: 'priser och artikelnr från shop.flopay.se',
    footer: 'Moreflo · Northmill · Flo Pay · Priser exkl. moms',
    cta: {
      heading: 'Vill du beställa eller se priser?',
      text: 'Priser och artikelnr kommer från shop.flopay.se — öppna webshopen eller kontakta Northmill Flo.',
      label: 'Öppna webshopen ↗',
      url: 'https://shop.flopay.se'
    }
  }
}

export const softposSteps = [
  { num: 1, label: 'Slå in belopp', icon: '📝' },
  { num: 2, label: 'Kunden blippar kort', icon: '💳' },
  { num: 3, label: 'Skicka digitalt kvitto', icon: '🧾' }
]

export const softposFeatures = [
  { icon: '💳', title: 'Kortbetalning', desc: 'Tap on Phone / PIN on Glass' },
  { icon: '💚', title: 'Swish', desc: 'Integrerad Swish-betalning' },
  { icon: '✉️', title: 'Digitala kvitton', desc: 'E-post / SMS' },
  { icon: '🏛️', title: 'Kontrollenhet', desc: 'Uppkoppling till Skatteverkets kontrollenhet' }
]