export const DOMAINS = [
    {
      key: 'science',
      name: 'SCIENCE',
      color: '#48a9ff',
      position: [-3.5, 1.8, 0],
      tagline: 'Discoveries that changed how we understand reality.',
      suggestions: ['Electricity', 'Vaccines', 'Evolution', 'The Telescope'],
    },
    {
      key: 'philosophy',
      name: 'PHILOSOPHY',
      color: '#b47cff',
      position: [3.3, 1.7, -0.3],
      tagline: 'Ideas that changed how humanity thinks.',
      suggestions: ['The Enlightenment', 'Printing press', 'The Internet', 'Democracy'],
    },
    {
      key: 'history',
      name: 'HISTORY',
      color: '#ffb45c',
      position: [-4, -1.5, -0.2],
      tagline: 'Events connected through chains of consequence.',
      suggestions: ['The Printing Press', 'The Railway', 'The Telegraph', 'World War I'],
    },
    {
      key: 'technology',
      name: 'TECHNOLOGY',
      color: '#35e0c0',
      position: [4, -1.4, 0.1],
      tagline: 'Inventions built from earlier breakthroughs.',
      suggestions: ['The Telegraph', 'The Internet', 'The Transistor', 'The Smartphone'],
    },
    {
      key: 'mathematics',
      name: 'MATHEMATICS',
      color: '#789cff',
      position: [-1.8, -3, -0.5],
      tagline: 'Patterns and ideas that became foundations.',
      suggestions: ['Calculus', 'Zero', 'Probability', 'The Computer'],
    },
    {
      key: 'art',
      name: 'ART',
      color: '#ff65bd',
      position: [2, -3, -0.2],
      tagline: 'Creative movements shaped by people and ideas.',
      suggestions: ['Impressionism', 'Photography', 'The Printing Press', 'The Internet'],
    },
  ]
  
  export const getDomain = (key) => DOMAINS.find((domain) => domain.key === key) || null