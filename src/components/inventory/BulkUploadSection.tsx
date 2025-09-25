import React from 'react';
import { BulkUploadModal } from './BulkUploadModal';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Upload, Package, Database, AlertCircle } from 'lucide-react';

interface BulkUploadSectionProps {
  onRefresh?: () => void;
}

export const BulkUploadSection: React.FC<BulkUploadSectionProps> = ({ onRefresh }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Bulk Upload</h2>
        <p className="text-muted-foreground">
          Upload multiple medicines and stock data at once using Excel files
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Medicine with Stock Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Medicine with Stock
            </CardTitle>
            <CardDescription>
              Upload medicines with inventory and stock data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p>• Creates medicines and stock entries</p>
                <p>• Auto-creates manufacturers and categories</p>
                <p>• Sets all units to "tablet"</p>
                <p>• Creates purchase records</p>
              </div>
              <BulkUploadModal 
                type="medicine-with-stock" 
                onSuccess={onRefresh}
                trigger={
                  <Button className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Medicine with Stock
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Medicine Only Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Medicine Only
            </CardTitle>
            <CardDescription>
              Upload medicines without stock data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p>• Creates medicines only</p>
                <p>• Auto-creates manufacturers and categories</p>
                <p>• No stock or purchase records</p>
              </div>
              <BulkUploadModal 
                type="medicine" 
                onSuccess={onRefresh}
                trigger={
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Medicines
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Stock Update Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Stock Update
            </CardTitle>
            <CardDescription>
              Update stock quantities for existing medicines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p>• Updates existing medicines only</p>
                <p>• Adjusts stock quantities</p>
                <p>• Creates purchase records</p>
              </div>
              <BulkUploadModal 
                type="stock" 
                onSuccess={onRefresh}
                trigger={
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Update Stock
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>1. Download Template:</strong> Click the "Download Template" button to get the Excel template</p>
            <p><strong>2. Fill Data:</strong> Enter your medicine data in the template following the format</p>
            <p><strong>3. Upload File:</strong> Select your filled Excel file and click upload</p>
            <p><strong>4. Review Results:</strong> Check the upload results for any errors or success messages</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
