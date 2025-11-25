import { db, admins } from './index';
import { eq } from 'drizzle-orm';

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@justadrop.xyz';
  const password = process.env.ADMIN_PASSWORD || 'admin123456';
  const name = process.env.ADMIN_NAME || 'Admin';

  const existing = await db.select().from(admins).where(eq(admins.email, email));

  if (existing.length > 0) {
    console.log(`Admin with email ${email} already exists`);
    process.exit(0);
  }

  const password_hash = await Bun.password.hash(password);

  const newAdmin = await db.insert(admins).values({
    name,
    email,
    password_hash,
  }).returning();

  console.log('Admin created successfully:');
  console.log(`Email: ${newAdmin[0].email}`);
  console.log(`Name: ${newAdmin[0].name}`);
  console.log(`ID: ${newAdmin[0].id}`);

  process.exit(0);
}

seedAdmin().catch((error) => {
  console.error('Error seeding admin:', error);
  process.exit(1);
});
