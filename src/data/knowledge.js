export const knowledgeDomains = [
    {
      id: 'science',
      name: 'SCIENCE',
      color: '#48a9ff',
      description: 'Discoveries that changed how we understand reality.',
    },
    {
      id: 'philosophy',
      name: 'PHILOSOPHY',
      color: '#b47cff',
      description: 'Ideas that changed how humanity thinks.',
    },
    {
      id: 'history',
      name: 'HISTORY',
      color: '#ffb45c',
      description: 'Events connected through chains of consequence.',
    },
    {
      id: 'technology',
      name: 'TECHNOLOGY',
      color: '#35e0c0',
      description: 'Inventions built from earlier breakthroughs.',
    },
    {
      id: 'mathematics',
      name: 'MATHEMATICS',
      color: '#789cff',
      description: 'Patterns and ideas that became foundations.',
    },
    {
      id: 'art',
      name: 'ART',
      color: '#ff65bd',
      description: 'Creative movements shaped by people and ideas.',
    },
  ]
  
  export const causalChains = {
    telegraph: {
      title: 'The Telegraph',
      year: '1830s–1840s',
      domain: 'technology',
      description:
        'The telegraph transformed communication by allowing messages to travel rapidly across long distances.',
      causes: [
        'Electrical experiments',
        'Morse code',
        'Development of wired electrical networks',
      ],
      effects: [
        'Telephone',
        'Radio communication',
        'Modern telecommunications',
      ],
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
      causes: [
        'Studies of static electricity',
        'Magnetism',
        'Early electrical experiments',
      ],
      effects: [
        'Telegraph',
        'Electric motors',
        'Computing',
        'Modern electronics',
      ],
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
      causes: [
        'Movable type',
        'Paper production',
        'Demand for books',
      ],
      effects: [
        'Mass literacy',
        'Scientific communication',
        'Reformation',
        'Rapid spread of ideas',
      ],
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
      causes: [
        'Printing press',
        'Renaissance scholarship',
        'Astronomical observations',
      ],
      effects: [
        'Modern scientific method',
        'Physics',
        'Modern astronomy',
        'Industrial technology',
      ],
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
  }
  
  export function findKnowledge(query) {
    const normalized = query.toLowerCase().trim()
  
    const match = Object.values(causalChains).find((item) => {
      return (
        item.title.toLowerCase().includes(normalized) ||
        item.domain.toLowerCase().includes(normalized) ||
        item.chain.some((node) =>
          node.toLowerCase().includes(normalized),
        )
      )
    })
  
    return match || null
  }