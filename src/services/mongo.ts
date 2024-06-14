import { MongoClient } from "mongodb";

// Replace the uri string with your connection string.
const uri = process.env.MONGODB_URI!;

const mongo = new MongoClient(uri);

export default mongo;

export const db = mongo.db("chat");

export const collection = db.collection("products");