"use client";
import { getProduct } from "@/actions/products";
import { Product } from "@/types/product";
import { GemIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";

export default function ProductCard({
  name,
  productId,
}: {
  name: string;
  productId: string;
}) {
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (productId) {
      getProduct(productId)
        .then((res) => {
          if (res.success) {
            setProduct(res.product as Product);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [productId]);

  if (!productId || !name) return null;

  if (loading)
    return (
      <Card className="group relative h-32 transition-all hover:shadow-md md:max-w-96 hover:cursor-pointer">
        <div className="flex h-full">
          <div className="h-full overflow-hidden">
            <Skeleton className="h-full w-32 rounded-l-lg object-cover p-1" />
          </div>
          <div className="col-span-2">
            <CardHeader className="h-20 flex-row items-center gap-3 p-4">
              <div>
                <CardTitle className="flex max-h-full items-start overflow-hidden text-base">
                  {name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex px-4">
              <Skeleton className="w-20 h-8" />
            </CardContent>
          </div>
        </div>
      </Card>
    );

  return (
    <Card className="group relative h-32 transition-all hover:shadow-md md:max-w-max hover:cursor-pointer">
      <Link
        href="https://youtube.com/watch?v=dQw4w9WgXcQ"
        target="_blank"
        className="flex h-full"
      >
        {product?.image ? (
          <div className="h-full overflow-hidden">
            <img
              alt="Event Image"
              src={product?.image}
              className="h-full w-auto rounded-l-lg object-cover p-1"
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-l-lg bg-accent object-cover">
            <GemIcon className="size-8 stroke-accent-foreground" />
          </div>
        )}
        <div className="col-span-2">
          <CardHeader className="h-20 flex-row items-center gap-3 p-4">
            <div>
              <CardTitle className="flex max-h-full items-start overflow-hidden text-base">
                {name}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex px-4">
            <p className="tracking-tight text-xl font-light">
              ${product?.price}
            </p>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}
