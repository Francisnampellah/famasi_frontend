import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, FileUp, Package, Database, AlertCircle } from 'lucide-react';
import { BulkUploadModal, AddMedicineWithStockForm } from "@/components/inventory";

interface InventoryActionsProps {
  onRefresh?: () => void;
  onAddMedicineOnly?: () => void;
}

export const InventoryActions: React.FC<InventoryActionsProps> = ({ 
  onRefresh, 
  onAddMedicineOnly 
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Medicine Management Actions
          </CardTitle>
          <CardDescription>
            Choose how you want to add medicines to your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Add Medicine with Stock */}
            <AddMedicineWithStockForm 
              onSuccess={onRefresh}
              trigger={
                <Button className="h-auto p-4 flex flex-col items-center gap-2 w-full">
                  <Plus className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">Add Medicine with Stock</div>
                    <div className="text-xs opacity-80">Single medicine with inventory</div>
                    <Badge variant="secondary" className="mt-1">Recommended</Badge>
                  </div>
                </Button>
              }
            />
            
            {/* Bulk Upload */}
            <BulkUploadModal 
              type="medicine-with-stock" 
              onSuccess={onRefresh}
              trigger={
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 w-full">
                  <Upload className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">Bulk Upload</div>
                    <div className="text-xs opacity-80">Multiple medicines with stock</div>
                    <Badge variant="outline" className="mt-1">Excel File</Badge>
                  </div>
                </Button>
              }
            />
            
            {/* Add Medicine Only */}
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2 w-full"
              onClick={onAddMedicineOnly}
            >
              <FileUp className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Add Medicine Only</div>
                <div className="text-xs opacity-80">Without stock data</div>
                <Badge variant="outline" className="mt-1">Legacy</Badge>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-sm font-medium">Individual Add</div>
                <div className="text-xs text-muted-foreground">Add one medicine at a time</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-sm font-medium">Bulk Upload</div>
                <div className="text-xs text-muted-foreground">Upload multiple medicines</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <div>
                <div className="text-sm font-medium">Auto-Creation</div>
                <div className="text-xs text-muted-foreground">Creates manufacturers & categories</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
