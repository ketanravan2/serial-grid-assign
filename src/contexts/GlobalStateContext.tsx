import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Serial, PartNumber, ChildComponent } from '@/types/serial';
import { ASNHierarchy } from '@/types/asn';
import { mockASNHierarchy } from '@/data/asnMockData';
import { useToast } from '@/hooks/use-toast';

interface GlobalStateData {
  serials_inventory: Record<string, Serial[]>;
  part_relationship: Record<string, string[]>;
  asn: {
    lineAndLotAssignmentDetails: Array<{
      line_id: string;
      assigned_serials: string[];
      lot_details: Array<{
        lot_id: string;
        assigned_serials: string[];
      }>;
    }>;
    packageAssignmentDetail: Array<{
      container_id: string;
      assigned_serials: string[];
    }>;
  };
}

interface GlobalStateContextType {
  // Data
  stateData: GlobalStateData;
  asnHierarchy: ASNHierarchy;
  partNumbers: PartNumber[];
  
  // Computed getters
  getAllSerials: () => Serial[];
  getPartNumbers: () => PartNumber[];
  getSerialsByBuyerPartNumber: (buyerPartNumber: string) => Serial[];
  getAssignedSerials: (targetId: string, targetType: 'item' | 'lot' | 'package') => Serial[];
  
  // Actions
  createSerial: (data: {
    serialNumber: string;
    buyerPartNumber: string;
    customAttributes: Record<string, string>;
  }) => void;
  bulkCreateSerials: (data: {
    prefix: string;
    startNumber: number;
    count: number;
    buyerPartNumber: string;
  }) => void;
  importSerialsFromCSV: (data: {
    serials: Array<{
      serialNumber: string;
      customAttributes: Record<string, string>;
    }>;
    buyerPartNumber: string;
  }) => void;
  assignSerials: (
    serialIds: string[], 
    targetId: string, 
    targetType: 'item' | 'lot' | 'package',
    isTemporary?: boolean,
    targetName?: string
  ) => void;
  linkChildSerials: (parentSerialId: string, childSerialIds: string[]) => void;
  setChildComponents: (serialId: string, childComponents: ChildComponent[]) => void;
  createPartNumber: (data: {
    buyerPartNumber: string;
    name: string;
    description: string;
  }) => void;
  checkOverassignment: (targetId: string, targetType: 'item' | 'lot' | 'package', additionalCount: number) => boolean;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [asnHierarchy] = useState<ASNHierarchy>(mockASNHierarchy);
  
  // Initialize global state with the new JSON structure
  const [stateData, setStateData] = useState<GlobalStateData>(() => {
    const initialState: GlobalStateData = {
      serials_inventory: {},
      part_relationship: {},
      asn: {
        lineAndLotAssignmentDetails: [],
        packageAssignmentDetail: [],
      },
    };
    return initialState;
  });
  
  // Initialize part numbers from ASN hierarchy
  const [partNumbers, setPartNumbers] = useState<PartNumber[]>(() => {
    const initialPartNumbers: PartNumber[] = [];
    
    asnHierarchy.items.forEach(item => {
      if (item.buyerPartNumber && !initialPartNumbers.some(p => p.buyerPartNumber === item.buyerPartNumber)) {
        initialPartNumbers.push({
          id: `part-${item.id}`,
          buyerPartNumber: item.buyerPartNumber,
          name: item.name,
          description: item.description,
        });
      }
      
      item.lots.forEach(lot => {
        if (lot.buyerPartNumber && !initialPartNumbers.some(p => p.buyerPartNumber === lot.buyerPartNumber)) {
          initialPartNumbers.push({
            id: `part-lot-${lot.id}`,
            buyerPartNumber: lot.buyerPartNumber,
            name: `${item.name} - ${lot.number}`,
            description: lot.description,
          });
        }
      });
    });
    
    return initialPartNumbers;
  });

  // Computed getters
  const getAllSerials = useCallback((): Serial[] => {
    const allSerials: Serial[] = [];
    Object.values(stateData.serials_inventory).forEach(serialArray => {
      allSerials.push(...serialArray);
    });
    return allSerials;
  }, [stateData.serials_inventory]);

  const getPartNumbers = useCallback((): PartNumber[] => {
    return partNumbers;
  }, [partNumbers]);

  const getSerialsByBuyerPartNumber = useCallback((buyerPartNumber: string): Serial[] => {
    return stateData.serials_inventory[buyerPartNumber] || [];
  }, [stateData.serials_inventory]);

