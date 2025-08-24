import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const bondRouter = createTRPCRouter({
  calculate: publicProcedure
    .input(
      z.object({
        propertyPrice: z.number().positive(),
        downPaymentPercent: z.number().min(0).max(100),
        interestRate: z.number().positive(),
        loanTermYears: z.number().min(1),
        monthlyIncome: z.number().optional(),
      })
    )
    .mutation(({ input }) => {
      const downPayment = input.propertyPrice * (input.downPaymentPercent / 100);
      const loanAmount = input.propertyPrice - downPayment;

      const monthlyRate = input.interestRate / 100 / 12;
      const n = input.loanTermYears * 12;

      const monthlyPI =
        (loanAmount * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -n));

      const propertyTax = loanAmount * 0.012 / 12; // ~1.2% annual
      const insurance = loanAmount * 0.005 / 12;   // ~0.5% annual
      const monthlyPayment = monthlyPI + propertyTax + insurance;

      const totalCost = monthlyPayment * n + downPayment;
      const totalInterest = totalCost - input.propertyPrice;

      const affordabilityRatio = input.monthlyIncome
        ? (monthlyPayment / input.monthlyIncome) * 100
        : undefined;

      return {
        propertyPrice: input.propertyPrice,
        downPayment,
        downPaymentPercent: input.downPaymentPercent,
        loanAmount,
        interestRate: input.interestRate,
        loanTermYears: input.loanTermYears,
        monthlyPayment,
        principalAndInterest: monthlyPI,
        propertyTax,
        insurance,
        totalInterest,
        totalCost,
        monthlyIncome: input.monthlyIncome,
        affordabilityRatio,
        isAffordable: affordabilityRatio ? affordabilityRatio <= 35 : undefined,
      };
    }),
});
