import { ShopScreen } from "@/features/shop/components/shop-screen";
import { shopService } from "@/features/shop/services/shop.service";

export default function ShopPage() {
  const catalog = shopService.getCatalog();
  return <ShopScreen catalog={catalog} />;
}
