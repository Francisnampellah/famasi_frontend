import React from 'react';
import { BulkUploadSection } from '../../components/inventory';

const BulkUploadPage: React.FC = () => {
  const handleRefresh = () => {
    // Refresh the inventory data after successful upload
    console.log('Refreshing inventory data...');
    // You can call your existing refresh functions here
    // e.g., refetchMedicines(), refetchStock(), etc.
  };

  return (
    <div className="container mx-auto py-6">
      <BulkUploadSection onRefresh={handleRefresh} />
    </div>
  );
};

export default BulkUploadPage;
