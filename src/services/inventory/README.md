# Inventory Services

This directory contains all inventory-related services and utilities for the Famasi application.

## Structure

- `index.ts` - Main inventory service exports
- `stockService.ts` - Stock-specific operations
- `bulkService.ts` - Bulk upload operations for medicines and stock

## Bulk Upload Services

### Medicine with Stock Upload

The new bulk medicine with stock upload functionality allows you to:

1. **Upload medicines with inventory and stock data simultaneously**
2. **Auto-create manufacturers and categories** if they don't exist
3. **Set all units to "tablet"** as requested
4. **Create purchase records** for stock entries
5. **Handle missing manufacturers/categories gracefully**

### Usage

```typescript
import { 
  bulkUploadMedicinesWithStock, 
  getBulkMedicineWithStockTemplate,
  downloadTemplate 
} from '../services/inventory';

// Download template
const template = await getBulkMedicineWithStockTemplate();
downloadTemplate(template, 'bulk_medicine_with_stock_template.xlsx');

// Upload file
const result = await bulkUploadMedicinesWithStock(file);
console.log(result);
```

### Excel Format

The Excel file should have the following columns:

| Column | Name | Description | Required |
|--------|------|-------------|----------|
| A | Name | Medicine name | Yes |
| B | Manufacturer | Manufacturer name (ID or Name) | No |
| C | Category | Category name (ID or Name) | No |
| D | Quantity | Stock quantity | Yes |
| E | Buy Price | Cost per unit | Yes |
| F | Sell Price | Selling price | Yes |
| G | Dosage | Medicine dosage | No |

### React Hook Usage

```typescript
import { useBulkUpload } from '../hooks/useBulkUpload';

const MyComponent = () => {
  const { uploadFile, downloadTemplateFile, isUploading, uploadResult, error } = useBulkUpload({
    onSuccess: (result) => {
      console.log('Upload successful:', result);
    },
    onError: (error) => {
      console.error('Upload failed:', error);
    }
  });

  const handleUpload = (file: File) => {
    uploadFile(file, 'medicine-with-stock');
  };

  const handleDownloadTemplate = () => {
    downloadTemplateFile('medicine-with-stock');
  };

  return (
    <div>
      {/* Your UI components */}
    </div>
  );
};
```

### React Component Usage

```typescript
import { BulkUploadModal, BulkUploadSection } from '../components/inventory';

const MyPage = () => {
  return (
    <div>
      {/* Individual modal */}
      <BulkUploadModal 
        type="medicine-with-stock" 
        onSuccess={() => console.log('Upload completed')}
      />

      {/* Complete section with all options */}
      <BulkUploadSection onRefresh={() => console.log('Refresh data')} />
    </div>
  );
};
```

## Backward Compatibility

All existing bulk upload functionality is preserved:

- `bulkUploadMedicines()` - Original medicine upload
- `bulkUpdateStock()` - Original stock update
- `getMedicineTemplate()` - Original medicine template
- `getStockUpdateTemplate()` - Original stock template

## Error Handling

The bulk upload service provides detailed error information:

```typescript
interface BulkUploadResult {
  message: string;
  successCount: number;
  errorCount: number;
  createdManufacturersCount: number;
  createdCategoriesCount: number;
  results: {
    medicines: any[];
    stocks: any[];
    errors: BulkUploadError[];
    createdManufacturers: any[];
    createdCategories: any[];
  };
}

interface BulkUploadError {
  row: number;
  medicine: string;
  error: string;
  details?: string;
}
```

## Features

- ✅ **Auto-creates manufacturers** if they don't exist
- ✅ **Auto-creates categories** if they don't exist  
- ✅ **Sets all units to "tablet"** as requested
- ✅ **Creates purchase records** for stock entries
- ✅ **Handles missing data gracefully**
- ✅ **Provides detailed success/error reporting**
- ✅ **Maintains backward compatibility**
- ✅ **TypeScript support**
- ✅ **React hooks and components**
