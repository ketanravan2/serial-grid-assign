import React, { useState } from 'react';
import { SerialAssignmentInterface } from '@/components/SerialAssignmentInterface';
import { mockSerials } from '@/data/mockData';
import { Serial } from '@/types/serial';
import { useToast } from '@/hooks/use-toast';

const Serials: React.FC = () => {
  const { toast } = useToast();
  const [serials, setSerials] = useState<Serial[]>(mockSerials);

  const handleAssignSerials = (
    serialIds: string[], 
    targetId: string, 
    targetType: 'item' | 'lot' | 'package'
  ) => {
    // Update the serials with assignment information
    setSerials(prevSerials =>
      prevSerials.map(serial =>
        serialIds.includes(serial.id)
          ? {
              ...serial,
              status: 'assigned' as const,
              assignedTo: targetId,
              assignedToType: targetType,
              updatedAt: new Date(),
            }
          : serial
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <SerialAssignmentInterface
          serials={serials}
          onAssignSerials={handleAssignSerials}
        />
      </div>
    </div>
  );
};

export default Serials;