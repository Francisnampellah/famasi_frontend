import { format } from "date-fns"
import { MoreHorizontal, ArrowUpDown, Pencil, Plus, Trash2, Filter, Upload, FileUp } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Medicine } from "../../../type"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BulkUploadModal, AddMedicineWithStockForm } from "@/components/inventory"

interface InventoryTableProps {
  medicines: Medicine[]
  isLoading: boolean
  onDelete: (id: number) => void
  onUpdateStock: (medicine: Medicine) => void
  onView: (medicine: Medicine) => void
  onEdit: (medicine: Medicine) => void
  isDeleting?: boolean
  deletingId?: number
  handleAddMedicine: () => void
  onRefresh?: () => void
}

export function InventoryTable({
  medicines,
  isLoading,
  onDelete,
  onUpdateStock,
  onView,
  onEdit,
  isDeleting,
  deletingId,
  handleAddMedicine,
  onRefresh
}: InventoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (quantity < 10) {
      return (
        <Badge variant="secondary" className="bg-orange-500 hover:bg-orange-600">
          Low Stock
        </Badge>
      )
    } else {
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          In Stock
        </Badge>
      )
    }
  }

  const columns: ColumnDef<Medicine>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("name")}</div>
      },
    },
    {
      accessorKey: "manufacturer",
      header: "Manufacturer",
      cell: ({ row }) => {
        const manufacturer = row.original.manufacturer
        return <div>{manufacturer?.name || '-'}</div>
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.original.category
        return <div>{category?.name || '-'}</div>
      },
    },
    {
      accessorKey: "dosage",
      header: "Dosage",
      cell: ({ row }) => {
        return <div>{row.getValue("dosage") || '-'}</div>
      },
    },
    {
      accessorKey: "stock",
      header: "Quantity",
      cell: ({ row }) => {
        const stock = row.original.stock
        return <div>{stock?.quantity ?? 0}</div>
      },
    },
    {
      accessorKey: "unit",
      header: "Unit",
      cell: ({ row }) => {
        const unit = row.original.unit
        return <div>{unit?.name || '-'}</div>
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const medicine = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 w-8 p-0 bg-white hover:bg-gray-100">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView(medicine)}>
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(medicine)}>
                Edit medicine
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStock(medicine)}>
                Update stock
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(medicine.id)}
                disabled={isDeleting && deletingId === medicine.id}
              >
                {isDeleting && deletingId === medicine.id ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    }
  ]

  const table = useReactTable({
    data: medicines,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <AddMedicineWithStockForm 
            onSuccess={onRefresh}
            trigger={
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Medicine with Stock
              </Button>
            }
          />
          
          <BulkUploadModal 
            type="medicine-with-stock" 
            onSuccess={onRefresh}
            trigger={
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload
              </Button>
            }
          />
          
          <Button variant="outline" size="sm" onClick={handleAddMedicine}>
            <FileUp className="h-4 w-4 mr-2" />
            Add Medicine Only
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
} 