import { InventoryScreen } from "@/features/inventory/components/inventory-screen";
import { inventoryService } from "@/features/inventory/services/inventory.service";

export default function InventoryPage() {
  const inventory = inventoryService.getInventory();

  return <InventoryScreen inventory={inventory} />;
}
