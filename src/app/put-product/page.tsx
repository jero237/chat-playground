import { getProducts, putProduct } from "@/actions/products";
import Header from "@/components/header";
import ProductsTable from "@/components/products-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function PutProductPage() {
  const products = await getProducts();
  return (
    <div className="flex flex-col gap-4 p-4">
      <Header title="Put Product" />
      <Card className="">
        <CardHeader>
          <CardTitle>Create Product</CardTitle>
          <CardDescription>Adds a new product to MongoDB</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-2" action={putProduct}>
            <Input placeholder="Name" name="name" />
            <Input placeholder="Description" name="description" />
            <Input placeholder="Price" type="number" name="price" />
            <Input placeholder="Image" name="image" />
            <Button type="submit">Create Product</Button>
          </form>
        </CardContent>
      </Card>
      {products.success && <ProductsTable products={products.products} />}
    </div>
  );
}
