import React from 'react';
import { AddMedicineWithStockForm } from './AddMedicineWithStockForm';
import { BulkUploadSection } from './BulkUploadSection';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Plus, Upload, Package, Database } from 'lucide-react';

interface MedicineManagementSectionProps {
  onRefresh?: () => void;
}

export const MedicineManagementSection: React.FC<MedicineManagementSectionProps> = ({ onRefresh }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Medicine Management</h2>
        <p className="text-muted-foreground">
          Add medicines individually or upload multiple medicines with stock data
        </p>
      </div>

      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Individual Medicine
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Bulk Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Add Single Medicine with Stock
              </CardTitle>
              <CardDescription>
                Add one medicine at a time with complete inventory and stock information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Enter medicine details including name, manufacturer, and category</p>
                  <p>• Set initial stock quantity and pricing</p>
                  <p>• Auto-creates manufacturers and categories if they don't exist</p>
                  <p>• Creates purchase record for stock entry</p>
                </div>
                
                <div className="flex gap-2">
                  <AddMedicineWithStockForm 
                    onSuccess={onRefresh}
                    trigger={
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Medicine with Stock
                      </Button>
                    }
                  />
                  
                  <AddMedicineWithStockForm 
                    onSuccess={onRefresh}
                    trigger={
                      <Button variant="outline">
                        <Database className="w-4 h-4 mr-2" />
                        Quick Add
                      </Button>
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <BulkUploadSection onRefresh={onRefresh} />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for managing your medicine inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AddMedicineWithStockForm 
              onSuccess={onRefresh}
              trigger={
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Plus className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">Add Medicine</div>
                    <div className="text-xs text-muted-foreground">Single medicine with stock</div>
                  </div>
                </Button>
              }
            />
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Upload className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Bulk Upload</div>
                <div className="text-xs text-muted-foreground">Multiple medicines with stock</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Database className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Stock Update</div>
                <div className="text-xs text-muted-foreground">Update existing stock</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
