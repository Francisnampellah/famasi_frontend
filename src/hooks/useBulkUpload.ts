import { useState } from 'react';
import { 
  bulkUploadMedicinesWithStock, 
  bulkUploadMedicines, 
  bulkUpdateStock,
  getBulkMedicineWithStockTemplate,
  getMedicineTemplate,
  getStockUpdateTemplate,
  downloadTemplate,
  formatBulkUploadResults,
  type BulkUploadResult,
  type BulkUploadError
} from '../services/inventory/bulkService';

export type BulkUploadType = 'medicine-with-stock' | 'medicine' | 'stock';

interface UseBulkUploadOptions {
  onSuccess?: (result: BulkUploadResult) => void;
  onError?: (error: any) => void;
}

export const useBulkUpload = (options?: UseBulkUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, type: BulkUploadType) => {
    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      let result: BulkUploadResult | void;

      switch (type) {
        case 'medicine-with-stock':
          result = await bulkUploadMedicinesWithStock(file);
          break;
        case 'medicine':
          await bulkUploadMedicines(file);
          result = {
            message: 'Bulk upload completed',
            successCount: 0,
            errorCount: 0,
            createdManufacturersCount: 0,
            createdCategoriesCount: 0,
            results: {
              medicines: [],
              stocks: [],
              errors: [],
              createdManufacturers: [],
              createdCategories: []
            }
          };
          break;
        case 'stock':
          const formData = new FormData();
          formData.append('file', file);
          await bulkUpdateStock(formData);
          result = {
            message: 'Bulk stock update completed',
            successCount: 0,
            errorCount: 0,
            createdManufacturersCount: 0,
            createdCategoriesCount: 0,
            results: {
              medicines: [],
              stocks: [],
              errors: [],
              createdManufacturers: [],
              createdCategories: []
            }
          };
          break;
        default:
          throw new Error('Invalid upload type');
      }

      if (result) {
        setUploadResult(result);
        options?.onSuccess?.(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      options?.onError?.(err);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplateFile = async (type: BulkUploadType) => {
    try {
      let blob: Blob;
      let filename: string;

      switch (type) {
        case 'medicine-with-stock':
          blob = await getBulkMedicineWithStockTemplate();
          filename = 'bulk_medicine_with_stock_template.xlsx';
          break;
        case 'medicine':
          blob = await getMedicineTemplate();
          filename = 'medicine_template.xlsx';
          break;
        case 'stock':
          blob = await getStockUpdateTemplate();
          filename = 'stock_update_template.xlsx';
          break;
        default:
          throw new Error('Invalid template type');
      }

      downloadTemplate(blob, filename);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Template download failed';
      setError(errorMessage);
      options?.onError?.(err);
    }
  };

  const reset = () => {
    setUploadResult(null);
    setError(null);
    setIsUploading(false);
  };

  return {
    uploadFile,
    downloadTemplateFile,
    isUploading,
    uploadResult,
    error,
    reset,
    formatResults: formatBulkUploadResults
  };
};
