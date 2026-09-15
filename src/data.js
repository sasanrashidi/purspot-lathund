export const categories = [
  'Alla',
  'Kassasystem',
  'Expresskassa',
  'Kortterminal',
  'Tillbehör'
]

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
]

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