import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Plus, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { addMedicine, updateStock } from '../../services/inventory';
import { fetchStock } from '../../services/inventory/stockService';

interface MedicineFormData {
  name: string;
  manufacturer: string;
  category: string;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  dosage: string;
}

interface AddMedicineWithStockFormProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export const AddMedicineWithStockForm: React.FC<AddMedicineWithStockFormProps> = ({ 
  onSuccess,
  trigger 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<MedicineFormData>({
    name: '',
    manufacturer: '',
    category: '',
    quantity: 0,
    buyPrice: 0,
    sellPrice: 0,
    dosage: ''
  });

  const [existingManufacturers, setExistingManufacturers] = useState<string[]>([]);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [newManufacturer, setNewManufacturer] = useState('');
  const [newCategory, setNewCategory] = useState('');

  // Fetch existing manufacturers and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // You would typically fetch these from your API
        // For now, using mock data
        setExistingManufacturers(['Pfizer', 'Johnson & Johnson', 'Novartis', 'Roche', 'Merck']);
        setExistingCategories(['Tablets', 'Capsules', 'Syrup', 'Cream', 'Injection', 'Drops']);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof MedicineFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const handleManufacturerChange = (value: string) => {
    if (value === 'new') {
      setFormData(prev => ({ ...prev, manufacturer: '' }));
    } else {
      setFormData(prev => ({ ...prev, manufacturer: value }));
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'new') {
      setFormData(prev => ({ ...prev, category: '' }));
    } else {
      setFormData(prev => ({ ...prev, category: value }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Medicine name is required');
      return false;
    }
    if (!formData.manufacturer.trim()) {
      setError('Manufacturer is required');
      return false;
    }
    if (!formData.category.trim()) {
      setError('Category is required');
      return false;
    }
    if (formData.quantity <= 0) {
      setError('Quantity must be greater than 0');
      return false;
    }
    if (formData.buyPrice < 0) {
      setError('Buy price cannot be negative');
      return false;
    }
    if (formData.sellPrice <= 0) {
      setError('Sell price must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Create the medicine
      const medicineData = {
        name: formData.name.trim(),
        manufacturer: formData.manufacturer.trim(),
        category: formData.category.trim(),
        unit: 'tablet', // As requested, all units are set to tablet
        sellPrice: formData.sellPrice,
        dosage: formData.dosage.trim() || null
      };

      const createdMedicine = await addMedicine(medicineData);

      // Create stock entry if quantity > 0
      if (formData.quantity > 0) {
        await updateStock({
          medicineId: createdMedicine.id,
          quantity: formData.quantity,
          pricePerUnit: formData.buyPrice,
          batchId: 1 // You might want to create a new batch or use an existing one
        });
      }

      setSuccess(true);
      setTimeout(() => {
        handleClose();
        onSuccess?.();
      }, 2000);

    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to add medicine');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({
      name: '',
      manufacturer: '',
      category: '',
      quantity: 0,
      buyPrice: 0,
      sellPrice: 0,
      dosage: ''
    });
    setNewManufacturer('');
    setNewCategory('');
    setError(null);
    setSuccess(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Medicine with Stock
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Add Medicine with Stock
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success Message */}
          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Medicine added successfully! This dialog will close automatically.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Medicine Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Medicine Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter medicine name"
                required
              />
            </div>

            {/* Dosage */}
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                value={formData.dosage}
                onChange={(e) => handleInputChange('dosage', e.target.value)}
                placeholder="e.g., 500mg, 10ml"
              />
            </div>

            {/* Manufacturer */}
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer *</Label>
              <Select value={formData.manufacturer} onValueChange={handleManufacturerChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select or add manufacturer" />
                </SelectTrigger>
                <SelectContent>
                  {existingManufacturers.map((manufacturer) => (
                    <SelectItem key={manufacturer} value={manufacturer}>
                      {manufacturer}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">+ Add New Manufacturer</SelectItem>
                </SelectContent>
              </Select>
              {formData.manufacturer === '' && (
                <Input
                  value={newManufacturer}
                  onChange={(e) => {
                    setNewManufacturer(e.target.value);
                    handleInputChange('manufacturer', e.target.value);
                  }}
                  placeholder="Enter new manufacturer name"
                />
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select or add category" />
                </SelectTrigger>
                <SelectContent>
                  {existingCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">+ Add New Category</SelectItem>
                </SelectContent>
              </Select>
              {formData.category === '' && (
                <Input
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                    handleInputChange('category', e.target.value);
                  }}
                  placeholder="Enter new category name"
                />
              )}
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Stock Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                placeholder="Enter quantity"
                required
              />
            </div>

            {/* Unit */}
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value="tablet"
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-muted-foreground">
                All medicines are set to "tablet" unit as per system requirements
              </p>
            </div>

            {/* Buy Price */}
            <div className="space-y-2">
              <Label htmlFor="buyPrice">Buy Price (Cost per Unit)</Label>
              <Input
                id="buyPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.buyPrice}
                onChange={(e) => handleInputChange('buyPrice', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            {/* Sell Price */}
            <div className="space-y-2">
              <Label htmlFor="sellPrice">Sell Price *</Label>
              <Input
                id="sellPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.sellPrice}
                onChange={(e) => handleInputChange('sellPrice', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Summary</CardTitle>
              <CardDescription>
                Review the medicine details before adding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Medicine:</span>
                <span className="font-medium">{formData.name || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span>Manufacturer:</span>
                <span className="font-medium">{formData.manufacturer || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="font-medium">{formData.category || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span className="font-medium">{formData.quantity} tablets</span>
              </div>
              <div className="flex justify-between">
                <span>Buy Price:</span>
                <span className="font-medium">${formData.buyPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sell Price:</span>
                <span className="font-medium">${formData.sellPrice.toFixed(2)}</span>
              </div>
              {formData.dosage && (
                <div className="flex justify-between">
                  <span>Dosage:</span>
                  <span className="font-medium">{formData.dosage}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || success}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Medicine
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
