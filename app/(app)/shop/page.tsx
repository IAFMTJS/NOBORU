import { redirect } from "next/navigation";

import { ShopScreen } from "@/features/shop/components/shop-screen";
import { shopServerService } from "@/features/shop/services/shop-server.service";
import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { getAuthSession } from "@/lib/auth/require-session";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const session = await getAuthSession();
  if (!session) redirect(AUTH_ROUTES.login);

  const catalog = await shopServerService.getCatalog(session.userId);
  return <ShopScreen catalog={catalog} />;
}
