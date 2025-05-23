"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { useTransactions } from './hooks/useTransactions';
import TransactionTable from './components/TransactionTable';
import TransactionFilters from './components/TransactionFilters';
import DashboardLayout from '../../components/layout/DashboardLayout'
import Header from '../../components/layout/header'
import { formatCurrency } from '../../utils/formatCurrency';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface Transaction {
  type: 'SALE' | 'PURCHASE' | 'EXPENSE' | 'FINANCE';
  amount: number;
  // ... other transaction properties
}

const TransactionPage: React.FC = () => {
  const [filters, setFilters] = useState<any>({});
  const { 
    transactions, 
    isLoading, 
    total, 
    page, 
    pageSize, 
    handlePageChange, 
    handlePageSizeChange 
  } = useTransactions(filters);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({});
  };

  // Calculate totals and summary
  const summary = useMemo(() => {
    const totals = {
      sales: 0,
      purchases: 0,
      expenses: 0,
      finance: 0,
    };

    transactions?.forEach(transaction => {
      switch (transaction.type) {
        case 'SALE':
          totals.sales += transaction.amount;
          break;
        case 'PURCHASE':
          totals.purchases += transaction.amount;
          break;
        case 'EXPENSE':
          totals.expenses += transaction.amount;
          break;
        case 'FINANCE':
          totals.finance += transaction.amount;
          break;
      }
    });

    const netProfit = totals.sales - (totals.purchases + totals.expenses);
    const remainingCash = totals.sales + totals.finance - (totals.purchases + totals.expenses);

    return {
      ...totals,
      netProfit,
      remainingCash
    };
  }, [transactions]);

  const handleViewTransaction = (transaction: any) => {
    // Implement view transaction logic here
    console.log('View transaction:', transaction);
  };

  // Calculate progress percentages
  const salesProgress = (summary.sales / (summary.sales + summary.purchases + summary.expenses)) * 100;
  const purchasesProgress = (summary.purchases / (summary.sales + summary.purchases + summary.expenses)) * 100;
  const expensesProgress = (summary.expenses / (summary.sales + summary.purchases + summary.expenses)) * 100;

  return (
    <DashboardLayout>
      <Header Title='Cash Flow' date={date} setDate={setDate}/>
      <div className="container mx-auto py-6 space-y-6">
        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sales Card */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>Total Sales</span>
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{formatCurrency(summary.sales)}</div>
              <Progress value={salesProgress} className="h-2 mt-2 bg-green-100 dark:bg-green-900" />
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-green-500 font-medium">+20.1%</span> from last week
              </p>
            </CardContent>
          </Card>

          {/* Purchases Card */}
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <TrendingDown className="h-4 w-4 text-yellow-500" />
                <span>Total Purchases</span>
              </CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{formatCurrency(summary.purchases)}</div>
              <Progress value={purchasesProgress} className="h-2 mt-2 bg-yellow-100 dark:bg-yellow-900" />
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-yellow-500 font-medium">+10.5%</span> from last week
              </p>
            </CardContent>
          </Card>

          {/* Expenses Card */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span>Total Expenses</span>
              </CardTitle>
              <DollarSign className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{formatCurrency(summary.expenses)}</div>
              <Progress value={expensesProgress} className="h-2 mt-2 bg-red-100 dark:bg-red-900" />
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-red-500 font-medium">+5.2%</span> from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Profit and Cash Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>Net Profit</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{formatCurrency(summary.netProfit)}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Calculated from total sales minus purchases and expenses
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                <span>Remaining Cash</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{formatCurrency(summary.remainingCash)}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Available cash after all transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>View and manage your transaction history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <TransactionFilters
                onFilter={handleFilter}
                onReset={handleReset}
              />
              
              <TransactionTable
                transactions={transactions}
                loading={isLoading}
                total={total}
                page={page}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onView={handleViewTransaction}
                filters={filters}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TransactionPage; 