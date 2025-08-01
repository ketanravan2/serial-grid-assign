import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Package, FileBox, Users, TreePine, Grid3X3, Plus } from "lucide-react";
import { useState } from "react";
import { CreatePartNumberDialog } from "@/components/CreatePartNumberDialog";
import { useAppState } from "@/contexts/AppStateContext";

const Index = () => {
  const { createPartNumber } = useAppState();
  const [createPartDialog, setCreatePartDialog] = useState(false);

  const handleCreatePartNumber = (data: {
    partNumber: string;
    buyerPartNumber: string;
    name: string;
    description: string;
  }) => {
    createPartNumber(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Serial Assignment System</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete serial management solution with hierarchical ASN structure, high-density assignment interface, and advanced tracking capabilities.
          </p>
        </div>


        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/asn">
            <Button size="lg" className="gap-2">
              <TreePine className="w-5 h-5" />
              ASN Hierarchy View
            </Button>
          </Link>
          <Link to="/serials">
            <Button size="lg" variant="outline" className="gap-2">
              <Grid3X3 className="w-5 h-5" />
              Serial Grid View
            </Button>
          </Link>
        </div>

        <div className="flex justify-center mt-6">
          <Button 
            size="lg" 
            variant="secondary" 
            className="gap-2"
            onClick={() => setCreatePartDialog(true)}
          >
            <Plus className="w-5 h-5" />
            Create Part Number
          </Button>
        </div>
      </div>

      {/* Create part number dialog */}
      <CreatePartNumberDialog
        open={createPartDialog}
        onOpenChange={setCreatePartDialog}
        onCreatePartNumber={handleCreatePartNumber}
      />
    </div>
  );
};

export default Index;
