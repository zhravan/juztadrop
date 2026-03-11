import type {
  UserRepository,
  Volunteer,
  VolunteerFilters,
  VolunteerWithUser,
} from '../repositories/user.repository.js';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getVolunteers(filters: VolunteerFilters): Promise<{
    items: Volunteer[];
    total: number;
  }> {
    return this.userRepository.findVolunteers(filters);
  }

  async getVolunteerById(userId: string): Promise<VolunteerWithUser | null> {
    return this.userRepository.findVolunteerById(userId);
  }
}
