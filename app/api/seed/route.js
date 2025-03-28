export async function POST() {
    return new Response(JSON.stringify({ message: 'Database seeded!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
