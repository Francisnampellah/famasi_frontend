import { Search, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <Card className="mb-8 shadow-md dark:shadow-lg dark:bg-gray-800/50">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Label 
              htmlFor="medicine-search" 
              className="text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              Search Medicines
            </Label>
            {/* <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search by name, category, or description</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Find medicines , Type to start searching.
          </p>

          <div className="relative w-full md:w-2/3">
            <div className="relative group">
              <Search 
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 
                          transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" 
              />
              <Input
                id="medicine-search"
                placeholder="Search medicines..."
                className="h-12 pl-12 text-lg border-2 border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800
                         transition-all duration-200
                         hover:border-blue-500 dark:hover:border-blue-400
                         focus:border-blue-600 dark:focus:border-blue-500
                         focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
                         placeholder:text-gray-400 dark:placeholder:text-gray-500"
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
} 