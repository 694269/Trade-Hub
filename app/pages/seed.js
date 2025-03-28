import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import {
  users,
  sellers,
  invoices,
  income,
} from '@/app/lib/placeholder-data'; // adjust path if needed

async function seedUsers(client) {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;
  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );
  return insertedUsers.length;
}

async function seedSellers(client) {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS sellers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;
  const inserted = await Promise.all(
    sellers.map((s) =>
      client.sql`
        INSERT INTO sellers (id, name, email, image_url)
        VALUES (${s.id}, ${s.name}, ${s.email}, ${s.image_url})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );
  return inserted.length;
}

async function seedInvoices(client) {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      seller_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;
  const inserted = await Promise.all(
    invoices.map((inv) =>
      client.sql`
        INSERT INTO invoices (seller_id, amount, status, date)
        VALUES (${inv.seller_id}, ${inv.amount}, ${inv.status}, ${inv.date})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );
  return inserted.length;
}

async function seedIncome(client) {
  await client.sql`
    CREATE TABLE IF NOT EXISTS income (
      month VARCHAR(4) NOT NULL UNIQUE,
      income INT NOT NULL
    );
  `;
  const inserted = await Promise.all(
    income.map((item) =>
      client.sql`
        INSERT INTO income (month, income)
        VALUES (${item.month}, ${item.income})
        ON CONFLICT (month) DO NOTHING;
      `
    )
  );
  return inserted.length;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    const client = await db.connect();
    const usersCount = await seedUsers(client);
    const sellersCount = await seedSellers(client);
    const invoicesCount = await seedInvoices(client);
    const incomeCount = await seedIncome(client);

    await client.end();

    return res.status(200).json({
      message: 'Database seeded successfully',
      users: usersCount,
      sellers: sellersCount,
      invoices: invoicesCount,
      income: incomeCount,
    });
  } catch (err) {
    console.error('Seeding failed:', err);
    return res.status(500).json({ error: 'Seeding failed', details: err.message });
  }
}
