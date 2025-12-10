import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';  // Ensure 'next/headers' is used
import clientPromise from '@/lib/mongodb';  // Make sure your MongoDB connection logic is correct
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    // Connect to MongoDB client
    const client = await clientPromise;
    const { email, password } = await req.json();

    // Access the database and collection
    const db = client.db("auth");
    const collection = db.collection("users");

    // Find user in the database by email
    const user = await collection.findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not registered. Complete registration first" }),
        { status: 404 }
      );
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // Token expiration time
      );

      // Set the token in cookies
      const cookieStore = await cookies();
      cookieStore.set("token", token, {
        httpOnly: true,  // Cookie cannot be accessed by JS
        secure: process.env.NODE_ENV === 'production',  // Only use HTTPS in production
        path: "/",
        domain: process.env.COOKIE_DOMAIN || "localhost",  // Handle domain setting, use 'localhost' for local dev
        maxAge: 60 * 60 * 7 * 24,  // Cookie expires after 7 days
        sameSite: "Lax",  // SameSite policy (Lax for basic CSRF protection)
      });

      return new Response(
        JSON.stringify({ message: "success" }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "Login failed" }),
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error during login process: ", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
