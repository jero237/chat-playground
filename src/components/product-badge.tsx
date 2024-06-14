"use client";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { getProduct } from "@/actions/products";

export default function ProductBadge({
  name,
  productId,
}: {
  name: string;
  productId: string;
}) {
  const [product, setProduct] = useState<Product>();
  useEffect(() => {
    if (productId) {
      getProduct(productId).then((res) => {
        if (res.success) {
          setProduct(res.product as Product);
        }
      });
    }
  }, [productId]);

  if (!productId || !name) return null;

  return (
    <Drawer>
      <DrawerTrigger>
        <Badge className="cursor-pointer">{name}</Badge>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{product?.name || "Producto inexistente"}</DrawerTitle>
          <DrawerDescription>
            {product?.description ||
              "A veces gpt alucina y se inventa productos"}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <img
            alt="Product image"
            className="aspect-square rounded-md object-cover"
            src={product?.image || "https://placehold.co/600x400"}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
