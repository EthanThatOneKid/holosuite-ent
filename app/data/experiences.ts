export interface Experience {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  duration: string;
  featured?: boolean;
}

export const experiences: Experience[] = [
  // Featured
  {
    id: '1',
    title: 'Mars Colony Sunrise',
    description: 'Experience the breathtaking dawn over humanity\'s first settlement on Mars. Watch as the red planet awakens.',
    thumbnail: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&auto=format&fit=crop',
    category: 'Space',
    duration: '5 min',
    featured: true,
  },

  // Space Experiences
  {
    id: '2',
    title: 'Saturn Ring Fly-Through',
    description: 'Navigate through the majestic rings of Saturn in stunning detail.',
    thumbnail: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&auto=format&fit=crop',
    category: 'Space',
    duration: '4 min',
  },
  {
    id: '3',
    title: 'International Space Station',
    description: 'Float through the ISS and witness Earth from orbit.',
    thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&auto=format&fit=crop',
    category: 'Space',
    duration: '6 min',
  },
  {
    id: '4',
    title: 'Black Hole Encounter',
    description: 'Safely observe a black hole up close and witness its gravitational lensing.',
    thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop',
    category: 'Space',
    duration: '8 min',
  },

  // Nature Experiences
  {
    id: '5',
    title: 'Amazon Rainforest Canopy',
    description: 'Glide through the lush canopy of the Amazon at dawn.',
    thumbnail: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&auto=format&fit=crop',
    category: 'Nature',
    duration: '7 min',
  },
  {
    id: '6',
    title: 'Northern Lights in Iceland',
    description: 'Witness the aurora borealis dance across the Arctic sky.',
    thumbnail: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800&auto=format&fit=crop',
    category: 'Nature',
    duration: '5 min',
  },
  {
    id: '7',
    title: 'Great Barrier Reef Dive',
    description: 'Swim alongside vibrant coral and exotic marine life.',
    thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop',
    category: 'Nature',
    duration: '10 min',
  },

  // Historical Experiences
  {
    id: '8',
    title: 'Ancient Rome Restored',
    description: 'Walk through the Roman Forum at the height of the empire.',
    thumbnail: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop',
    category: 'History',
    duration: '12 min',
  },
  {
    id: '9',
    title: 'Egyptian Pyramids Construction',
    description: 'Witness the building of the Great Pyramid of Giza.',
    thumbnail: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800&auto=format&fit=crop',
    category: 'History',
    duration: '9 min',
  },
  {
    id: '10',
    title: 'Viking Longship Voyage',
    description: 'Join a Viking crew on their journey across the North Atlantic.',
    thumbnail: 'https://images.unsplash.com/photo-1601980497119-323ae933d771?w=800&auto=format&fit=crop',
    category: 'History',
    duration: '11 min',
  },

  // Fantasy Experiences
  {
    id: '11',
    title: 'Dragon Mountain Peak',
    description: 'Soar with dragons over a mythical mountain kingdom.',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop',
    category: 'Fantasy',
    duration: '6 min',
  },
  {
    id: '12',
    title: 'Underwater Crystal City',
    description: 'Explore a mystical city beneath the waves.',
    thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop',
    category: 'Fantasy',
    duration: '8 min',
  },
  {
    id: '13',
    title: 'Enchanted Forest Night',
    description: 'Wander through a magical forest illuminated by bioluminescent flora.',
    thumbnail: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&auto=format&fit=crop',
    category: 'Fantasy',
    duration: '7 min',
  },

  // Urban Experiences
  {
    id: '14',
    title: 'Tokyo Neon Nights',
    description: 'Experience the electric energy of Tokyo\'s neon-lit streets.',
    thumbnail: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop',
    category: 'Urban',
    duration: '5 min',
  },
  {
    id: '15',
    title: 'New York Skyline Flight',
    description: 'Fly through the Manhattan skyline at golden hour.',
    thumbnail: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop',
    category: 'Urban',
    duration: '4 min',
  },
];

export const categories = ['All', 'Space', 'Nature', 'History', 'Fantasy', 'Urban'];

export function getExperiencesByCategory(category: string): Experience[] {
  if (category === 'All') {
    return experiences;
  }
  return experiences.filter(exp => exp.category === category);
}

export function getFeaturedExperience(): Experience | undefined {
  return experiences.find(exp => exp.featured);
}
