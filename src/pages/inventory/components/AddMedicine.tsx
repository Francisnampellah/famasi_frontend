"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import CreatableSelect from "react-select/creatable"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MedicineFormSchema } from "../schema"
import { useInventory } from "../hooks/useInventory"
import { useSupport } from "../hooks/useSupport"
import { bulkUploadMedicines, getMedicineTemplate } from "@/services/inventory"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { Medicine } from "../../../type"
import { Download } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface AddMedicineDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (values: any) => void
  medicine?: Medicine | null
}

export function AddMedicineDialog({ open, onOpenChange, onSubmit, medicine }: AddMedicineDialogProps) {
  const { manufacturers, categories, units, addManufacturerMutation, addCategoryMutation, addUnitMutation } = useSupport()
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { addMutation, updateMutation, bulkUploadMutation } = useInventory()
  const form = useForm<z.infer<typeof MedicineFormSchema>>({
    resolver: zodResolver(MedicineFormSchema),
    defaultValues: {
      name: "",
      manufacturer: "",
      unit: "",
      category: "",
      sellPrice: "",
      quantity: "0",
      dosage: "",
    },
  })

  // Set form values when editing an existing medicine
  useEffect(() => {
    if (medicine) {
      form.reset({
        name: medicine.name,
        manufacturer: medicine.manufacturer?.id?.toString() || "",
        unit: medicine.unit?.id?.toString() || "",
        category: medicine.category?.id?.toString() || "",
        sellPrice: medicine.sellPrice?.toString() || "",
        quantity: medicine.stock?.quantity?.toString() || "0",
        dosage: medicine.dosage || "",
      })
    } else {
      form.reset({
        name: "",
        manufacturer: "",
        unit: "",
        category: "",
        sellPrice: "",
        quantity: "0",
        dosage: "",
      })
    }
  }, [medicine, form])

  // Convert data to format required by react-select
  const manufacturerOptions = manufacturers?.map((m) => ({ value: m.id?.toString() || "", label: m.name || "" })) || []
  const categoryOptions = categories?.map((c) => ({ value: c.id?.toString() || "", label: c.name || "" })) || []
  const unitOptions = units?.map((u) => ({ value: u.id?.toString() || "", label: u.name || "" })) || []

  const handleCreateManufacturer = async (inputValue: string) => {
    try {
      const response = await addManufacturerMutation.mutateAsync({ name: inputValue });
      // Update the query cache immediately with the new manufacturer
      queryClient.setQueryData(['manufacturers'], (old: any) => [...(old || []), response]);
      // Set the form value with the new manufacturer's ID
      form.setValue("manufacturer", response.id.toString());
    } catch (error) {
      console.error("Error creating manufacturer:", error);
    }
  };

  const handleCreateCategory = async (inputValue: string) => {
    try {
      const response = await addCategoryMutation.mutateAsync({ name: inputValue });
      // Update the query cache immediately with the new category
      queryClient.setQueryData(['categories'], (old: any) => [...(old || []), response]);
      // Set the form value with the new category's ID
      form.setValue("category", response.id.toString());
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleCreateUnit = async (inputValue: string) => {
    try {
      const response = await addUnitMutation.mutateAsync({ name: inputValue });
      // Update the query cache immediately with the new unit
      queryClient.setQueryData(['units'], (old: any) => [...(old || []), response]);
      // Set the form value with the new unit's ID
      form.setValue("unit", response.id.toString());
    } catch (error) {
      console.error("Error creating unit:", error);
    }
  };

  function handleSubmit(values: z.infer<typeof MedicineFormSchema>) {
    const formattedValues = {
      ...values,
      sellPrice: typeof values.sellPrice === "string" ? Number.parseFloat(values.sellPrice) : values.sellPrice,
    }

    if (medicine) {
      updateMutation.mutate({ id: medicine.id, medicine: formattedValues }, {
        onSuccess: () => {
          form.reset()
          onOpenChange(false)
        },
        onError: (error) => {
          console.error("Error updating medicine:", error)
        },
      })
    } else {
      addMutation.mutate(formattedValues, {
        onSuccess: () => {
          form.reset()
          onOpenChange(false)
        },
        onError: (error) => {
          console.error("Error adding medicine:", error)
        },
      })
    }

    onSubmit?.(formattedValues)
  }

  // Custom styles for react-select to match shadcn UI
  const selectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: "40px",
      borderRadius: "0.375rem",
      borderColor: "hsl(var(--input))",
      boxShadow: "none",
      "&:hover": {
        borderColor: "hsl(var(--input))",
      },
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: "0.375rem",
      overflow: "hidden",
      zIndex: 50,
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? "hsl(var(--accent))" : "transparent",
      color: state.isFocused ? "hsl(var(--accent-foreground))" : "inherit",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "hsl(var(--accent))",
        color: "hsl(var(--accent-foreground))",
      },
    }),
  }

  const handleDownloadTemplate = async () => {

    console.log("Downloading template")
    
    try {
      const blob = await getMedicineTemplate();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'medicine_template.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading template:', error);
    }
  }

  const handleBulkUpload = async (file: File) => {
    try {
      await bulkUploadMutation.mutateAsync(file);
      setSelectedFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading medicines:', error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <Tabs defaultValue={medicine ? "single" : "bulk"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 gap-2 bg-gray-700">
            <TabsTrigger value="single" className="data-[state=active]:bg-white data-[state=inactive]:bg-gray-700 data-[state=active]:text-foreground outline-none">
              Single Item
            </TabsTrigger>
            <TabsTrigger value="bulk" disabled={!!medicine} className="data-[state=active]:bg-white data-[state=inactive]:bg-gray-700 data-[state=active]:text-foreground outline-none">
              Bulk Upload
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="single" className="mt-0">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>{medicine ? "Update Medicine" : "Add New Medicine"}</CardTitle>
                <CardDescription>
                  {medicine ? "Update the medicine details." : "Fill in the medicine details below."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medicine Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter medicine name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dosage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dosage</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter dosage (e.g., 500mg)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="manufacturer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Manufacturer</FormLabel>
                            <FormControl>
                              <CreatableSelect
                                isClearable
                                options={manufacturerOptions}
                                styles={selectStyles}
                                placeholder="Select or create manufacturer"
                                value={manufacturerOptions.find((option) => option.value === field.value) || null}
                                onChange={(newValue) => field.onChange(newValue ? newValue.value : "")}
                                onCreateOption={handleCreateManufacturer}
                                formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <CreatableSelect
                                isClearable
                                options={categoryOptions}
                                styles={selectStyles}
                                placeholder="Select or create category"
                                value={categoryOptions.find((option) => option.value === field.value) || null}
                                onChange={(newValue) => field.onChange(newValue ? newValue.value : "")}
                                onCreateOption={handleCreateCategory}
                                formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <FormControl>
                              <CreatableSelect
                                isClearable
                                options={unitOptions}
                                styles={selectStyles}
                                placeholder="Select or create unit"
                                value={unitOptions.find((option) => option.value === field.value) || null}
                                onChange={(newValue) => field.onChange(newValue ? newValue.value : "")}
                                onCreateOption={handleCreateUnit}
                                formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sellPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Selling Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e.target.valueAsNumber || e.target.value)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Initial Stock Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder="0" {...field} />
                          </FormControl>
                          <FormDescription>Enter the initial quantity in stock</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <CardFooter className="flex justify-end space-x-2 border-t pt-4">
                      <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">{medicine ? "Update Medicine" : "Save Medicine"}</Button>
                    </CardFooter>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk" className="mt-0">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>Bulk Upload Medicines</CardTitle>
                <CardDescription>
                  Upload multiple medicines at once using our template.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center items-center space-y-4">
                <Button variant="outline" onClick={handleDownloadTemplate} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Template
                </Button>
                <div className="flex items-center gap-2 w-full max-w-md">
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setSelectedFile(file);
                    }}
                    className="flex-1"
                    id="bulk-upload"
                  />
                  <Button variant="outline" onClick={() => document.getElementById('bulk-upload')?.click()}>
                    Choose File
                  </Button>
                </div>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected file: {selectedFile.name}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 border-t pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={() => selectedFile && handleBulkUpload(selectedFile)}
                  disabled={!selectedFile}
                >
                  Upload Medicines
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
