"use client"

import { Download, FileUp, Filter, Plus, Search, SlidersHorizontal, View, Pencil, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SummaryCards } from "./components/SummaryCards"
import { InventoryTable } from "./components/InventoryTable"
import { InventoryActions } from "./components/InventoryActions"
import { useInventory } from "./hooks/useInventory"
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ViewMedicineDialog } from "./components/ViewMedicineDialog"
import { useState } from "react"
import { AddMedicineDialog } from "./components/AddMedicine"
import { UpdateStockDialog } from "./components/UpdateStockDialog"
import { Medicine } from "../../type"
import Header from "@/components/layout/header"

export default function InventoryPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const {
    medicines,
    isLoading,
    isError,
    error,
    searchTerm,
    setSearchTerm,
    addDialogOpen,
    setAddDialogOpen,
    handleDelete,
    openUpdateStockDialog,
    isDeleting,
    deletingId,
    updateStockDialogOpen,
    setUpdateStockDialogOpen,
    selectedMedicine,
    setSelectedMedicine,
    refetch,
  } = useInventory()

  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null)

  const handleEditMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine)
    setAddDialogOpen(true)
  }

  const handleAddMedicine = () => {
    setEditingMedicine(null)
    setAddDialogOpen(true)
  }

  return (
    <DashboardLayout>
      <Header Title='Inventory Management' date={date} setDate={setDate} />
      <div className="space-y-6">
        {/* Optional: Show actions section */}
        <InventoryActions 
          onRefresh={refetch}
          onAddMedicineOnly={handleAddMedicine}
        />
        
        <InventoryTable
          handleAddMedicine={handleAddMedicine}
          medicines={medicines}
          isLoading={isLoading}
          onDelete={handleDelete}
          onUpdateStock={openUpdateStockDialog}
          onView={(medicine) => {
            setSelectedMedicine(medicine)
            setViewDialogOpen(true)
          }}
          onEdit={handleEditMedicine}
          isDeleting={isDeleting}
          deletingId={deletingId}
          onRefresh={refetch}
        />

        <AddMedicineDialog
          open={addDialogOpen}
          onOpenChange={(open) => {
            setAddDialogOpen(open)
            if (!open) setEditingMedicine(null)
          }}
          medicine={editingMedicine}
          onSubmit={() => setEditingMedicine(null)}
      />

      <UpdateStockDialog
        open={updateStockDialogOpen}
        onOpenChange={setUpdateStockDialogOpen}
        medicine={selectedMedicine}
      />

        <ViewMedicineDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          medicine={selectedMedicine}
        />
      </div>
    </DashboardLayout>
  )
} 