export default async function handler(request) {
  return new Response(JSON.stringify({ pong: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
