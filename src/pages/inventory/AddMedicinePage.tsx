import React from 'react';
import { MedicineManagementSection } from '../../components/inventory';

const AddMedicinePage: React.FC = () => {
  const handleRefresh = () => {
    // Refresh the inventory data after successful addition
    console.log('Refreshing inventory data...');
    // You can call your existing refresh functions here
    // e.g., refetchMedicines(), refetchStock(), etc.
  };

  return (
    <div className="container mx-auto py-6">
      <MedicineManagementSection onRefresh={handleRefresh} />
    </div>
  );
};

export default AddMedicinePage;
