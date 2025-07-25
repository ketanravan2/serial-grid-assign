import React, { useState } from 'react';
import { ASNHierarchyView } from '@/components/ASNHierarchyView';
import { SerialAssignmentInterface } from '@/components/SerialAssignmentInterface';
import { mockASNHierarchy } from '@/data/asnMockData';
import { mockSerials } from '@/data/mockData';
import { Serial } from '@/types/serial';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TreePine, Grid3X3, BarChart3 } from 'lucide-react';

const ASN: React.FC = () => {
  const { toast } = useToast();
  const [serials, setSerials] = useState<Serial[]>(mockSerials);

  const handleAssignSerials = (
    serialIds: string[], 
    targetId: string, 
    targetType: 'item' | 'lot' | 'package',
    isTemporary?: boolean
  ) => {
    // Update the serials with assignment information
    setSerials(prevSerials =>
      prevSerials.map(serial =>
        serialIds.includes(serial.id)
          ? {
              ...serial,
              status: isTemporary ? 'reserved' as const : 'assigned' as const,
              assignedTo: targetId,
              assignedToType: targetType,
              updatedAt: new Date(),
            }
          : serial
      )
    );

    // Show success message
    const assignmentType = isTemporary ? 'temporary assignment' : 'assignment';
    toast({
      title: "Assignment successful",
      description: `${serialIds.length} serial${serialIds.length !== 1 ? 's' : ''} ${assignmentType} completed.`,
    });
  };

  const assignedCount = serials.filter(s => s.status !== 'unassigned').length;
  const assignmentRate = serials.length > 0 ? (assignedCount / serials.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Advanced Shipping Notice (ASN) Management
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{serials.length} total serials</span>
              <span>•</span>
              <span>{assignedCount} assigned ({assignmentRate.toFixed(1)}%)</span>
              <span>•</span>
              <span>{mockASNHierarchy.items.length} items with {mockASNHierarchy.items.reduce((sum, item) => sum + item.lots.length, 0)} lots</span>
            </div>
          </CardHeader>
        </Card>

        {/* Main Interface */}
        <Tabs defaultValue="hierarchy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hierarchy" className="gap-2">
              <TreePine className="w-4 h-4" />
              ASN Hierarchy
            </TabsTrigger>
            <TabsTrigger value="serials" className="gap-2">
              <Grid3X3 className="w-4 h-4" />
              Serial Grid View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hierarchy" className="mt-6">
            <ASNHierarchyView
              hierarchy={mockASNHierarchy}
              serials={serials}
              onAssignSerials={handleAssignSerials}
            />
          </TabsContent>
          
          <TabsContent value="serials" className="mt-6">
            <SerialAssignmentInterface
              serials={serials}
              onAssignSerials={handleAssignSerials}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ASN;