  const getAssignedSerials = useCallback((targetId: string, targetType: 'item' | 'lot' | 'package'): Serial[] => {
    const allSerials = getAllSerials();
    return allSerials.filter(serial => 
      serial.assignedTo === targetId && serial.assignedToType === targetType
    );
  }, [getAllSerials]);

  const checkOverassignment = useCallback((targetId: string, targetType: 'item' | 'lot' | 'package', additionalCount: number): boolean => {
    const currentAssigned = getAssignedSerials(targetId, targetType);
    const newTotal = currentAssigned.length + additionalCount;
    
    // Get capacity from ASN hierarchy - for now, use a default capacity
    let capacity = 100; // Default capacity
    if (targetType === 'item') {
      const item = asnHierarchy.items.find(i => i.id === targetId);
      capacity = 100; // Use default for now
    } else if (targetType === 'lot') {
      asnHierarchy.items.forEach(item => {
        const lot = item.lots.find(l => l.id === targetId);
        if (lot) capacity = 100; // Use default for now
      });
    } else if (targetType === 'package') {
      capacity = 50; // Use smaller default for packages
    }
    
    return newTotal > capacity;
  }, [getAssignedSerials, asnHierarchy]);

  // Actions
  const createSerial = useCallback((data: {
    serialNumber: string;
    buyerPartNumber: string;
    customAttributes: Record<string, string>;
  }) => {
    const newSerial: Serial = {
      id: `serial-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      serialNumber: data.serialNumber,
      buyerPartNumber: data.buyerPartNumber,
      status: 'unassigned',
      customAttributes: data.customAttributes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setStateData(prev => ({
      ...prev,
      serials_inventory: {
        ...prev.serials_inventory,
        [data.buyerPartNumber]: [
          ...(prev.serials_inventory[data.buyerPartNumber] || []),
          newSerial
        ]
      }
    }));
  }, []);

  const bulkCreateSerials = useCallback((data: {
    prefix: string;
    startNumber: number;
    count: number;
    buyerPartNumber: string;
  }) => {
    const newSerials: Serial[] = Array.from({ length: data.count }, (_, i) => ({
      id: `serial-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
      serialNumber: `${data.prefix}${String(data.startNumber + i).padStart(6, '0')}`,
      buyerPartNumber: data.buyerPartNumber,
      status: 'unassigned' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    
    setStateData(prev => ({
      ...prev,
      serials_inventory: {
        ...prev.serials_inventory,
        [data.buyerPartNumber]: [
          ...(prev.serials_inventory[data.buyerPartNumber] || []),
          ...newSerials
        ]
      }
    }));
  }, []);

  const importSerialsFromCSV = useCallback((data: {
    serials: Array<{
      serialNumber: string;
      customAttributes: Record<string, string>;
    }>;
    buyerPartNumber: string;
  }) => {
    const newSerials: Serial[] = data.serials.map((serialData, i) => ({
      id: `serial-csv-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
      serialNumber: serialData.serialNumber,
      buyerPartNumber: data.buyerPartNumber,
      status: 'unassigned' as const,
      customAttributes: serialData.customAttributes,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    
    setStateData(prev => ({
      ...prev,
      serials_inventory: {
        ...prev.serials_inventory,
        [data.buyerPartNumber]: [
          ...(prev.serials_inventory[data.buyerPartNumber] || []),
          ...newSerials
        ]
      }
    }));
  }, []);

  const assignSerials = useCallback((
    serialIds: string[], 
    targetId: string, 
    targetType: 'item' | 'lot' | 'package',
    isTemporary?: boolean,
    targetName?: string
  ) => {
    // Check for overassignment if assigning
    if (targetId !== '' && checkOverassignment(targetId, targetType, serialIds.length)) {
      toast({
        title: "Warning: Overassignment",
        description: `Assigning ${serialIds.length} serials would exceed the capacity for this ${targetType}.`,
        variant: "destructive",
      });
      return;
    }

    setStateData(prev => {
      const newState = { ...prev };
      
      // Update serial objects
      Object.keys(newState.serials_inventory).forEach(buyerPartNumber => {
        newState.serials_inventory[buyerPartNumber] = newState.serials_inventory[buyerPartNumber].map(serial => {
          if (!serialIds.includes(serial.id)) return serial;
          
          if (targetId === '') {
            // Unassign serial
            return {
              ...serial,
              status: 'unassigned' as const,
              assignedTo: undefined,
              assignedToType: undefined,
              assignmentDetails: undefined,
              updatedAt: new Date(),
            };
          } else {
            // Assign serial
            return {
              ...serial,
              status: isTemporary ? 'reserved' as const : 'assigned' as const,
              assignedTo: targetId,
              assignedToType: targetType,
              assignmentDetails: {
                targetId,
                targetType,
                targetName: targetName || targetId,
                assignedAt: new Date(),
                isTemporary,
              },
              updatedAt: new Date(),
            };
          }
        });
      });

      // Update ASN assignment tracking
      if (targetType === 'item' || targetType === 'lot') {
        const lineId = targetType === 'item' ? targetId : 
          asnHierarchy.items.find(item => 
            item.lots.some(lot => lot.id === targetId)
          )?.id || '';

        let lineDetail = newState.asn.lineAndLotAssignmentDetails.find(l => l.line_id === lineId);
        if (!lineDetail) {
          lineDetail = { line_id: lineId, assigned_serials: [], lot_details: [] };
          newState.asn.lineAndLotAssignmentDetails.push(lineDetail);
        }

        if (targetType === 'item') {
          if (targetId === '') {
            lineDetail.assigned_serials = lineDetail.assigned_serials.filter(id => !serialIds.includes(id));
          } else {
            lineDetail.assigned_serials.push(...serialIds);
          }
        } else if (targetType === 'lot') {
          let lotDetail = lineDetail.lot_details.find(l => l.lot_id === targetId);
          if (!lotDetail) {
            lotDetail = { lot_id: targetId, assigned_serials: [] };
            lineDetail.lot_details.push(lotDetail);
          }

          if (targetId === '') {
            lotDetail.assigned_serials = lotDetail.assigned_serials.filter(id => !serialIds.includes(id));
          } else {
            lotDetail.assigned_serials.push(...serialIds);
          }
        }
      } else if (targetType === 'package') {
        let packageDetail = newState.asn.packageAssignmentDetail.find(p => p.container_id === targetId);
        if (!packageDetail) {
          packageDetail = { container_id: targetId, assigned_serials: [] };
          newState.asn.packageAssignmentDetail.push(packageDetail);
        }

        if (targetId === '') {
          packageDetail.assigned_serials = packageDetail.assigned_serials.filter(id => !serialIds.includes(id));
        } else {
          packageDetail.assigned_serials.push(...serialIds);
        }
      }

      return newState;
    });
  }, [checkOverassignment, toast, asnHierarchy]);

  const linkChildSerials = useCallback((parentSerialId: string, childSerialIds: string[]) => {
    setStateData(prev => {
      const newState = { ...prev };
      
      Object.keys(newState.serials_inventory).forEach(buyerPartNumber => {
        newState.serials_inventory[buyerPartNumber] = newState.serials_inventory[buyerPartNumber].map(serial => {
          if (serial.id === parentSerialId) {
            const existingChildSerials = serial.childSerials || [];
            const newChildSerials = [...new Set([...existingChildSerials, ...childSerialIds])];
            return {
              ...serial,
              childSerials: newChildSerials,
              updatedAt: new Date(),
            };
          } else if (childSerialIds.includes(serial.id)) {
            return {
              ...serial,
              parentSerial: parentSerialId,
              updatedAt: new Date(),
            };
          }
          return serial;
        });
      });

      return newState;
    });
  }, []);

  const setChildComponents = useCallback((serialId: string, childComponents: ChildComponent[]) => {
    setStateData(prev => {
      const newState = { ...prev };
      
      Object.keys(newState.serials_inventory).forEach(buyerPartNumber => {
        newState.serials_inventory[buyerPartNumber] = newState.serials_inventory[buyerPartNumber].map(serial => {
          if (serial.id === serialId) {
            return {
              ...serial,
              childComponents,
              updatedAt: new Date(),
            };
          }
          return serial;
        });
      });

      return newState;
    });
  }, []);

  const createPartNumber = useCallback((data: {
    buyerPartNumber: string;
    name: string;
    description: string;
  }) => {
    const newPartNumber: PartNumber = {
      id: `part-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      buyerPartNumber: data.buyerPartNumber,
      name: data.name,
      description: data.description,
    };
    
    setPartNumbers(prevPartNumbers => [...prevPartNumbers, newPartNumber]);
  }, []);

  return (
    <GlobalStateContext.Provider value={{
      stateData,
      asnHierarchy,
      partNumbers,
      getAllSerials,
      getPartNumbers,
      getSerialsByBuyerPartNumber,
      getAssignedSerials,
      createSerial,
      bulkCreateSerials,
      importSerialsFromCSV,
      assignSerials,
      linkChildSerials,
      setChildComponents,
      createPartNumber,
      checkOverassignment,
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};