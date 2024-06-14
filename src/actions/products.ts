"use server";
import clientPromise from "@/lib/mongodb";
import { Product } from "@/types/product";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
    const client = await clientPromise;
    const db = client.db("chat");
    const collection = db.collection("products");
    await collection.insertOne(product);
    revalidatePath("/put-product");
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Something went wrong while adding the product to the database",
    };
  }
};

export const getProducts = async () => {
  try {
    const client = await clientPromise;
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
      error:
        "Something went wrong while getting the products from the database",
    };
  }
};

export const searchProduct = async (searchTerm: string) => {
  try {
    const client = await clientPromise;
    const db = client.db("chat");
    const collection = db.collection<Product>("products");
    const products = await collection.find({ $text: { $search: searchTerm } }).toArray();
    return {
      success: true,
      products,
    };
  } catch (error) {
    console.error(error);
    return {
      error:
        "Something went wrong while searching the products from the database",
    };
  }
};

export const getProduct = async (id: string) => {
  try {
    const client = await clientPromise;
    const db = client.db("chat");
    const collection = db.collection<Product>("products");
    const product = await collection.findOne({ _id: new ObjectId(id) });
    return {
      success: true,
      product,
    };
  } catch (error) {
    console.error(error);
    return {
      error:
        "Something went wrong while getting the product from the database",
    };
  }
};