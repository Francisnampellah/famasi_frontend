import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Medicine } from "../../../type"
import { fetchMedicines, deleteMedicine, addMedicine, updateMedicine, updateStock, bulkUploadMedicines } from "../../../services/inventory"
import { bulkUpdateStock } from "../../../services/inventory/stockService"
import { useNotification } from "../../../hooks/useNotification"

export function useInventory() {
  const { success, error: showError } = useNotification()
  const [searchTerm, setSearchTerm] = useState("")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [updateStockDialogOpen, setUpdateStockDialogOpen] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  // const [openViewDialog, setOpenViewDialog] = useState(false)
  
  const queryClient = useQueryClient()
  
  // Fetch medicines with Tanstack Query
  const { data: medicines = [], isLoading, isError, error: queryError, refetch } = useQuery({
    queryKey: ['medicines'],
    queryFn: fetchMedicines,
  })
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
      success("Medicine deleted", {
        description: "The medicine has been successfully deleted.",
      })
    },
    onError: (error) => {
      showError("Failed to delete medicine", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    },
  })
  
  // Add medicine mutation
  const addMutation = useMutation({
    mutationFn: addMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
      success("Medicine added", {
        description: "The new medicine has been successfully added.",
      })
    },
    onError: (error) => {
      showError("Failed to add medicine", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    },
  })
  
  // Update stock mutation
  const updateStockMutation = useMutation({
    mutationFn: updateStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
      success("Stock updated", {
        description: "The stock has been successfully updated.",
      })
    },
    onError: (error) => {
      showError("Failed to update stock", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    },
  })

  // Bulk update stock mutation
  const bulkUpdateStockMutation = useMutation({
    mutationFn: bulkUpdateStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
      success("Stock updated", {
        description: "The stock has been successfully updated.",
      })
    },
    onError: (error) => {
      showError("Failed to update stock", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    },
  })

  // Bulk upload mutation
  const bulkUploadMutation = useMutation({
    mutationFn: bulkUploadMedicines,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
      success("Bulk upload successful", {
        description: "Medicines have been uploaded successfully.",
      })
    },
    onError: (error) => {
      showError("Bulk upload failed", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    },
  })

  // Update medicine mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, medicine }: { id: number, medicine: any }) => updateMedicine(id, medicine),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
      success("Medicine updated", {
        description: "The medicine has been successfully updated.",
      })
    },
    onError: (error) => {
      showError("Failed to update medicine", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    },
  })

  // Filter medicines based on search term
  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Function to handle delete
  const handleDelete = (id: number) => {
    console.log("Deletes")
    deleteMutation.mutate(id)
  }
  
  // Function to handle add medicine
  const handleAddMedicine = (values: any) => {
    addMutation.mutate(values)
  }
  
  // Function to handle update stock
  const handleUpdateStock = (values: {medicineId: number, quantity: number, batchId: number, pricePerUnit: number}) => {
    console.log("those any values",values)
 
      updateStockMutation.mutate({
        medicineId: values.medicineId,
        quantity: values.quantity,
        batchId: values.batchId,
        pricePerUnit: values.pricePerUnit,
      })
  }
  
  // Function to open update stock dialog
  const openUpdateStockDialog = (medicine: Medicine) => {
    setSelectedMedicine(medicine)
    setUpdateStockDialogOpen(true)
  }

  return {
    medicines: filteredMedicines,
    isLoading,
    isError,
    error: queryError,
    searchTerm,
    addMutation,
    updateMutation,
    updateStockMutation,
    filteredMedicines,
    setFilteredMedicines: setSearchTerm,
    setSearchTerm,
    addDialogOpen,
    bulkUpdateStockMutation,
    setAddDialogOpen,
    updateStockDialogOpen,
    setUpdateStockDialogOpen,
    selectedMedicine,
    setSelectedMedicine,
    handleDelete,
    handleAddMedicine,
    handleUpdateStock,
    openUpdateStockDialog,
    isDeleting: deleteMutation.isPending,
    deletingId: deleteMutation.variables as number,
    bulkUploadMutation,
    refetch,
  }
} 