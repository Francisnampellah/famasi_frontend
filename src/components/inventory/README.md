# Inventory Components

This directory contains all inventory-related React components for the Famasi application.

## Components

### 1. AddMedicineWithStockForm
A comprehensive form for adding individual medicines with stock data.

**Features:**
- ✅ Medicine name and dosage input
- ✅ Manufacturer selection with auto-creation
- ✅ Category selection with auto-creation
- ✅ Stock quantity and pricing
- ✅ Form validation
- ✅ Success/error handling
- ✅ Summary preview

**Usage:**
```tsx
import { AddMedicineWithStockForm } from '../components/inventory';

<AddMedicineWithStockForm 
  onSuccess={() => console.log('Medicine added!')}
  trigger={<Button>Add Medicine</Button>}
/>
```

### 2. QuickAddMedicineButton
A simple button wrapper for the AddMedicineWithStockForm.

**Usage:**
```tsx
import { QuickAddMedicineButton } from '../components/inventory';

<QuickAddMedicineButton 
  onSuccess={handleRefresh}
  variant="outline"
  size="sm"
>
  Quick Add
</QuickAddMedicineButton>
```

### 3. MedicineManagementSection
A complete section with tabs for individual and bulk medicine management.

**Features:**
- ✅ Tabbed interface (Individual vs Bulk)
- ✅ Individual medicine form
- ✅ Bulk upload options
- ✅ Quick action buttons

**Usage:**
```tsx
import { MedicineManagementSection } from '../components/inventory';

<MedicineManagementSection onRefresh={handleRefresh} />
```

### 4. BulkUploadModal
Modal for bulk medicine uploads.

**Usage:**
```tsx
import { BulkUploadModal } from '../components/inventory';

<BulkUploadModal 
  type="medicine-with-stock" 
  onSuccess={handleRefresh}
/>
```

### 5. BulkUploadSection
Complete section for bulk upload operations.

**Usage:**
```tsx
import { BulkUploadSection } from '../components/inventory';

<BulkUploadSection onRefresh={handleRefresh} />
```

## Form Features

### Medicine Form Fields
- **Name**: Medicine name (required)
- **Manufacturer**: Select existing or create new (required)
- **Category**: Select existing or create new (required)
- **Quantity**: Stock quantity (required, > 0)
- **Buy Price**: Cost per unit (optional)
- **Sell Price**: Selling price (required, > 0)
- **Dosage**: Medicine dosage (optional)
- **Unit**: Always set to "tablet" (as per requirements)

### Validation
- ✅ Required field validation
- ✅ Numeric value validation
- ✅ Price validation (non-negative)
- ✅ Quantity validation (positive)

### Auto-Creation
- ✅ **Manufacturers**: Automatically created if they don't exist
- ✅ **Categories**: Automatically created if they don't exist
- ✅ **Units**: All set to "tablet" as requested

### Stock Integration
- ✅ Creates medicine record
- ✅ Creates stock entry with quantity
- ✅ Creates purchase record (if quantity > 0)
- ✅ Sets price per unit for stock

## Usage Examples

### Basic Usage
```tsx
import { AddMedicineWithStockForm } from '../components/inventory';

function MyPage() {
  const handleSuccess = () => {
    // Refresh your data
    refetchMedicines();
    refetchStock();
  };

  return (
    <div>
      <AddMedicineWithStockForm onSuccess={handleSuccess} />
    </div>
  );
}
```

### Custom Trigger
```tsx
<AddMedicineWithStockForm 
  onSuccess={handleSuccess}
  trigger={
    <Button variant="outline" size="lg">
      <Plus className="w-4 h-4 mr-2" />
      Add New Medicine
    </Button>
  }
/>
```

### Complete Management Section
```tsx
import { MedicineManagementSection } from '../components/inventory';

function InventoryPage() {
  return (
    <div className="container mx-auto py-6">
      <MedicineManagementSection onRefresh={handleRefresh} />
    </div>
  );
}
```

### Quick Add Button
```tsx
import { QuickAddMedicineButton } from '../components/inventory';

function Header() {
  return (
    <div className="flex justify-between">
      <h1>Inventory</h1>
      <QuickAddMedicineButton onSuccess={handleRefresh} />
    </div>
  );
}
```

## Props

### AddMedicineWithStockForm
```tsx
interface AddMedicineWithStockFormProps {
  onSuccess?: () => void;           // Callback after successful addition
  trigger?: React.ReactNode;        // Custom trigger element
}
```

### QuickAddMedicineButton
```tsx
interface QuickAddMedicineButtonProps {
  onSuccess?: () => void;           // Callback after successful addition
  variant?: ButtonVariant;          // Button variant
  size?: ButtonSize;                // Button size
  className?: string;               // Additional CSS classes
  children?: React.ReactNode;       // Custom button content
}
```

### MedicineManagementSection
```tsx
interface MedicineManagementSectionProps {
  onRefresh?: () => void;           // Callback after successful operations
}
```

## Integration with Services

The form components integrate with the inventory services:

- `addMedicine()` - Creates the medicine record
- `updateStock()` - Creates stock entry
- `fetchStock()` - For refreshing data

## Error Handling

- ✅ Form validation errors
- ✅ API error handling
- ✅ User-friendly error messages
- ✅ Success feedback

## Styling

All components use the existing UI component library:
- `Button`, `Dialog`, `Input`, `Label`, `Select`
- `Card`, `Alert`, `Tabs`
- Consistent with the app's design system
