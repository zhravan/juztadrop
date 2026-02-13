export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  initials: string;
  accent: 'primary' | 'accent' | 'mint' | 'dark';
  image?: string;
  linkedIn?: string;
  email?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Shravan Kumar B',
    role: 'Community Steward',
    department: 'Community',
    bio: 'Nurturing and growing our volunteer community.',
    initials: 'SK',
    accent: 'primary',
    image: '/images/shravan.png',
    linkedIn: 'https://www.linkedin.com/in/zhravan/',
    email: 'mrshravankumarb@gmail.com',
  },
  {
    id: '2',
    name: 'Arnav Nath',
    role: 'UI UX Designer',
    department: 'Design',
    bio: 'Crafting intuitive and impactful experiences.',
    initials: 'AN',
    accent: 'accent',
    image: '/images/arnav.png',
    linkedIn: 'https://www.linkedin.com/in/arnav-nath-6baab721b/',
    email: 'arnavnath55@gmail.com',
  },
  {
    id: '3',
    name: 'Somashekar B R',
    role: 'Full Stack Engineer',
    department: 'Engineering',
    bio: 'Building the platform that connects volunteers with impact.',
    initials: 'SB',
    accent: 'dark',
    image: '/images/somashekar.jpeg',
    linkedIn: 'https://www.linkedin.com/in/somashekar-b-4910a9129/',
  },
];
