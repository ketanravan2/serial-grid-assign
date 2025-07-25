import { ASNItem, ASNLot, PackingUnit, ASNHierarchy } from '@/types/asn';

// Generate mock ASN items with lots
export const mockASNItems: ASNItem[] = [
  {
    id: 'item-001',
    name: 'High-Performance CPU',
    partNumber: 'CPU-X1000',
    description: 'Advanced 8-core processor for enterprise systems',
    totalSerials: 20,
    assignedSerials: 12,
    lots: [
      {
        id: 'lot-001-A',
        number: 'LOT-CPU-001A',
        itemId: 'item-001',
        description: 'First production batch - Q1 2024',
        totalSerials: 12,
        assignedSerials: 8,
        serialCount: 12,
      },
      {
        id: 'lot-001-B',
        number: 'LOT-CPU-001B',
        itemId: 'item-001',
        description: 'Second production batch - Q2 2024',
        totalSerials: 8,
        assignedSerials: 4,
        serialCount: 8,
      },
    ],
  },
  {
    id: 'item-002',
    name: 'Memory Module DDR5',
    partNumber: 'MEM-DDR5-32GB',
    description: '32GB DDR5 ECC memory module',
    totalSerials: 15,
    assignedSerials: 6,
    lots: [
      {
        id: 'lot-002-A',
        number: 'LOT-MEM-002A',
        itemId: 'item-002',
        description: 'Premium grade memory modules',
        totalSerials: 15,
        assignedSerials: 6,
        serialCount: 15,
      },
    ],
  },
  {
    id: 'item-003',
    name: 'Graphics Card RTX',
    partNumber: 'GPU-RTX-4090',
    description: 'Professional graphics card for AI workloads',
    totalSerials: 8,
    assignedSerials: 3,
    lots: [],
  },
  {
    id: 'item-004',
    name: 'Network Interface Card',
    partNumber: 'NIC-10GB-ETH',
    description: '10Gb Ethernet network interface card',
    totalSerials: 25,
    assignedSerials: 15,
    lots: [
      {
        id: 'lot-004-A',
        number: 'LOT-NIC-004A',
        itemId: 'item-004',
        description: 'Standard production batch',
        totalSerials: 15,
        assignedSerials: 10,
        serialCount: 15,
      },
      {
        id: 'lot-004-B',
        number: 'LOT-NIC-004B',
        itemId: 'item-004',
        description: 'Enhanced variant with extended features',
        totalSerials: 10,
        assignedSerials: 5,
        serialCount: 10,
      },
    ],
  },
];

// Generate mock packing structure
export const mockPackingStructure: PackingUnit[] = [
  {
    id: 'container-001',
    type: 'container',
    identifier: 'CONT-001-2024',
    level: 0,
    totalSerials: 50,
    assignedSerials: 25,
    children: [
      {
        id: 'pallet-001',
        type: 'pallet',
        identifier: 'PAL-001-A',
        parentId: 'container-001',
        level: 1,
        totalSerials: 30,
        assignedSerials: 18,
        children: [
          {
            id: 'carton-001',
            type: 'carton',
            identifier: 'CTN-001-A1',
            parentId: 'pallet-001',
            level: 2,
            totalSerials: 15,
            assignedSerials: 10,
            children: [],
          },
          {
            id: 'carton-002',
            type: 'carton',
            identifier: 'CTN-001-A2',
            parentId: 'pallet-001',
            level: 2,
            totalSerials: 15,
            assignedSerials: 8,
            children: [],
          },
        ],
      },
      {
        id: 'pallet-002',
        type: 'pallet',
        identifier: 'PAL-001-B',
        parentId: 'container-001',
        level: 1,
        totalSerials: 20,
        assignedSerials: 7,
        children: [
          {
            id: 'carton-003',
            type: 'carton',
            identifier: 'CTN-001-B1',
            parentId: 'pallet-002',
            level: 2,
            totalSerials: 20,
            assignedSerials: 7,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 'container-002',
    type: 'container',
    identifier: 'CONT-002-2024',
    level: 0,
    totalSerials: 30,
    assignedSerials: 12,
    children: [
      {
        id: 'pallet-003',
        type: 'pallet',
        identifier: 'PAL-002-A',
        parentId: 'container-002',
        level: 1,
        totalSerials: 30,
        assignedSerials: 12,
        children: [
          {
            id: 'carton-004',
            type: 'carton',
            identifier: 'CTN-002-A1',
            parentId: 'pallet-003',
            level: 2,
            totalSerials: 30,
            assignedSerials: 12,
            children: [],
          },
        ],
      },
    ],
  },
];

export const mockASNHierarchy: ASNHierarchy = {
  items: mockASNItems,
  packingStructure: mockPackingStructure,
};