import { db } from '@vercel/postgres';

export async function GET() {
  try {
    const client = await db.connect();
    const result = await client.sql`
      SELECT invoices.amount, sellers.name, sellers.image_url, sellers.email, invoices.id
      FROM invoices
      JOIN sellers ON invoices.seller_id = sellers.id
      ORDER BY invoices.date DESC
      LIMIT 5
    `;

    await client.end();

    // Optional: format currency if needed
    const latestInvoices = result.rows.map((invoice) => ({
      ...invoice,
      // amountFormatted: formatCurrency(invoice.amount), // only if you import formatCurrency
    }));

    return new Response(JSON.stringify(latestInvoices), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error fetching latest invoices:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch invoices' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
