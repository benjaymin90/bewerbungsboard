// Clerk webhooks no longer needed
export async function POST() {
  return new Response("OK", { status: 200 });
}
