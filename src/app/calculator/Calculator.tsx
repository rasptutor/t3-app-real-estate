"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, DollarSign, Home, Info, PieChart, TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { RouterOutputs } from "@/trpc/react";

type CalculationResult = RouterOutputs["bond"]["calculate"];

export default function CalculatorPage() {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    propertyPrice: 875000,
    downPaymentPercent: 20,
    interestRate: 7.5,
    loanTermYears: 20,
    monthlyIncome: 15000,
  });

  const bondMutation = api.bond.calculate.useMutation({
    onSuccess: (data) => {
      setCalculation(data);
      setCalculationHistory((prev) => [data, ...prev.slice(0, 4)]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to calculate bond. Please try again.",
        variant: "destructive",
      });
    },
  });

  const [calculation, setCalculation] = useState<CalculationResult | null>(null);
  const [calculationHistory, setCalculationHistory] = useState<CalculationResult[]>([]);

  const handleInputChange = (field: string, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const clearCalculation = () => {
    setFormData({
      propertyPrice: 0,
      downPaymentPercent: 20,
      interestRate: 7.5,
      loanTermYears: 30,
      monthlyIncome: 0
    });
    setCalculation(null);
  };

  const formatMonthly = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-page-title">
              Bond Calculator
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Calculate your monthly mortgage payments and determine affordability
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calculator Inputs */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Calculator className="mr-2 h-5 w-5 text-blue-600" />
                        Loan Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                    <Label htmlFor="propertyPrice" className="block text-sm font-medium text-gray-700 mb-2">
                        Property Price *
                    </Label>
                    <Input
                        id="propertyPrice"
                        type="number"
                        value={formData.propertyPrice || ''}
                        onChange={(e) => handleInputChange('propertyPrice', parseFloat(e.target.value) || 0)}
                        className="w-full"
                        placeholder="875000"
                        data-testid="input-property-price"
                        required
                    />
                    </div>

                    <div>
                        <Label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 mb-2">
                            Down Payment (%)
                        </Label>
                        <Input
                            id="downPayment"
                            type="number"
                            value={formData.downPaymentPercent}
                            onChange={(e) => handleInputChange('downPaymentPercent', parseFloat(e.target.value) || 0)}
                            min="0"
                            max="100"
                            className="w-full"
                            data-testid="input-down-payment"
                        />
                        <div className="mt-2 text-sm text-gray-500">
                            Amount: {calculation ? formatCurrency(calculation.downPayment) : '$0'}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
                            Interest Rate (%)
                        </Label>
                        <Input
                            id="interestRate"
                            type="number"
                            step="0.1"
                            value={formData.interestRate}
                            onChange={(e) => handleInputChange('interestRate', parseFloat(e.target.value) || 0)}
                            className="w-full"
                            data-testid="input-interest-rate"
                        />
                    </div>

                    <div>
                        <Label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-2">
                            Loan Term
                        </Label>
                        <Select
                            value={formData.loanTermYears.toString()}
                            onValueChange={(value) => handleInputChange('loanTermYears', parseInt(value))}
                        >
                            <SelectTrigger data-testid="select-loan-term">
                            <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="15">15 years</SelectItem>
                            <SelectItem value="20">20 years</SelectItem>
                            <SelectItem value="25">25 years</SelectItem>
                            <SelectItem value="30">30 years</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    <div>
                        <Label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 mb-2">
                            Monthly Income (Optional)
                        </Label>
                        <Input
                            id="monthlyIncome"
                            type="number"
                            value={formData.monthlyIncome || ''}
                            onChange={(e) => handleInputChange('monthlyIncome', parseFloat(e.target.value) || 0)}
                            className="w-full"
                            placeholder="15000"
                            data-testid="input-monthly-income"
                        />
                        <div className="mt-2 text-sm text-gray-500">
                            Used for affordability calculation
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <Button
                            onClick={() => {
                                if (formData.propertyPrice <= 100000) {
                                toast({
                                    title: "Missing Data",
                                    description: "Please enter a property price before calculating.",
                                    variant: "destructive",
                                });
                                return;
                                }
                                bondMutation.mutate(formData);
                            }}
                            disabled={bondMutation.isPending}
                            className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded"
                            data-testid="button-calculate"
                            >
                            {bondMutation.isPending ? "Calculating..." : "Calculate"}
                        </Button>
                        <Button 
                            variant="outline"
                            onClick={clearCalculation}
                            data-testid="button-clear"
                        >
                            Clear
                        </Button>                        
                    </div>                       
                </CardContent>
            </Card>
          </div>

            {/* Results */}
            <div className="lg:col-span-2 space-y-6">
                {/* Main Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                            <Home className="mr-2 h-5 w-5 text-blue-600" />
                            Monthly Payment
                        </CardTitle>
                        </CardHeader>
                        <CardContent>
                        {calculation ? (
                            <div>
                            <div className="text-3xl font-bold text-blue-600 mb-2" data-testid="result-monthly-payment">
                                {formatMonthly(calculation.monthlyPayment)}
                            </div>
                            <div className="text-sm text-gray-600">
                                Total monthly payment including taxes and insurance
                            </div>
                            </div>
                        ) : (
                            <div className="text-gray-500">Enter property details to calculate</div>
                        )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                            <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                            Loan Amount
                        </CardTitle>
                        </CardHeader>
                        <CardContent>
                        {calculation ? (
                            <div>
                            <div className="text-3xl font-bold text-green-600 mb-2" data-testid="result-loan-amount">
                                {formatCurrency(calculation.loanAmount)}
                            </div>
                            <div className="text-sm text-gray-600">
                                Amount financed after down payment
                            </div>
                            </div>
                        ) : (
                            <div className="text-gray-500">Enter property details to calculate</div>
                        )}
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Breakdown */}
                {calculation && (
                <Card>
                    <CardHeader>
                    <CardTitle className="flex items-center">
                        <PieChart className="mr-2 h-5 w-5 text-accent" />
                        Payment Breakdown
                    </CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="payment-breakdown">
                        <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Principal & Interest:</span>
                            <span className="font-medium" data-testid="result-principal-interest">
                            {formatMonthly(calculation.principalAndInterest)}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Property Tax (est.):</span>
                            <span className="font-medium" data-testid="result-property-tax">
                            {formatMonthly(calculation.propertyTax)}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Insurance (est.):</span>
                            <span className="font-medium" data-testid="result-insurance">
                            {formatMonthly(calculation.insurance)}
                            </span>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex justify-between items-center font-semibold">
                            <span>Total Monthly Payment:</span>
                            <span className="text-lg text-blue-600" data-testid="result-total-monthly">
                            {formatMonthly(calculation.monthlyPayment)}
                            </span>
                        </div>
                        </div>

                        <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Down Payment:</span>
                            <span className="font-medium" data-testid="result-down-payment">
                            {formatCurrency(calculation.downPayment)}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Interest:</span>
                            <span className="font-medium" data-testid="result-total-interest">
                            {formatCurrency(calculation.totalInterest)}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Cost:</span>
                            <span className="font-medium" data-testid="result-total-cost">
                            {formatCurrency(calculation.totalCost)}
                            </span>
                        </div>
                        
                        <Separator />
                        
                        {calculation.monthlyIncome && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Affordability:</span>
                                <span 
                                className={`text-sm font-medium ${
                                    calculation.isAffordable ? 'text-green-600' : 'text-red-600'
                                }`}
                                data-testid="result-affordability"
                                >
                                {calculation.isAffordable ? '✓ Affordable' : '⚠ May be too expensive'}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500" data-testid="result-debt-ratio">
                                {calculation.affordabilityRatio?.toFixed(1)}% of monthly income
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                Recommended: Keep below 35%
                            </div>
                            </div>
                        )}
                        </div>
                    </div>
                    </CardContent>
                </Card>
                )}
                {/* Tips & Information */}
                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-blue-500" />
                    Helpful Tips
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                        <h4 className="font-semibold mb-2 text-gray-900">Down Payment</h4>
                        <ul className="space-y-1 text-gray-600">
                        <li>• 20% down avoids PMI (Private Mortgage Insurance)</li>
                        <li>• Higher down payment = lower monthly payments</li>
                        <li>• Some loans allow as little as 3-5% down</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold mb-2 text-gray-900">Interest Rates</h4>
                        <ul className="space-y-1 text-gray-600">
                        <li>• Rates vary based on credit score</li>
                        <li>• Even 0.5% difference significantly impacts total cost</li>
                        <li>• Consider rate lock options when shopping</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold mb-2 text-gray-900">Affordability</h4>
                        <ul className="space-y-1 text-gray-600">
                        <li>• Keep housing costs below 35% of income</li>
                        <li>• Include taxes, insurance, and HOA fees</li>
                        <li>• Factor in maintenance and utility costs</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold mb-2 text-gray-900">Additional Costs</h4>
                        <ul className="space-y-1 text-gray-600">
                        <li>• Closing costs typically 2-5% of loan amount</li>
                        <li>• Property taxes vary by location</li>
                        <li>• Consider homeowner's insurance costs</li>
                        </ul>
                    </div>
                    </div>
                </CardContent>
                </Card>

                {/* Calculation History */}
                {calculationHistory.length > 0 && (
                <Card>
                    <CardHeader>
                    <CardTitle className="flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5 text-purple-500" />
                        Recent Calculations
                    </CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-3" data-testid="calculation-history">
                        {calculationHistory.map((calc, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                            <div className="font-medium">
                                {formatCurrency(calc.propertyPrice)} • {calc.downPaymentPercent}% down
                            </div>
                            <div className="text-sm text-gray-600">
                                {calc.interestRate}% APR • {calc.loanTermYears} years
                            </div>
                            </div>
                            <div className="text-right">
                            <div className="font-semibold text-blue-600">
                                {formatMonthly(calc.monthlyPayment)}
                            </div>
                            <div className="text-sm text-gray-600">
                                /month
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    </CardContent>
                </Card>
                )}
            </div>
        </div>
      </main>
      
    </div>
  );
}
