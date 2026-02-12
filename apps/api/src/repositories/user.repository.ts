import { db, users } from '@justadrop/db';
import { eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  isAdmin: boolean;
  name: string | null;
  phone: string | null;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
  isBanned: boolean;
  volunteering: any;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      isAdmin: user.isAdmin,
      name: user.name,
      phone: user.phone,
      gender: user.gender,
      isBanned: user.isBanned,
      volunteering: user.volunteering,
      deletedAt: user.deletedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findById(id: string): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      isAdmin: user.isAdmin,
      name: user.name,
      phone: user.phone,
      gender: user.gender,
      isBanned: user.isBanned,
      volunteering: user.volunteering,
      deletedAt: user.deletedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async create(email: string, emailVerified: boolean = false): Promise<User> {
    const id = createId();
    await db.insert(users).values({
      id,
      email,
      emailVerified,
    });

    const user = await this.findById(id);
    if (!user) {
      throw new Error('Failed to create user');
    }

    return user;
  }

  async updateEmailVerified(id: string, emailVerified: boolean): Promise<void> {
    await db
      .update(users)
      .set({ emailVerified })
      .where(eq(users.id, id));
  }
}
