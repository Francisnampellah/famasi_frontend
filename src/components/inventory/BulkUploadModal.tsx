import React, { useState } from 'react';
import { useBulkUpload, BulkUploadType } from '../../hooks/useBulkUpload';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, XCircle, Download, Upload, AlertTriangle } from 'lucide-react';

interface BulkUploadModalProps {
  type: BulkUploadType;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const uploadTypeLabels = {
  'medicine-with-stock': 'Medicine with Stock',
  'medicine': 'Medicine Only',
  'stock': 'Stock Update'
};

const uploadTypeDescriptions = {
  'medicine-with-stock': 'Upload medicines with inventory and stock data. Creates manufacturers and categories automatically.',
  'medicine': 'Upload medicines only. Creates manufacturers and categories automatically.',
  'stock': 'Update stock quantities for existing medicines.'
};

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ 
  type, 
  trigger,
  onSuccess 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { 
    uploadFile, 
    downloadTemplateFile, 
    isUploading, 
    uploadResult, 
    error, 
    reset,
    formatResults 
  } = useBulkUpload({
    onSuccess: () => {
      onSuccess?.();
      setIsOpen(false);
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await uploadFile(selectedFile, type);
    }
  };

  const handleDownloadTemplate = () => {
    downloadTemplateFile(type);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedFile(null);
    reset();
  };

  const formattedResults = uploadResult ? formatResults(uploadResult) : null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload {uploadTypeLabels[type]}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Upload {uploadTypeLabels[type]}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {uploadTypeDescriptions[type]}
          </p>

          {/* Template Download */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Download Template</h4>
              <p className="text-sm text-muted-foreground">
                Download the Excel template to format your data correctly
              </p>
            </div>
            <Button variant="outline" onClick={handleDownloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select File</label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="w-full p-2 border rounded-lg"
              disabled={isUploading}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>Please wait</span>
              </div>
              <Progress value={undefined} className="w-full" />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Results */}
          {formattedResults && (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  {formattedResults.summary.successCount} items processed successfully
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Processed:</span>
                      <Badge variant="outline">
                        {formattedResults.summary.totalProcessed}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Successful:</span>
                      <Badge variant="default" className="bg-green-500">
                        {formattedResults.summary.successCount}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Errors:</span>
                      <Badge variant="destructive">
                        {formattedResults.summary.errorCount}
                      </Badge>
                    </div>
                    {formattedResults.summary.createdManufacturersCount > 0 && (
                      <div className="flex justify-between">
                        <span>New Manufacturers:</span>
                        <Badge variant="secondary">
                          {formattedResults.summary.createdManufacturersCount}
                        </Badge>
                      </div>
                    )}
                    {formattedResults.summary.createdCategoriesCount > 0 && (
                      <div className="flex justify-between">
                        <span>New Categories:</span>
                        <Badge variant="secondary">
                          {formattedResults.summary.createdCategoriesCount}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Errors List */}
                {formattedResults.details.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-600">Errors</h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {formattedResults.details.errors.map((error, index) => (
                        <div key={index} className="text-xs text-red-600 p-2 bg-red-50 rounded">
                          <strong>Row {error.row}:</strong> {error.medicine} - {error.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              {uploadResult ? 'Close' : 'Cancel'}
            </Button>
            {selectedFile && !uploadResult && (
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload File'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
