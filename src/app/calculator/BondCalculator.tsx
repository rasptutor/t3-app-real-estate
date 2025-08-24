"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Download, Calculator, RotateCcw, Info } from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Utility: format as ZAR (or change to your locale/currency)
const fmtZAR = (n: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(
    isFinite(n) ? n : 0
  );

const fmtNum = (n: number) => new Intl.NumberFormat("en-ZA").format(isFinite(n) ? n : 0);

// Core loan math
function monthlyRepayment(principal: number, annualRatePct: number, months: number): number {
  const r = annualRatePct / 100 / 12;
  if (months <= 0) return 0;
  if (r === 0) return principal / months;
  const pow = Math.pow(1 + r, months);
  return (principal * r * pow) / (pow - 1);
}

type AmortRow = {
  month: number;
  interest: number;
  principal: number;
  payment: number;
  balance: number;
};

function buildSchedule({
  principal,
  annualRatePct,
  termMonths,
  extraMonthly = 0,
}: {
  principal: number;
  annualRatePct: number;
  termMonths: number;
  extraMonthly?: number;
}): { schedule: AmortRow[]; totalInterest: number; totalPaid: number; payoffMonth: number } {
  const r = annualRatePct / 100 / 12;
  let balance = principal;
  const basePayment = monthlyRepayment(principal, annualRatePct, termMonths);
  const schedule: AmortRow[] = [];
  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;

  while (balance > 0 && month < termMonths + 600) {
    month += 1;
    const interest = r * balance;
    let payment = Math.min(basePayment + extraMonthly, balance + interest);
    const principalPaid = Math.max(payment - interest, 0);
    balance = Math.max(balance - principalPaid, 0);
    totalInterest += interest;
    totalPaid += payment;
    schedule.push({ month, interest, principal: principalPaid, payment, balance });
    if (balance <= 0) break;
  }

  return { schedule, totalInterest, totalPaid, payoffMonth: month };
}

function csvFromSchedule(rows: AmortRow[]): string {
  const header = ["Month", "Payment", "Interest", "Principal", "Balance"].join(",");
  const body = rows
    .map((r) => [r.month, r.payment.toFixed(2), r.interest.toFixed(2), r.principal.toFixed(2), r.balance.toFixed(2)].join(","))
    .join("\n");
  return `${header}\n${body}`;
}

export default function BondCalculatorPage() {
  // Defaults roughly aligned with SA bond context
  const [propertyPrice, setPropertyPrice] = useState(1_800_000);
  const [deposit, setDeposit] = useState(180_000);
  const [interestPct, setInterestPct] = useState(11.75);
  const [termYears, setTermYears] = useState(20);
  const [extraMonthly, setExtraMonthly] = useState(0);
  const [showFull, setShowFull] = useState(false);

  const principal = Math.max(propertyPrice - deposit, 0);
  const termMonths = Math.max(termYears * 12, 1);

  const basePayment = useMemo(() => monthlyRepayment(principal, interestPct, termMonths), [principal, interestPct, termMonths]);

  const { schedule: baseSchedule } = useMemo(
    () => buildSchedule({ principal, annualRatePct: interestPct, termMonths, extraMonthly: 0 }),
    [principal, interestPct, termMonths]
  );

  const { schedule, totalInterest, totalPaid, payoffMonth } = useMemo(
    () => buildSchedule({ principal, annualRatePct: interestPct, termMonths, extraMonthly }),
    [principal, interestPct, termMonths, extraMonthly]
  );

  const monthsSaved = Math.max(0, termMonths - payoffMonth);
  const interestSaved =
    baseSchedule.reduce((a, r) => a + r.interest, 0) - schedule.reduce((a, r) => a + r.interest, 0);

  const chartData = useMemo(() => {
    const maxPoints = 180; // thin out for performance
    const step = Math.max(1, Math.floor(schedule.length / maxPoints));
    return schedule.filter((_, idx) => idx % step === 0).map((r) => ({ month: r.month, balance: Math.round(r.balance), interest: Math.round(r.interest) }));
  }, [schedule]);

  const reset = () => {
    setPropertyPrice(1_800_000);
    setDeposit(180_000);
    setInterestPct(11.75);
    setTermYears(20);
    setExtraMonthly(0);
    setShowFull(false);
  };

  const downloadCSV = () => {
    const blob = new Blob([csvFromSchedule(schedule)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bond-amortization.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <motion.h1 initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
        Bond Calculator
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inputs */}
        <Card className="lg:col-span-1 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" /> Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Property Price</Label>
              <Input
                inputMode="numeric"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value.replace(/[^0-9.]/g, "")) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Deposit</Label>
              <Input inputMode="numeric" value={deposit} onChange={(e) => setDeposit(Number(e.target.value.replace(/[^0-9.]/g, "")) || 0)} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Interest Rate (annual %)</Label>
                <span className="text-sm text-muted-foreground">{interestPct.toFixed(2)}%</span>
              </div>
              <Slider
                value={[interestPct]}
                onValueChange={([v]) => setInterestPct(Number((v ?? 0).toFixed(2)))}
                min={0}
                max={25}
                step={0.05}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Term (years)</Label>
                <span className="text-sm text-muted-foreground">{termYears}</span>
              </div>
              <Slider value={[termYears]} onValueChange={([v]) => setTermYears(v ?? termYears)} min={5} max={30} step={1} />
            </div>
            <div className="space-y-2">
              <Label>Extra Monthly Payment (optional)</Label>
              <Input inputMode="numeric" value={extraMonthly} onChange={(e) => setExtraMonthly(Number(e.target.value.replace(/[^0-9.]/g, "")) || 0)} />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={reset} className="gap-2">
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
              <Button type="button" onClick={downloadCSV} className="gap-2">
                <Download className="h-4 w-4" /> Export CSV
              </Button>
            </div>

            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4 mt-0.5" />
              <p>
                This tool estimates repayments using a standard amortization formula. Actual bank offers may differ due to fees, insurance, and rate type (fixed vs variable).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Summary & Chart */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryTile label="Loan Amount" value={fmtZAR(principal)} />
                <SummaryTile label="Base Monthly" value={fmtZAR(basePayment)} />
                <SummaryTile label="Total Paid" value={fmtZAR(totalPaid)} />
                <SummaryTile label="Total Interest" value={fmtZAR(totalInterest)} />
                <SummaryTile label="Payoff (months)" value={fmtNum(schedule.length)} />
                <SummaryTile label="Months Saved" value={fmtNum(monthsSaved)} />
                <SummaryTile label="Interest Saved" value={fmtZAR(interestSaved)} />
                <SummaryTile label="With Extra (m)" value={fmtZAR(extraMonthly)} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Balance & Interest Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <XAxis dataKey="month" tickFormatter={(v) => `${v}`} />
                    <YAxis tickFormatter={(v) => fmtZAR(v).replace("ZAR", "R")} width={90} />
                    <Tooltip formatter={(value: number, name) => [fmtZAR(value), name]} labelFormatter={(l) => `Month ${l}`} />
                    <Legend />
                    <Line type="monotone" dataKey="balance" dot={false} strokeWidth={2} name="Balance" />
                    <Line type="monotone" dataKey="interest" dot={false} strokeWidth={2} name="Interest (month)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Amortization Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{showFull ? "Showing full schedule" : "Showing first 12 months"}</span>
                <div className="flex items-center gap-2 text-sm">
                  <Switch id="toggle-full" checked={showFull} onCheckedChange={setShowFull} />
                  <Label htmlFor="toggle-full">Show full table</Label>
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2">Month</th>
                      <th className="py-2">Payment</th>
                      <th className="py-2">Interest</th>
                      <th className="py-2">Principal</th>
                      <th className="py-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showFull ? schedule : schedule.slice(0, 12)).map((r) => (
                      <tr key={r.month} className="border-b/50">
                        <td className="py-1">{r.month}</td>
                        <td className="py-1">{fmtZAR(r.payment)}</td>
                        <td className="py-1">{fmtZAR(r.interest)}</td>
                        <td className="py-1">{fmtZAR(r.principal)}</td>
                        <td className="py-1">{fmtZAR(r.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="how-it-works">
            <TabsList>
              <TabsTrigger value="how-it-works">How it works</TabsTrigger>
              <TabsTrigger value="tips">Tips</TabsTrigger>
            </TabsList>
            <TabsContent value="how-it-works">
              <Card className="rounded-2xl">
                <CardContent className="pt-6 text-sm text-muted-foreground space-y-2">
                  <p>
                    Monthly repayment is computed with the standard formula: <em>P · r · (1+r)^n / ((1+r)^n − 1)</em>, where <em>P</em> is loan
                    amount, <em>r</em> is monthly rate, and <em>n</em> is number of months.
                  </p>
                  <p>
                    Extra monthly payments reduce the outstanding balance faster, saving on interest and shortening the payoff time.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tips">
              <Card className="rounded-2xl">
                <CardContent className="pt-6 text-sm text-muted-foreground space-y-2">
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Compare offers from multiple banks and consider rate type (fixed vs variable).</li>
                    <li>Factor in fees (initiation, monthly admin, life/home insurance) when budgeting.</li>
                    <li>Even small extra payments can cut years off the bond.</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="p-4 bg-muted/40 rounded-2xl">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </motion.div>
  );
}
