import { CollectionsMuseumScreen } from "@/features/collections/components/collections-museum-screen";
import { collectionsService } from "@/features/collections/services/collections.service";

export default function CollectionsPage() {
  const museum = collectionsService.getMuseum();

  return <CollectionsMuseumScreen museum={museum} />;
}
