import React, { useState } from 'react';
import { ASNItem, ASNLot, AssignmentContext } from '@/types/asn';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronDown, 
  ChevronRight, 
  Package, 
  FileBox, 
  AlertTriangle,
  Plus 
} from 'lucide-react';
import { useGlobalState } from '@/contexts/GlobalStateContext';
import { cn } from '@/lib/utils';

interface ASNItemNodeProps {
  item: ASNItem;
  onAssignSerials: (context: AssignmentContext) => void;
  className?: string;
}

export const ASNItemNode: React.FC<ASNItemNodeProps> = ({ 
  item, 
  onAssignSerials,
  className 
}) => {
  const [isExpanded, setIsExpanded] = useState(item.lots.length > 0);
  const { getAssignedSerials, getSerialsByBuyerPartNumber } = useGlobalState();
  
  const hasLots = item.lots.length > 0;
  
  // Calculate real-time stats from global state
  const allSerialsForBuyerPart = getSerialsByBuyerPartNumber(item.buyerPartNumber);
  const actualTotalSerials = allSerialsForBuyerPart.length;
  const assignedSerials = getAssignedSerials(item.id, 'item');
  const actualAssignedSerials = assignedSerials.length;
  const assignmentProgress = actualTotalSerials > 0 ? (actualAssignedSerials / actualTotalSerials) * 100 : 0;
  
  const assignedSerialsPreview = assignedSerials.slice(0, 3);
  
  const handleItemAssignment = () => {
    const context: AssignmentContext = {
      type: 'item',
      targetId: item.id,
      targetName: item.name,
      buyerPartNumber: item.buyerPartNumber,
      isTemporary: hasLots,
      warning: hasLots 
        ? 'This item has lots. Assignment at item level is temporary. Consider assigning at lot level instead.'
        : undefined,
    };
    onAssignSerials(context);
  };

  const handleLotAssignment = (lot: ASNLot) => {
    const context: AssignmentContext = {
      type: 'lot',
      targetId: lot.id,
      targetName: `${item.name} - ${lot.number}`,
      buyerPartNumber: lot.buyerPartNumber,
    };
    onAssignSerials(context);
  };

  return (
    <Card className={cn('border-l-4 border-l-primary', className)}>
      <CardContent className="p-4">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <div className="flex items-center justify-between mb-3">
            <CollapsibleTrigger className="flex items-center gap-2 hover:bg-muted/50 rounded-md p-1 -ml-1">
              {hasLots ? (
                isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )
              ) : (
                <FileBox className="w-4 h-4 text-muted-foreground" />
              )}
              <div className="text-left">
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="text-xs text-muted-foreground">{item.buyerPartNumber}</div>
              </div>
            </CollapsibleTrigger>
            
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end gap-1">
                <Badge variant="outline" className="text-xs">
                  {actualAssignedSerials}/{actualTotalSerials} assigned
                </Badge>
                {assignedSerials.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {assignedSerialsPreview.map(s => s.serialNumber).join(', ')}
                    {assignedSerials.length > 3 && ` +${assignedSerials.length - 3} more`}
                  </div>
                )}
              </div>
              <Button
                size="sm"
                variant={hasLots ? "outline" : "default"}
                onClick={handleItemAssignment}
                className="gap-1"
              >
                <Plus className="w-3 h-3" />
                Manage Serials
                {hasLots && <AlertTriangle className="w-3 h-3 text-amber-500" />}
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-3">
            <Progress value={assignmentProgress} className="h-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {assignmentProgress.toFixed(0)}% assigned
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div className="text-sm text-muted-foreground mb-3">
              {item.description}
            </div>
          )}

          {/* Lots */}
          {hasLots && (
            <CollapsibleContent className="space-y-2 ml-6 border-l-2 border-muted pl-4">
              {item.lots.map((lot) => {
                // Calculate real-time lot stats from global state
                const lotAssignedSerials = getAssignedSerials(lot.id, 'lot');
                const lotSerialsForBuyerPart = getSerialsByBuyerPartNumber(lot.buyerPartNumber);
                const actualLotTotalSerials = lotSerialsForBuyerPart.length;
                const actualLotAssignedSerials = lotAssignedSerials.length;
                const lotProgress = actualLotTotalSerials > 0 ? (actualLotAssignedSerials / actualLotTotalSerials) * 100 : 0;
                
                return (
                  <Card key={lot.id} className="border-dashed">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium text-sm">{lot.number}</div>
                            <div className="text-xs text-muted-foreground">
                              {actualLotTotalSerials} serials available
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {actualLotAssignedSerials}/{actualLotTotalSerials}
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() => handleLotAssignment(lot)}
                              className="gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              Manage Serials
                            </Button>
                          </div>
                          {(() => {
                            const lotSerialsPreview = lotAssignedSerials.slice(0, 3);
                            return lotAssignedSerials.length > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {lotSerialsPreview.map(s => s.serialNumber).join(', ')}
                                {lotAssignedSerials.length > 3 && ` +${lotAssignedSerials.length - 3} more`}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                      
                      <Progress value={lotProgress} className="h-1.5 mb-2" />
                      
                      {lot.description && (
                        <div className="text-xs text-muted-foreground">
                          {lot.description}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </CollapsibleContent>
          )}
        </Collapsible>
      </CardContent>
    </Card>
  );
};