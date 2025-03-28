import { db } from '@vercel/postgres';

export async function GET() {
  try {
    const client = await db.connect();
    const result = await client.sql`SELECT * FROM users`;
    await client.end();

    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}