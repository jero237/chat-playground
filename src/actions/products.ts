"use server";
import { Product } from "@/types/product";
import { MongoClient } from "mongodb";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const client = new MongoClient(process.env.MONGODB_URI!);

const schema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.coerce.number().optional(),
  image: z.string().optional(),
});

export const putProduct = async (formData: FormData) => {
  const validateFields = schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    image: formData.get("image"),
  });

  if (!validateFields.success) {
    console.log(validateFields.error.flatten().fieldErrors);
    return {
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  const { name, description, price, image } = validateFields.data;

  const product: Product = {
    name,
    description,
    price,
    image,
  };

  try {
    await client.connect();
    const db = client.db("chat");
    const collection = db.collection("products");
    await collection.insertOne(product);
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Something went wrong while adding the product to the database",
    };
  } finally {
    client.close();
    revalidatePath("/put-product");
    return {
      success: true,
    };
  }
};

export const getProducts = async () => {
  try {
    await client.connect();
    const db = client.db("chat");
    const collection = db.collection<Product>("products");
    const products = await collection.find().toArray();
    return {
      success: true,
      products,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Something went wrong while getting the products from the database",
    };
  } finally {
    client.close();
  }
};