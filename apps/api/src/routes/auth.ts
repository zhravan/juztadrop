import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { db, volunteers, organizations, admins } from '@justadrop/db';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const authRouter = new Elysia({ prefix: '/auth', tags: ['auth'] })
  .use(jwt({ name: 'jwt', secret: JWT_SECRET }))

  // Volunteer Registration
  .post('/volunteer/register', async ({ body, jwt }) => {
    const existing = await db.select().from(volunteers).where(eq(volunteers.email, body.email));
    if (existing.length > 0) {
      throw new Error('Email already registered');
    }

    const password_hash = await Bun.password.hash(body.password);
    const newVolunteer = await db.insert(volunteers).values({
      name: body.name,
      email: body.email,
      password_hash,
      skills: body.skills,
      availability: body.availability,
    }).returning();

    const token = await jwt.sign({
      id: newVolunteer[0].id,
      type: 'volunteer'
    });

    return {
      token,
      user: { ...newVolunteer[0], password_hash: undefined }
    };
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      password: t.String({ minLength: 8 }),
      skills: t.Array(t.String()),
      availability: t.String(),
    }),
    detail: {
      summary: 'Register as volunteer',
      description: 'Create a new volunteer account (auto-approved)',
    }
  })

  // Volunteer Login
  .post('/volunteer/login', async ({ body, jwt }) => {
    const volunteer = await db.select().from(volunteers).where(eq(volunteers.email, body.email));
    if (volunteer.length === 0) {
      throw new Error('Invalid credentials');
    }

    const isValid = await Bun.password.verify(body.password, volunteer[0].password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = await jwt.sign({
      id: volunteer[0].id,
      type: 'volunteer'
    });

    return {
      token,
      user: { ...volunteer[0], password_hash: undefined }
    };
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    }),
    detail: {
      summary: 'Volunteer login',
      description: 'Login as a volunteer',
    }
  })

  // Organization Registration
  .post('/organization/register', async ({ body, jwt }) => {
    const existing = await db.select().from(organizations).where(eq(organizations.email, body.email));
    if (existing.length > 0) {
      throw new Error('Email already registered');
    }

    const password_hash = await Bun.password.hash(body.password);
    const newOrg = await db.insert(organizations).values({
      name: body.name,
      email: body.email,
      password_hash,
      description: body.description,
      website: body.website,
    }).returning();

    const token = await jwt.sign({
      id: newOrg[0].id,
      type: 'organization'
    });

    return {
      token,
      user: { ...newOrg[0], password_hash: undefined },
      message: 'Account created. Awaiting admin approval.'
    };
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      password: t.String({ minLength: 8 }),
      description: t.String(),
      website: t.Optional(t.String()),
    }),
    detail: {
      summary: 'Register as organization',
      description: 'Create a new organization account (requires admin approval)',
    }
  })

  // Organization Login
  .post('/organization/login', async ({ body, jwt }) => {
    const org = await db.select().from(organizations).where(eq(organizations.email, body.email));
    if (org.length === 0) {
      throw new Error('Invalid credentials');
    }

    if (org[0].approval_status === 'blacklisted') {
      throw new Error('Account has been suspended');
    }

    const isValid = await Bun.password.verify(body.password, org[0].password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = await jwt.sign({
      id: org[0].id,
      type: 'organization'
    });

    return {
      token,
      user: { ...org[0], password_hash: undefined },
      approval_status: org[0].approval_status
    };
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    }),
    detail: {
      summary: 'Organization login',
      description: 'Login as an organization',
    }
  })

  // Admin Login
  .post('/admin/login', async ({ body, jwt }) => {
    const admin = await db.select().from(admins).where(eq(admins.email, body.email));
    if (admin.length === 0) {
      throw new Error('Invalid credentials');
    }

    const isValid = await Bun.password.verify(body.password, admin[0].password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = await jwt.sign({
      id: admin[0].id,
      type: 'admin'
    });

    return {
      token,
      user: { ...admin[0], password_hash: undefined }
    };
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    }),
    detail: {
      summary: 'Admin login',
      description: 'Login as an administrator',
    }
  });
