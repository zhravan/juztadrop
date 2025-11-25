export interface Volunteer {
  id: string;
  name: string;
  email: string;
  skills: string[];
  availability: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  description: string;
  website?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Opportunity {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  skillsRequired: string[];
  duration: string;
  location: string;
  status: 'open' | 'closed' | 'filled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Application {
  id: string;
  volunteerId: string;
  opportunityId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}
