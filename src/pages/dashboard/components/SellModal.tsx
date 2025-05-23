import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Medicine } from "@/type"
import { useSell } from "../hooks/useMedicineSell"
import { InferenceClient } from "@huggingface/inference"

interface SellModalProps {
  isOpen: boolean
  onClose: () => void
  medicine: Medicine
  onSubmit: (data: { medicineId: number; quantity: number; price: number }) => void
}

export const SellModal = ({ isOpen, onClose, medicine, onSubmit }: SellModalProps) => {
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [medicineUsage, setMedicineUsage] = useState<string>("")
  const [isLoadingUsage, setIsLoadingUsage] = useState(false)

  const {handleSell} = useSell()

  const fetchMedicineUsage = async () => {
    try {
      setIsLoadingUsage(true)
      const client = new InferenceClient("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")
      
      const chatCompletion = await client.chatCompletion({
        provider: "novita",
        model: "deepseek-ai/DeepSeek-V3-0324",
        messages: [
          {
            role: "user",
            content: `What are the common uses and dosage instructions for ${medicine.name}? Please provide a brief summary.`,
          },
        ],
      })

      setMedicineUsage(chatCompletion.choices[0].message.content)
    } catch (error) {
      console.error("Error fetching medicine usage:", error)
      setMedicineUsage("Unable to fetch medicine usage information.")
    } finally {
      setIsLoadingUsage(false)
    }
  }

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
      <DialogContent className="max-h-[80vh] w-[90vw] max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Sell {medicine.name} - {medicine.manufacturer.name}</DialogTitle>
          <DialogDescription>Category : {medicine.category.name}</DialogDescription>
          <DialogDescription>Available stock : {medicine.stock.quantity} {medicine.unit.name}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 overflow-hidden">
          {/* Left Column - Medicine Usage */}
          <div className="h-[calc(80vh-200px)] overflow-y-auto pr-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={fetchMedicineUsage}
              disabled={isLoadingUsage}
              className="w-full mb-4 sticky top-0 bg-background z-10"
            >
              {isLoadingUsage ? "Loading..." : "Show Medicine Usage"}
            </Button>
            {medicineUsage && (
              <div className="p-4 bg-muted rounded-md">
                <h4 className="font-semibold text-lg mb-3">Medicine Usage Information</h4>
                <div className="space-y-3 text-sm">
                  {medicineUsage.split('###').map((section, index) => {
                    if (!section.trim()) return null;
                    const [title, ...content] = section.split('\n');
                    return (
                      <div key={index} className="space-y-2">
                        <h5 className="font-medium text-base">{title.replace('**', '').trim()}</h5>
                        <ul className="list-disc pl-5 space-y-1">
                          {content
                            .filter(line => line.trim())
                            .map((line, i) => (
                              <li key={i} className="text-muted-foreground">
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
          <div className="h-[calc(80vh-200px)] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={medicine.stock.quantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                  placeholder="Enter quantity"
                  required
                />

                <p className="text-sm text-muted-foreground">
                  Price Per unit: {medicine.sellPrice} Tsh
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Total price</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="Enter price"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Confirm Sale</Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 