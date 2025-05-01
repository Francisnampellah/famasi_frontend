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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MedicineFormSchema } from "../schema"
import { useInventory } from "../hooks/useInventory"
import { useSupport } from "../hooks/useSupport"
import { getMedicineTemplate } from "@/services/inventory"

export function AddMedicineDialog({ open, onOpenChange, onSubmit }: any) {
  const { manufacturers, categories, units, addManufacturerMutation, addCategoryMutation, addUnitMutation } = useSupport()
  const queryClient = useQueryClient();

  const { addMutation } = useInventory()
  const form = useForm<z.infer<typeof MedicineFormSchema>>({
    resolver: zodResolver(MedicineFormSchema),
    defaultValues: {
      name: "",
      manufacturer: "",
      unit: "",
      category: "",
      sellPrice: "",
      quantity: "0",
    },
  })

  // Convert data to format required by react-select
  const manufacturerOptions = manufacturers.map((m) => ({ value: m.id.toString(), label: m.name }))
  const categoryOptions = categories.map((c) => ({ value: c.id.toString(), label: c.name }))
  const unitOptions = units.map((u) => ({ value: u.id.toString(), label: u.name }))

  const handleCreateManufacturer = async (inputValue: string) => {
    try {
      const response = await addManufacturerMutation.mutateAsync({ name: inputValue });
      const newManufacturer = response.manufacturer || response;
      // Update the query cache immediately with the new manufacturer
      queryClient.setQueryData(['manufacturers'], (old: any) => [...(old || []), newManufacturer]);
      // Set the form value with the new manufacturer's ID
      form.setValue("manufacturer", newManufacturer.id.toString());
    } catch (error) {
      console.error("Error creating manufacturer:", error);
    }
  };

  const handleCreateCategory = async (inputValue: string) => {
    try {
      const response = await addCategoryMutation.mutateAsync({ name: inputValue });
      const newCategory = response.category || response;
      // Update the query cache immediately with the new category
      queryClient.setQueryData(['categories'], (old: any) => [...(old || []), newCategory]);
      // Set the form value with the new category's ID
      form.setValue("category", newCategory.id.toString());
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleCreateUnit = async (inputValue: string) => {
    try {
      const response = await addUnitMutation.mutateAsync({ name: inputValue });
      const newUnit = response.unit || response;
      // Update the query cache immediately with the new unit
      queryClient.setQueryData(['units'], (old: any) => [...(old || []), newUnit]);
      // Set the form value with the new unit's ID
      form.setValue("unit", newUnit.id.toString());
    } catch (error) {
      console.error("Error creating unit:", error);
    }
  };

  function handleSubmit(values: z.infer<typeof MedicineFormSchema>) {
    const formattedValues = {
      ...values,
      sellPrice: typeof values.sellPrice === "string" ? Number.parseFloat(values.sellPrice) : values.sellPrice,
    }

    addMutation.mutate(formattedValues, {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
      onError: (error) => {
        console.error("Error adding medicine:", error)
      },
    })

    onSubmit?.(formattedValues)
    form.reset()
    onOpenChange(false)
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
    const template = await getMedicineTemplate()
    const blob = new Blob([template], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medicine_template.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Medicine</DialogTitle>
          <DialogDescription>Enter the details for the new medicine item.</DialogDescription>
        </DialogHeader>
        <Button onClick={handleDownloadTemplate}>Download Template</Button>
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Medicine</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
