import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const { name, email, password } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  const client = await clientPromise;
  const db = client.db("auth");
  const users = db.collection("users");

  // ✅ Check if user exists (MUST use await)
  const exists = await users.findOne({ email });

  if (exists) {
    return Response.json(
      { message: "User exists, proceed to login" },
      { status: 400 }
    );
  }

  // ✅ Insert new user
  const register = await users.insertOne({
    name,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  return Response.json(
    { message: "User registered", id: register.insertedId },
    { status: 201 }
  );
}
