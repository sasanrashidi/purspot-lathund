// =============================================================
// Regelfil för Paketbyggaren – PURSPOT.
// -------------------------------------------------------------
// Varje verksamhetstyp har en EXAKT lista över enheter som ska
// synas. Enheterna visas med samma bilder som på förstasidan
// "Hårdvara" (via `devices` i src/data.js). Terminaler har
// driftsätt (Läge A/B/C); tillbehör har krav på vilken roll som
// måste finnas i paketet för att de ska vara giltiga.
// =============================================================

// Driftsätt – etiketter och märkning (Läge A/B/C)
export const MODE_LABELS = {
  standalone: {
    badge: 'A',
    label: 'Fristående terminal',
    desc: 'Manuell beloppsinmatning'
  },
  register: {
    badge: 'B',
    label: 'Kassakopplad terminal',
    desc: 'Kräver kompatibel huvudkassa'
  },
  ecr: {
    badge: 'C',
    label: 'Minikassa / ECR on Device',
    desc: 'Softpos-appen körs direkt i terminalen'
  }
}

// =============================================================
// Verksamhetstyper – vilka enheter som hör till varje typ
// (skärmfilter för grundutbudet; prisberäkning ligger utanför).
// =============================================================
const RESTAURANT_DEVICES = [
  // Huvudkassor
  't2', 't3', 't3promax', 'd3mini',
  // Expresskassor
  'flex3-counter', 'flex3-floor',
  // Kortterminaler
  'rx5000', 'dx8000', 'a920',
  // Tillbehör
  'kds', 'orb', 'cloudprinter', 'kassalada'
]

const RETAIL_DEVICES = [
  // Huvudkassor
  't2', 't3', 't3promax', 'd3mini',
  // Kortterminaler
  'rx5000', 'dx8000', 'a920',
  // Tillbehör
  'orb', 'cloudprinter', 'kassalada'
]

const GROCERY_DEVICES = [
  // Huvudkassor
  't2', 't3', 't3promax', 'd3mini',
  // Kortterminaler
  'rx5000', 'dx8000', 'a920',
  // Tillbehör
  'cloudprinter', 'kassalada'
]

const EVENT_DEVICES = [
  // Huvudkassor
  't2', 't3', 't3promax', 'd3mini',
  // Kortterminaler
  'rx5000', 'dx8000', 'a920',
  // Tillbehör
  'cloudprinter', 'kassalada'
]

export const PURSPOT_RULES = {
  system: 'purspot',
  systemLabel: 'Purspot · Softpos',

  businessTypes: {
    restaurant: {
      id: 'restaurant',
      label: 'Restaurang',
      icon: '🍽️',
      hint: 'Kassa, köksskärm och expresskassa',
      devices: RESTAURANT_DEVICES
    },
    cafe: {
      id: 'cafe',
      label: 'Café',
      icon: '☕',
      hint: 'Kassa, köksskärm och expresskassa',
      devices: RESTAURANT_DEVICES
    },
    retail: {
      id: 'retail',
      label: 'Butik',
      icon: '👕',
      hint: 'Kassa, terminal och tillbehör',
      devices: RETAIL_DEVICES
    },
    grocery: {
      id: 'grocery',
      label: 'Livsmedel',
      icon: '🛒',
      hint: 'Kassa, terminal och tillbehör',
      devices: GROCERY_DEVICES
    },
    event: {
      id: 'event',
      label: 'Event',
      icon: '🎪',
      hint: 'Mobilt och kompakt',
      devices: EVENT_DEVICES
    }
  },

  // Roller – vilka enheter är kassor/expresskassor/terminaler/tillbehör
  mainRegisters: ['t2', 't3', 't3promax', 'd3mini'],
  expressRegisters: ['flex3-counter', 'flex3-floor'],

  // Kortterminaler och deras giltiga driftsätt
  terminals: {
    rx5000: { modes: ['standalone', 'register', 'ecr'] },
    dx8000: { modes: ['standalone', 'register', 'ecr'] },
    a920: { modes: ['standalone', 'register', 'ecr'] }
  },

  // Driftsätt som kräver att något annat är valt
  modeDependencies: {
    register: {
      requires: 'main',
      message: 'Kräver en kompatibel huvudkassa'
    }
  },

  // Tillbehör och deras krav (räcker med ETT av requires-alternativen)
  accessories: {
    kds: {
      requires: ['main', 'express'],
      message: 'Kräver en huvudkassa eller expresskassa'
    },
    orb: {
      requires: ['main', 'express'],
      message: 'Kräver en huvudkassa eller expresskassa'
    },
    cloudprinter: {
      requires: ['main', 'express'],
      message: 'Kräver en huvudkassa eller expresskassa'
    },
    kassalada: {
      requires: ['main'],
      message: 'Kräver en huvudkassa'
    }
  }
}

// Moreflo-regler kommer senare – hålls utanför tills de är spikade
export const FLO_RULES = null

// Välj rätt regler för ett varumärke/system
export function resolveRules(brand) {
  return brand === 'flo' ? FLO_RULES : PURSPOT_RULES
}
