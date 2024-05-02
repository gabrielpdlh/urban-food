"use client";

import DiscountBadge from "@/app/_components/discount-badge";
import {
  formatCurrency,
  calculateProductTotalPrice,
} from "@/app/_helpers/price";
import Image from "next/image";
import { Prisma } from "@prisma/client";
import { Button } from "@/app/_components/ui/button";
import {
  BikeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TimerIcon,
} from "lucide-react";
import { useState } from "react";
import { Card } from "@/app/_components/ui/card";
import ProductList from "@/app/_components/product-list";

interface ProductDetailsProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>;
  complementaryProducts: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>[];
}

const ProductDetails = ({
  product,
  complementaryProducts,
}: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncreaseQuantityClick = () =>
    setQuantity((currentState) => currentState + 1);
  const handleDecreaseQuantityClick = () =>
    setQuantity((currentState) => {
      if (currentState === 1) return 1;

      return currentState - 1;
    });

  return (
    <div className=" relative z-50 mt-[-1.5rem] rounded-tl-3xl rounded-tr-3xl bg-white py-5">
      {/* RESTAURANTE */}
      <div className="flex items-center gap-[0.375rem] px-5">
        <div className="relative  h-6 w-6">
          <Image
            src={product.restaurant.imageUrl}
            alt={product.restaurant.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {product.restaurant.name}
        </span>
      </div>

      {/* NOME DO PRODUTO */}
      <h1 className="mb-3 mt-1 text-xl font-semibold px-5">{product.name}</h1>

      {/* PREÇO DO PRODUTO E QUANTIDADE */}
      <div className="flex justify-between px-5">
        {/* PREÇO COM DESCONTO*/}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-xl">
              {formatCurrency(calculateProductTotalPrice(product))}
            </h2>
            {product.discountPercentage > 0 && (
              <DiscountBadge product={product} />
            )}
          </div>

          {/* PREÇO ORIGINAL */}
          {product.discountPercentage > 0 && (
            <p className="text-muted-foreground text-sm">
              De: {formatCurrency(Number(product.price))}
            </p>
          )}
        </div>

        {/* QUANTIDADE */}
        <div className="flex items-center gap-3 text-center">
          <Button
            variant="ghost"
            size="icon"
            className="border border-solid border-muted-foreground"
            onClick={handleDecreaseQuantityClick}
          >
            <ChevronLeftIcon />
          </Button>
          <span className="w-4">{quantity}</span>
          <Button size="icon" onClick={handleIncreaseQuantityClick}>
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      {/* DADOS DA ENTREGA */}
      <div className="px-5">
        <Card className="flex justify-around py-4 mt-6 px-5">
          {/* CUSTO */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-xs">Entrega</span>
              <BikeIcon size={14} />
            </div>

            {Number(product.restaurant.deliveryFee) > 0 ? (
              <p className="text-sm font-semibold">
                {formatCurrency(Number(product.restaurant.deliveryFee))}
              </p>
            ) : (
              <p className="text-sm font-semibold">Grátis</p>
            )}
          </div>
          {/* TEMPO */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-xs">Entrega</span>
              <TimerIcon size={14} />
            </div>

            {product.restaurant.deliveryTimeMinutes > 0 ? (
              <p className="text-sm font-semibold">
                {product.restaurant.deliveryTimeMinutes}min
              </p>
            ) : (
              <p className="text-sm font-semibold">Grátis</p>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-6 space-y-3 px-5">
        <h3 className="font-semibold">Sobre</h3>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </div>

      <div className="mt-6 space-y-3">
        <h3 className="font-semibold px-5">Sucos</h3>
        <ProductList products={complementaryProducts} />
      </div>
    </div>
  );
};

export default ProductDetails;
