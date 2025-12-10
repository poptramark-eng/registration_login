import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;

  const db = client.db("users");          // ✅ pick database
  const users = db.collection("user");        // ✅ pick collection

  const data = await users.find().toArray();

  return Response.json(data);
}
