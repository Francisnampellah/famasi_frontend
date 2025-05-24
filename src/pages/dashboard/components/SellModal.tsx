import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Medicine } from "@/type"
import { useSell } from "../hooks/useMedicineSell"
import { useMedicineUsage } from "../hooks/useMedicineUsage"

interface SellModalProps {
  isOpen: boolean
  onClose: () => void
  medicine: Medicine
  onSubmit: (data: { medicineId: number; quantity: number; price: number }) => void
}

export const SellModal = ({ isOpen, onClose, medicine, onSubmit }: SellModalProps) => {
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState<number>(0)
  const { handleSell } = useSell()
  const { medicineUsage, isLoadingUsage, fetchMedicineUsage } = useMedicineUsage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    handleSell({
      medicineId: medicine.id,
      quantity: Number(quantity),
      totalPrice: price.toString()
    })

    onClose()
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuantity(value)
    const numericValue = Number(value)
    const sellPrice = Number(medicine.sellPrice)
    if (!isNaN(numericValue) && !isNaN(sellPrice)) {
      setPrice(numericValue * sellPrice)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-[1200px] p-6">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-2xl font-bold">{medicine.name}</DialogTitle>
          <div className="space-y-1">
            <DialogDescription className="text-base">Manufacturer: {medicine.manufacturer.name}</DialogDescription>
            <DialogDescription className="text-base">Category: {medicine.category.name}</DialogDescription>
            <DialogDescription className="text-base font-medium text-primary">
              Available stock: {medicine.stock.quantity} {medicine.unit.name}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
          {/* Left Column - Medicine Usage */}
          <div className="h-[calc(80vh-250px)] overflow-y-auto pr-4">
            {!medicineUsage && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => fetchMedicineUsage(medicine.name)}
                disabled={isLoadingUsage}
                className="w-full mb-6 sticky top-0 bg-background z-10 hover:bg-primary/10"
              >
                {isLoadingUsage ? "Loading..." : "Show Medicine Usage"}
              </Button>
            )}
            {medicineUsage && (
              <div className="p-6 bg-muted/50 rounded-lg shadow-sm">
                <h4 className="font-semibold text-xl mb-4 text-primary">Medicine Usage Information</h4>
                <div className="space-y-6 text-sm">
                  {medicineUsage.split('###').map((section, index) => {
                    if (!section.trim()) return null;
                    const [title, ...content] = section.split('\n');
                    return (
                      <div key={index} className="space-y-3">
                        <h5 className="font-medium text-lg text-foreground">{title.replace('**', '').trim()}</h5>
                        <ul className="list-disc pl-6 space-y-2">
                          {content
                            .filter(line => line.trim())
                            .map((line, i) => (
                              <li key={i} className="text-muted-foreground leading-relaxed">
                                {line.replace(/^\s*-\s*/, '').replace(/\*\*/g, '')}
                              </li>
                            ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Form */}
          <div className="h-[calc(80vh-250px)] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-card rounded-lg shadow-sm">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-base font-medium">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={medicine.stock.quantity}
                    value={quantity}
                    onChange={handleQuantityChange}
                    placeholder="Enter quantity"
                    required
                    className="h-12 text-base"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Price per unit: {medicine.sellPrice} Tsh
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-base font-medium">Total price</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="Enter price"
                    required
                    className="h-12 text-base"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="px-6 h-12"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="px-6 h-12"
                >
                  Confirm Sale
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 