import axiosInstance from '../../lib/axiosInstance';
import { Medicine } from '../../type';

export const fetchStock = async () => {
  const response = await axiosInstance.get('/stock');
  return response.data;
};

export const fetchStockByMedicineId = async (medicineId: number) => {
  const response = await axiosInstance.get(`/stock/medicine/${medicineId}`);
  return response.data;
};

export const updateStock = async ({ medicineId, quantity, batchId }: { medicineId: number; quantity: number; batchId: number }) => {
  const response = await axiosInstance.patch(`/stock/${medicineId}`, {
    quantity,
    batchId,
  });
  return response.data;
};

export const adjustStock = async (medicineId: number, adjustment: number) => {
  const response = await axiosInstance.patch(`/stock/medicine/${medicineId}/adjust`, { adjustment });
  return response.data;
};

// Re-export stock-specific bulk operations from bulkService
export {
  getStockUpdateTemplate,
  bulkUpdateStock
} from './bulkService';

export const fetchBatches = async () => {
  const response = await axiosInstance.get('/batch');
  console.log(response.data);
  return response.data;
};
