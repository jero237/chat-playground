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
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function ProductBadge({
  name,
  productId,
}: {
  name: string;
  productId: string;
}) {
  const [product, setProduct] = useState<Product>();
  const isDesktop = useMediaQuery("(min-width: 768px)");
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


  if (isDesktop) return (
    <HoverCard>
      <HoverCardTrigger>
        <Badge className="cursor-pointer">{name}</Badge>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="grid grid-cols-3 gap-2">
          <img alt="Product image" className="flex-1 aspect-square rounded-md object-cover overflow-hidden" src={product?.image || "https://placehold.co/600x400"} />
          <div className="space-y-1 col-span-2">
            <h4 className="text-sm font-semibold">{product?.name || "Producto inexistente"}</h4>
            <p className="text-xs">
              {product?.description || "A veces gpt alucina y se inventa productos"}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )

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
            className="aspect-square rounded-md object-cover size-72 overflow-hidden"
            src={product?.image || "https://placehold.co/600x400"}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
