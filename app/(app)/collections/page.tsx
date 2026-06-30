import { redirect } from "next/navigation";

import { CollectionsMuseumScreen } from "@/features/collections/components/collections-museum-screen";
import { collectionsServerService } from "@/features/collections/services/collections-server.service";
import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { getAuthSession } from "@/lib/auth/require-session";

export default async function CollectionsPage() {
  const session = await getAuthSession();
  if (!session) redirect(AUTH_ROUTES.login);

  const museum = await collectionsServerService.getMuseum(session.userId);
  return <CollectionsMuseumScreen museum={museum} />;
}
