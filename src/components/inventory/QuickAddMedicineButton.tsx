import React from 'react';
import { AddMedicineWithStockForm } from './AddMedicineWithStockForm';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface QuickAddMedicineButtonProps {
  onSuccess?: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

export const QuickAddMedicineButton: React.FC<QuickAddMedicineButtonProps> = ({
  onSuccess,
  variant = 'default',
  size = 'default',
  className,
  children
}) => {
  return (
    <AddMedicineWithStockForm
      onSuccess={onSuccess}
      trigger={
        <Button variant={variant} size={size} className={className}>
          {children || (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Medicine
            </>
          )}
        </Button>
      }
    />
  );
};
