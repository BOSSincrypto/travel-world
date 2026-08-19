export type Memory = {
  id: string
  countryId: string
  title: string
  excerpt: string
  date: string
  rating: number
  image: string
  accent: string
}

export const starterMemories: Memory[] = [
  {
    id: 'memory-kyoto', countryId: 'япония', title: 'Quiet in Arashiyama',
    excerpt: 'The bamboo grove wakes before the city. I left my phone in the pack and kept walking.',
    date: 'Apr 12, 2026', rating: 5, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=82', accent: '#f7b267',
  },
  {
    id: 'memory-lisbon', countryId: 'португалия', title: 'Light over Alfama',
    excerpt: 'A random tram, warm pastry, and a view of the Tagus from a staircase missing on the map.',
    date: 'Feb 28, 2026', rating: 4, image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=82', accent: '#69d2c6',
  },
  {
    id: 'memory-patagonia', countryId: 'аргентина', title: 'Patagonian wind',
    excerpt: 'Three hours to the glacier, one pack, and the feeling that the horizon had grown wider.',
    date: 'Jan 04, 2026', rating: 5, image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&q=82', accent: '#9c8cff',
  },
]
