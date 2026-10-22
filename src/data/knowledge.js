export const knowledgeDomains = [
  { id: 'science', name: 'SCIENCE', color: '#48a9ff', description: 'Discoveries that changed how we understand reality.' },
  { id: 'philosophy', name: 'PHILOSOPHY', color: '#b47cff', description: 'Ideas that changed how humanity thinks.' },
  { id: 'history', name: 'HISTORY', color: '#ffb45c', description: 'Events connected through chains of consequence.' },
  { id: 'technology', name: 'TECHNOLOGY', color: '#35e0c0', description: 'Inventions built from earlier breakthroughs.' },
  { id: 'mathematics', name: 'MATHEMATICS', color: '#789cff', description: 'Patterns and ideas that became foundations.' },
  { id: 'art', name: 'ART', color: '#ff65bd', description: 'Creative movements shaped by people and ideas.' },
]

export const causalChains = {
  telegraph: {
    title: 'The Telegraph',
    year: '1830s–1840s',
    domain: 'technology',
    description:
      'The telegraph transformed communication by allowing messages to travel rapidly across long distances.',
    causes: ['Electrical experiments', 'Morse code', 'Development of wired electrical networks'],
    effects: ['Telephone', 'Radio communication', 'Modern telecommunications'],
    chain: [
      'Electrical Experiments',
      'Telegraph',
      'Telephone',
      'Radio',
      'Transistor',
      'Integrated Circuit',
      'Microprocessor',
      'Personal Computer',
      'Internet',
      'Smartphone',
    ],
  },

  electricity: {
    title: 'Electricity',
    year: '18th–19th Century',
    domain: 'science',
    description:
      'Understanding electricity created the foundation for an enormous chain of scientific and technological development.',
    causes: ['Studies of static electricity', 'Magnetism', 'Early electrical experiments'],
    effects: ['Telegraph', 'Electric motors', 'Computing', 'Modern electronics'],
    chain: [
      'Static Electricity',
      'Electric Current',
      'Electromagnetism',
      'Telegraph',
      'Electric Power',
      'Electronics',
      'Computers',
      'Internet',
    ],
  },

  printingPress: {
    title: 'The Printing Press',
    year: 'c. 1440',
    domain: 'history',
    description:
      'Mass printing dramatically increased the speed and scale at which ideas could spread.',
    causes: ['Movable type', 'Paper production', 'Demand for books'],
    effects: ['Mass literacy', 'Scientific communication', 'Reformation', 'Rapid spread of ideas'],
    chain: [
      'Paper',
      'Movable Type',
      'Printing Press',
      'Mass Literacy',
      'Scientific Revolution',
      'Enlightenment',
      'Modern Knowledge',
    ],
  },

  scientificRevolution: {
    title: 'The Scientific Revolution',
    year: '16th–17th Century',
    domain: 'science',
    description:
      'A transformation in scientific thinking that emphasized observation, experimentation, and mathematical description.',
    causes: ['Printing press', 'Renaissance scholarship', 'Astronomical observations'],
    effects: ['Modern scientific method', 'Physics', 'Modern astronomy', 'Industrial technology'],
    chain: [
      'Renaissance',
      'Printing Press',
      'Scientific Revolution',
      'Scientific Method',
      'Modern Science',
      'Engineering',
      'Modern Technology',
    ],
  },

  enlightenment: {
    title: 'The Enlightenment',
    year: '17th–18th Century',
    domain: 'philosophy',
    description:
      'A philosophical movement that placed reason, individual rights, and skepticism of authority at the center of human thought.',
    causes: ['Scientific revolution', 'Rise of rationalism', 'Growth of literacy'],
    effects: ['Natural rights philosophy', 'Democratic government', 'Secular ethics'],
    chain: [
      'Rationalism',
      'Scientific Method',
      'Enlightenment',
      'Natural Rights',
      'Social Contract Theory',
      'Democracy',
      'Modern Human Rights',
    ],
  },

  calculus: {
    title: 'Calculus',
    year: 'Late 17th Century',
    domain: 'mathematics',
    description:
      'Calculus gave mathematics a language for describing continuous change, unlocking centuries of scientific and engineering progress.',
    causes: ['Ancient geometry', 'Analytic geometry', "Zeno's paradoxes of motion"],
    effects: ['Newtonian physics', 'Modern engineering', 'Computer science'],
    chain: [
      'Ancient Geometry',
      'Algebra',
      'Analytic Geometry',
      'Calculus',
      'Newtonian Physics',
      'Modern Engineering',
      'Computer Science',
    ],
  },

  impressionism: {
    title: 'Impressionism',
    year: '1870s–1880s',
    domain: 'art',
    description:
      'Impressionism broke from rigid academic painting, capturing light and fleeting moments — and opened the door to modern art.',
    causes: ['Invention of photography', 'Portable paint tubes', 'Rejection of academic realism'],
    effects: ['Post-Impressionism', 'Abstract art', 'Modern art movements'],
    chain: [
      'Photography',
      'Naturalism',
      'Impressionism',
      'Post-Impressionism',
      'Modern Art',
      'Abstract Art',
    ],
  },
}

const DOMAIN_WORDS = new Set([
  'science',
  'philosophy',
  'history',
  'technology',
  'mathematics',
  'art',
])

const normalize = (value = '') =>
  String(value).toLowerCase().trim().replace(/\s+/g, ' ').replace(/^the /, '')

export function chainsForDomain(domain) {
  return Object.values(causalChains).filter((chain) => chain.domain === domain)
}

/**
 * Looks up a curated chain. When `domain` is given, only chains from that
 * domain count, so other lenses fall through to the AI engine.
 */
export function findKnowledge(query, domain = null) {
  const q = normalize(query)
  if (q.length < 3 || DOMAIN_WORDS.has(q)) return null

  let best = null

  for (const chain of Object.values(causalChains)) {
    if (domain && chain.domain !== domain) continue

    const title = normalize(chain.title)
    let score = 0
    let focus = null

    if (title === q) {
      score = 4
    } else {
      const exact = chain.chain.find((node) => normalize(node) === q)

      if (exact) {
        score = 3
        focus = exact
      } else if (q.length >= 5 && (title.includes(q) || q.includes(title))) {
        score = 2
      } else if (q.length >= 5) {
        const partial = chain.chain.find((node) => {
          const key = normalize(node)
          return key.length >= 5 && (key.includes(q) || q.includes(key))
        })

        if (partial) {
          score = 1
          focus = partial
        }
      }
    }

    if (score > (best?.score ?? 0)) best = { chain, score, focus }
  }

  return best ? { ...best.chain, focus: best.focus } : null
}