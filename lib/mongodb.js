// lib/mongodb.js

import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development, we use a global variable to avoid too many connections
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, use the MongoDB client directly
  clientPromise = client.connect();
}

export default clientPromise;
