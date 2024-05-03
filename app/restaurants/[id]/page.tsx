import { db } from "@/app/_lib/prisma";
import { notFound } from "next/navigation";
import RestaurantImage from "./_components/restaurant-image";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import DeliveryInfo from "@/app/_components/delivery-info";
import ProductList from "@/app/_components/product-list";

interface RestaurantPageProps {
  params: {
    id: string;
  };
}

const RestaurantPage = async ({ params: { id } }: RestaurantPageProps) => {
  const restaurant = await db.restaurant.findUnique({
    where: {
      id,
    },
    include: {
      categories: {
        include: {
          products: {
            where: {
              restaurantId: id,
            },
            include: {
              restaurant: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      products: {
        take: 10,
        include: {
          restaurant: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!restaurant) {
    return notFound;
  }

  return (
    <div className="">
      <RestaurantImage restaurant={restaurant} />

      <div className="relative z-50 mt-[-1.5rem] rounded-tr-3xl bg-white rounded-tl-3xl flex justify-between items-center px-5 pt-5">
        {/* TITULO */}
        <div className="flex items-center gap-[0.375rem]">
          <div className="relative h-8 w-8">
            <Image
              src={restaurant.imageUrl}
              alt={restaurant.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <h1 className="text-xl font-semibold">{restaurant.name}</h1>
        </div>

        {/* AVALIAÇÃO */}
        <div
          className="gap-[2px] bg-foreground text-white px-2 py-[2px] rounded-full
                     flex items-center"
        >
          <StarIcon size={12} className="fill-yellow-500 text-yellow-500" />
          <span className="text-xs font-semibold">5.0</span>
        </div>
      </div>

      <div className="px-5">
        <DeliveryInfo restaurant={restaurant} />
      </div>

      <div className="flex overflow-x-scroll gap-4 [&::-webkit-scrollbar]:hidden px-5 mt-3">
        {restaurant.categories.map((category) => (
          <div
            className="bg-[#F4F4F4] min-w-[167px] rounded-lg text-center p-1 "
            key={category.id}
          >
            <span className="text-muted-foreground text-xs">
              {category.name}
            </span>
          </div>
        ))}
      </div>

      {/* MAIS PEDIDOS */}
      <div className="mt-6 space-y-4">
        {/* TODO: mostrar produtos mais pedidos quando implementarmos realização de pedidos */}
        <h2 className="font-semibold px-5">Mais pedidos</h2>
        <ProductList products={restaurant.products} />
      </div>

      {restaurant.categories.map((category) => (
        <div key={category.id} className="mt-6 space-y-4">
          {/* TODO: mostrar produtos mais pedidos quando implementarmos realização de pedidos */}
          <h2 className="font-semibold px-5">{category.name}</h2>
          <ProductList products={category.products} />
        </div>
      ))}
    </div>
  );
};

export default RestaurantPage;
