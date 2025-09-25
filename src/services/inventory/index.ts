import { Medicine } from "../../type"
import axiosInstance from "@/lib/axiosInstance"

export const fetchMedicines = async (): Promise<Medicine[]> => {
  const response = await axiosInstance.get<Medicine[]>('/medicine/')
  return response.data
}

export const deleteMedicine = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/medicine/${id}`)
}

export const addMedicine = async (medicine: any): Promise<Medicine> => {
  const response = await axiosInstance.post<Medicine>('/medicine/', medicine)
  return response.data
}

// updateStock is now exported from stockService

// getMedicineTemplate and bulkUploadMedicines are now exported from bulkService

export const updateMedicine = async (id: number, medicine: any): Promise<Medicine> => {
  const response = await axiosInstance.put<Medicine>(`/medicine/${id}`, medicine)
  return response.data
}

// Re-export bulk operations from bulkService for backward compatibility
export {
  getBulkMedicineWithStockTemplate,
  bulkUploadMedicinesWithStock,
  getMedicineTemplate,
  bulkUploadMedicines,
  getStockUpdateTemplate,
  downloadTemplate,
  formatBulkUploadResults,
  type BulkUploadResult,
  type BulkUploadError
} from './bulkService';

// Re-export all stock operations
export * from './stockService';