import axiosInstance from '../../lib/axiosInstance';

// Types for bulk upload responses
export interface BulkUploadResult {
  message: string;
  successCount: number;
  errorCount: number;
  createdManufacturersCount: number;
  createdCategoriesCount: number;
  results: {
    medicines: any[];
    stocks: any[];
    errors: any[];
    createdManufacturers: any[];
    createdCategories: any[];
  };
}

export interface BulkUploadError {
  row: number;
  medicine: string;
  error: string;
  details?: string;
}

// Bulk Medicine with Stock Operations
export const getBulkMedicineWithStockTemplate = async (): Promise<Blob> => {
  const response = await axiosInstance.get('/bulk-medicine-stock/bulk-medicine-stock-template', {
    responseType: 'blob'
  });
  return response.data;
};

export const bulkUploadMedicinesWithStock = async (file: File): Promise<BulkUploadResult> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axiosInstance.post<BulkUploadResult>('/bulk-medicine-stock/bulk-upload/medicine-with-stock', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Legacy bulk medicine operations (keeping existing functionality)
export const getMedicineTemplate = async (): Promise<Blob> => {
  const response = await axiosInstance.get('/excel/medicine', {
    responseType: 'blob'
  });
  return response.data;
};

export const bulkUploadMedicines = async (file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);
  await axiosInstance.post('/excel/bulk-upload/medicine', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Bulk stock operations
export const getStockUpdateTemplate = async (): Promise<Blob> => {
  const response = await axiosInstance.get('/excel-stock/stock', {
    responseType: 'blob'
  });
  return response.data;
};

export const bulkUpdateStock = async (formData: FormData) => {
  const response = await axiosInstance.post('/excel-stock/bulk-upload/stock', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Utility functions for bulk operations
export const downloadTemplate = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const formatBulkUploadResults = (result: BulkUploadResult) => {
  const { successCount, errorCount, createdManufacturersCount, createdCategoriesCount, results } = result;
  
  return {
    summary: {
      totalProcessed: successCount + errorCount,
      successCount,
      errorCount,
      createdManufacturersCount,
      createdCategoriesCount,
    },
    details: results
  };
};
