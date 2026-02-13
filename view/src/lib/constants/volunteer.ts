// Backend cause enum: animal_welfare, environmental, humanitarian, education, healthcare,
// poverty_alleviation, women_empowerment, child_welfare, elderly_care, disability_support,
// rural_development, urban_development, arts_culture, sports, technology, other
export const VOLUNTEER_CAUSES = [
  { value: 'animal_welfare', label: 'Animal welfare' },
  { value: 'environmental', label: 'Environment' },
  { value: 'humanitarian', label: 'Humanitarian' },
  { value: 'education', label: 'Education' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'poverty_alleviation', label: 'Poverty alleviation' },
  { value: 'women_empowerment', label: 'Women empowerment' },
  { value: 'child_welfare', label: 'Child welfare' },
  { value: 'elderly_care', label: 'Elderly care' },
  { value: 'disability_support', label: 'Disability support' },
  { value: 'rural_development', label: 'Rural development' },
  { value: 'urban_development', label: 'Urban development' },
  { value: 'arts_culture', label: 'Arts & culture' },
  { value: 'sports', label: 'Sports' },
  { value: 'technology', label: 'Technology' },
  { value: 'other', label: 'Other' },
] as const;

// Backend skills: { name: string; expertise: string }
export const VOLUNTEER_SKILLS = [
  'Teaching',
  'Event coordination',
  'Social media',
  'Fundraising',
  'Photography',
  'First aid',
  'Translation',
  'Driving',
  'Gardening',
  'Cooking',
] as const;

export const SKILL_EXPERTISE = ['beginner', 'intermediate', 'expert'] as const;

export const AVAILABILITY_OPTIONS = [
  'Weekends',
  'Weekdays',
  'Evenings',
  'Mornings',
  'Flexible',
] as const;
