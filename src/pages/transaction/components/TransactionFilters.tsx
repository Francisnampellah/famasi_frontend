"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Filter, CalendarIcon, Search, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import AddTransactionForm from './AddTransactionForm';
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }).optional(),
  type: z.enum(["SALE", "PURCHASE", "EXPENSE", "FINANCE"]).optional(),
  search: z.string().optional(),
});

interface TransactionFiltersProps {
  onFilter: (values: any) => void;
  onReset: () => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({ onFilter, onReset }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onFilter(values);
  };

  const handleReset = () => {
    form.reset();
    onReset();
  };

  return (
    <Card className="border-gray-200 dark:border-gray-800">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span>Filter Transactions</span>
            </h2>
            <AddTransactionForm />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Search Reference</FormLabel>
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by reference number..."
                          className="pl-8"
                          {...field}
                        />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium">Date Range</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value?.from ? (
                                field.value.to ? (
                                  <>
                                    {format(field.value.from, "LLL dd, y")} -{" "}
                                    {format(field.value.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(field.value.from, "LLL dd, y")
                                )
                              ) : (
                                <span>Pick a date range</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={field.value?.from}
                            selected={field.value ? { from: field.value.from, to: field.value.to } : undefined}
                            onSelect={field.onChange}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SALE">Sale</SelectItem>
                          <SelectItem value="PURCHASE">Purchase</SelectItem>
                          <SelectItem value="EXPENSE">Expense</SelectItem>
                          <SelectItem value="FINANCE">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Apply Filters
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionFilters; 