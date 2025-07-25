import { Serial, Item, Lot, Package, SerialStatus } from '@/types/serial';

// Generate mock serials
export const mockSerials: Serial[] = Array.from({ length: 75 }, (_, i) => {
  const statuses: SerialStatus[] = ['unassigned', 'assigned', 'reserved', 'shipped'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const assignmentTypes = ['item', 'lot', 'package'] as const;
  
  return {
    id: `serial-${i + 1}`,
    serialNumber: `SN${String(i + 1).padStart(6, '0')}`,
    buyerPartNumber: Math.random() > 0.3 ? `BPN-${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}` : undefined,
    status,
    assignedTo: status !== 'unassigned' ? `target-${Math.floor(Math.random() * 10) + 1}` : undefined,
    assignedToType: status !== 'unassigned' ? assignmentTypes[Math.floor(Math.random() * 3)] : undefined,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  };
});

export const mockItems: Item[] = Array.from({ length: 12 }, (_, i) => ({
  id: `item-${i + 1}`,
  name: `Item ${i + 1}`,
  partNumber: `ITM-${String(i + 1).padStart(3, '0')}`,
  description: `High-quality component for manufacturing process ${i + 1}`,
}));

export const mockLots: Lot[] = Array.from({ length: 8 }, (_, i) => ({
  id: `lot-${i + 1}`,
  number: `LOT${String(i + 1).padStart(4, '0')}`,
  description: `Production lot batch ${i + 1}`,
  itemCount: Math.floor(Math.random() * 50) + 10,
}));

export const mockPackages: Package[] = Array.from({ length: 5 }, (_, i) => {
  const packageStatuses = ['pending', 'shipped', 'delivered'] as const;
  return {
    id: `package-${i + 1}`,
    trackingNumber: `PKG${String(i + 1).padStart(8, '0')}`,
    carrier: ['FedEx', 'UPS', 'DHL', 'USPS'][Math.floor(Math.random() * 4)],
    status: packageStatuses[Math.floor(Math.random() * 3)],
  };
});