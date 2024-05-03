import CategoryList from "./_components/category-list";
import Header from "./_components/header";
import Search from "./_components/search";
import ProductList from "./_components/product-list";
import { Button } from "./_components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { db } from "./_lib/prisma";
import PromoBanner from "./_components/promo-banner";
import RestaurantList from "./_components/restaurant-list";
import Link from "next/link";

const Home = async () => {
  const products = await db.product.findMany({
    where: {
      discountPercentage: {
        gt: 0,
      },
    },
    take: 10,
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
    },
    distinct: "name",
  });

  return (
    <>
      <Header />
      <div className="px-5 pt-6">
        <Search />
      </div>

      <div className="px-5 pt-6">
        <CategoryList />
      </div>

      <div className="px-5 pt-6">
        <PromoBanner
          src="/banner_promo01.png"
          alt="Até 30% de desconto em burguers"
        />
      </div>

      <div className="pt-6 space-y-4">
        <div className="flex justify-between items-center px-5">
          <h2 className="font-semibold">Pedidos Recomendados</h2>
          <Link href="/products/recommended">
            <Button
              variant="ghost"
              className="h-fit text-primary p-0 hover:bg-transparent"
            >
              Ver todos <ChevronRightIcon size={16} />
            </Button>
          </Link>
        </div>
        <ProductList products={products} />
      </div>

      <div className="px-5 pt-6">
        <PromoBanner
          src="/banner_promo02.png"
          alt="Saladas a partir de R$17,99"
        />
      </div>

      <div className="py-6 space-y-4">
        <div className="flex justify-between items-center px-5">
          <h2 className="font-semibold">Restaurantes Recomendados</h2>
          <Link href="/restaurants/recommended">
            <Button
              variant="ghost"
              className="h-fit text-primary p-0 hover:bg-transparent"
            >
              Ver todos <ChevronRightIcon size={16} />
            </Button>
          </Link>
        </div>
        <RestaurantList />
      </div>
    </>
  );
};

export default Home;
