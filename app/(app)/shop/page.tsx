import { ShopScreen } from "@/features/shop/components/shop-screen";
import { shopService } from "@/features/shop/services/shop.service";

/** Doc 12 Screen 15 — merchant encounter entry from camp hotspot. */
export default function ShopPage() {
  const catalog = shopService.getCatalog();
  return <ShopScreen catalog={catalog} />;
}
