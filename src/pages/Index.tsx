import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Package, FileBox, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Serial Assignment System</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A high-density interface for managing serial assignments with modern selection interactions and drag-and-drop functionality.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileBox className="w-5 h-5" />
                Items
              </CardTitle>
              <CardDescription>
                Manage individual items and their serial assignments
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Lots
              </CardTitle>
              <CardDescription>
                Organize serials into production lots and batches
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Packages
              </CardTitle>
              <CardDescription>
                Track shipping packages and their contents
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <Link to="/serials">
            <Button size="lg" className="gap-2">
              <Package className="w-5 h-5" />
              View Serial Assignment Interface
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
