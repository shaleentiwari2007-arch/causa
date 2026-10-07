export const knowledgeDomains = [
  {
    id: 'science',
    name: 'SCIENCE',
    color: '#48a9ff',
  },
  {
    id: 'philosophy',
    name: 'PHILOSOPHY',
    color: '#b47cff',
  },
  {
    id: 'history',
    name: 'HISTORY',
    color: '#ffb45c',
  },
  {
    id: 'technology',
    name: 'TECHNOLOGY',
    color: '#35e0c0',
  },
  {
    id: 'mathematics',
    name: 'MATHEMATICS',
    color: '#789cff',
  },
  {
    id: 'art',
    name: 'ART',
    color: '#ff65bd',
  },
]

export const causalChains = {
  telegraph: {
    title: 'The Telegraph',
    year: '1837',
    domain: 'Technology',
    description:
      'The telegraph transformed communication by allowing information to travel across long distances through electrical signals.',
    causes: [
      'Understanding of electricity',
      'Development of electrical circuits',
      'Need for faster long-distance communication',
    ],
    effects: [
      'Railway communication networks',
      'Faster news distribution',
      'Telephone development',
      'Modern telecommunications',
    ],
    chain: [
      'Electricity',
      'Electrical Circuits',
      'Morse Code',
      'Telegraph',
      'Telephone',
      'Radio',
      'Internet',
    ],
    nodes: {
      Electricity: {
        era: '1600s–1800s',
        type: 'FOUNDATION',
        description:
          'Experiments with electricity created the scientific foundation required for electrical communication.',
        ledTo: ['Electrical Circuits'],
        causes: [
          'Experiments with static electricity',
          'Study of electrical charge',
        ],
      },

      'Electrical Circuits': {
        era: '1800s',
        type: 'TECHNOLOGY',
        description:
          'Scientists learned how controlled electrical currents could travel through conductive paths.',
        ledTo: ['Morse Code'],
        causes: [
          'Understanding electrical current',
          'Development of batteries',
        ],
      },

      'Morse Code': {
        era: '1830s',
        type: 'INNOVATION',
        description:
          'A symbolic system converted letters and numbers into patterns of electrical signals.',
        ledTo: ['Telegraph'],
        causes: [
          'Need to encode messages',
          'Electrical signaling experiments',
        ],
      },

      Telegraph: {
        era: '1837',
        type: 'BREAKTHROUGH',
        description:
          'The telegraph made long-distance communication possible using electrical signals.',
        ledTo: ['Telephone', 'Railway Networks'],
        causes: [
          'Morse code',
          'Electrical circuits',
          'Demand for rapid communication',
        ],
      },

      Telephone: {
        era: '1876',
        type: 'BREAKTHROUGH',
        description:
          'The telephone extended electrical communication from encoded signals to human voice.',
        ledTo: ['Radio'],
        causes: [
          'Telegraph infrastructure',
          'Electrical signal transmission',
        ],
      },

      Radio: {
        era: '1890s–1900s',
        type: 'COMMUNICATION',
        description:
          'Radio introduced wireless transmission of information across large distances.',
        ledTo: ['Internet'],
        causes: [
          'Electromagnetic wave research',
          'Wireless communication experiments',
        ],
      },

      Internet: {
        era: '1960s–1990s',
        type: 'NETWORK',
        description:
          'Computer networks evolved into a global system for exchanging information digitally.',
        ledTo: ['Modern Digital Communication'],
        causes: [
          'Computer networking',
          'Packet switching',
          'Telecommunication infrastructure',
        ],
      },
    },
  },

  electricity: {
    title: 'The Rise of Electricity',
    year: '1800s',
    domain: 'Science',
    description:
      'The study of electricity evolved from scientific experiments into one of the foundations of modern technology.',
    causes: [
      'Study of electric charge',
      'Experiments with batteries',
      'Research into electromagnetism',
    ],
    effects: [
      'Electric motors',
      'Power grids',
      'Telegraph',
      'Modern electronics',
    ],
    chain: [
      'Electric Charge',
      'Battery',
      'Electromagnetism',
      'Electric Motor',
      'Power Grid',
      'Electronics',
    ],
    nodes: {
      'Electric Charge': {
        era: '1600s–1700s',
        type: 'DISCOVERY',
        description:
          'Early experiments revealed that matter could produce and store electrical charge.',
        ledTo: ['Battery'],
        causes: [
          'Static electricity experiments',
          'Study of charged materials',
        ],
      },

      Battery: {
        era: '1800',
        type: 'INVENTION',
        description:
          'The first practical battery provided a continuous source of electrical current.',
        ledTo: ['Electromagnetism'],
        causes: [
          'Understanding chemical reactions',
          'Experiments with electrical current',
        ],
      },

      Electromagnetism: {
        era: '1820s–1830s',
        type: 'DISCOVERY',
        description:
          'Scientists discovered the deep relationship between electricity and magnetism.',
        ledTo: ['Electric Motor'],
        causes: [
          'Electrical current experiments',
          'Magnetic field research',
        ],
      },

      'Electric Motor': {
        era: '1830s',
        type: 'INVENTION',
        description:
          'Electric motors converted electrical energy into mechanical motion.',
        ledTo: ['Power Grid'],
        causes: [
          'Electromagnetic principles',
          'Electromagnetic force experiments',
        ],
      },

      'Power Grid': {
        era: '1880s–1900s',
        type: 'INFRASTRUCTURE',
        description:
          'Electrical generation and distribution systems made electricity available at large scale.',
        ledTo: ['Electronics'],
        causes: [
          'Electric generators',
          'Transmission systems',
          'Industrial demand',
        ],
      },

      Electronics: {
        era: '1900s–present',
        type: 'TECHNOLOGY',
        description:
          'Electronic components enabled increasingly complex machines, computers, and digital systems.',
        ledTo: ['Computing', 'Digital Communication'],
        causes: [
          'Electrical engineering',
          'Semiconductor research',
        ],
      },
    },
  },

  printingPress: {
    title: 'The Printing Press',
    year: '1440',
    domain: 'History',
    description:
      'The printing press dramatically increased the speed and scale at which information could be reproduced and distributed.',
    causes: [
      'Development of movable type',
      'Advances in paper production',
      'Growing demand for books',
    ],
    effects: [
      'Mass literacy',
      'Scientific knowledge distribution',
      'Religious reform movements',
      'Expansion of education',
    ],
    chain: [
      'Writing Systems',
      'Paper',
      'Movable Type',
      'Printing Press',
      'Mass Publishing',
      'Scientific Revolution',
      'Modern Education',
    ],
    nodes: {
      'Writing Systems': {
        era: 'Ancient world',
        type: 'FOUNDATION',
        description:
          'Writing created a durable method for storing and transmitting human knowledge.',
        ledTo: ['Paper'],
        causes: [
          'Need to record information',
          'Development of symbolic language',
        ],
      },

      Paper: {
        era: '100s–700s',
        type: 'MATERIAL',
        description:
          'Paper provided a relatively efficient surface for recording and reproducing information.',
        ledTo: ['Movable Type'],
        causes: [
          'Development of papermaking',
          'Need for portable written material',
        ],
      },

      'Movable Type': {
        era: '1000s–1400s',
        type: 'INNOVATION',
        description:
          'Movable type allowed individual characters to be arranged and reused for printing.',
        ledTo: ['Printing Press'],
        causes: [
          'Development of type systems',
          'Demand for repeated text production',
        ],
      },

      'Printing Press': {
        era: '1440',
        type: 'BREAKTHROUGH',
        description:
          'The printing press made large-scale reproduction of written material possible.',
        ledTo: ['Mass Publishing', 'Scientific Revolution'],
        causes: [
          'Movable type',
          'Paper production',
          'Mechanical press technology',
        ],
      },

      'Mass Publishing': {
        era: '1500s–1800s',
        type: 'TRANSFORMATION',
        description:
          'Printed books and pamphlets allowed ideas to spread across populations at unprecedented scale.',
        ledTo: ['Scientific Revolution'],
        causes: [
          'Printing press',
          'Growing literacy',
          'Book production',
        ],
      },

      'Scientific Revolution': {
        era: '1500s–1700s',
        type: 'TRANSFORMATION',
        description:
          'Printed scientific ideas could be shared, challenged, reproduced, and built upon by researchers.',
        ledTo: ['Modern Education'],
        causes: [
          'Mass publishing',
          'Scientific correspondence',
          'Rapid knowledge distribution',
        ],
      },

      'Modern Education': {
        era: '1800s–present',
        type: 'SOCIETY',
        description:
          'Large-scale access to printed knowledge helped establish modern systems of education.',
        ledTo: ['Digital Learning'],
        causes: [
          'Mass literacy',
          'Printed textbooks',
          'Institutional education',
        ],
      },
    },
  },

  scientificRevolution: {
    title: 'The Scientific Revolution',
    year: '1500s–1700s',
    domain: 'Science',
    description:
      'A major transformation in how humans investigated nature, emphasizing observation, experimentation, mathematics, and evidence.',
    causes: [
      'Printing press',
      'Improved scientific instruments',
      'Exchange of ideas',
      'Mathematical developments',
    ],
    effects: [
      'Modern scientific method',
      'Classical physics',
      'Modern astronomy',
      'Technological development',
    ],
    chain: [
      'Printing Press',
      'Scientific Publishing',
      'Observation',
      'Experimentation',
      'Scientific Method',
      'Modern Science',
    ],
    nodes: {
      'Printing Press': {
        era: '1440',
        type: 'FOUNDATION',
        description:
          'Printed material accelerated the distribution and criticism of scientific ideas.',
        ledTo: ['Scientific Publishing'],
        causes: [
          'Movable type',
          'Mass production of books',
        ],
      },

      'Scientific Publishing': {
        era: '1500s–1600s',
        type: 'KNOWLEDGE',
        description:
          'Researchers gained new ways to distribute observations, experiments, and theories.',
        ledTo: ['Observation'],
        causes: [
          'Printing technology',
          'Scientific correspondence',
        ],
      },

      Observation: {
        era: '1500s–1600s',
        type: 'METHOD',
        description:
          'Systematic observation became increasingly important for understanding natural phenomena.',
        ledTo: ['Experimentation'],
        causes: [
          'Improved instruments',
          'Astronomical observations',
        ],
      },

      Experimentation: {
        era: '1600s',
        type: 'METHOD',
        description:
          'Controlled experiments provided a way to test explanations about the natural world.',
        ledTo: ['Scientific Method'],
        causes: [
          'Observation',
          'Mathematical analysis',
          'Need to test hypotheses',
        ],
      },

      'Scientific Method': {
        era: '1600s–1700s',
        type: 'FRAMEWORK',
        description:
          'Observation, hypothesis, experimentation, and evidence became central parts of scientific investigation.',
        ledTo: ['Modern Science'],
        causes: [
          'Experimental practice',
          'Mathematical reasoning',
          'Scientific debate',
        ],
      },

      'Modern Science': {
        era: '1700s–present',
        type: 'SYSTEM',
        description:
          'The scientific method became a foundation for modern research and technological progress.',
        ledTo: ['Modern Technology'],
        causes: [
          'Scientific method',
          'Accumulated scientific knowledge',
        ],
      },
    },
  },
}

export function findKnowledge(query) {
  const normalized = query.toLowerCase().trim()

  if (!normalized) {
    return null
  }

  const match = Object.values(causalChains).find((item) => {
    const titleMatch = item.title.toLowerCase().includes(normalized)
    const domainMatch = item.domain.toLowerCase().includes(normalized)

    const chainMatch = item.chain.some((node) =>
      node.toLowerCase().includes(normalized),
    )

    return titleMatch || domainMatch || chainMatch
  })

  return match || null
}