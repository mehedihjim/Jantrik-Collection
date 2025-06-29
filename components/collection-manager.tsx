"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Download,
  Plus,
  Search,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";
import { exportToExcel } from "@/lib/excel-export";
import { cn, generateNumbers } from "@/lib/utils";

interface CollectionManagerProps {
  title: string;
  subtitle: string;
  numbers: Record<string, number>;
  onUpdate: (numbers: Record<string, number>) => void;
  type: "3up" | "down";
  minNumber: number;
  maxNumber: number;
  numberLength: number;
}

export function CollectionManager({
  title,
  subtitle,
  numbers,
  onUpdate,
  type,
  minNumber,
  maxNumber,
  numberLength,
}: CollectionManagerProps) {
  const router = useRouter();
  const [inputNumber, setInputNumber] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const numberValue = parseInt(inputNumber);
    const amountValue = parseFloat(inputAmount);

    // Validation
    if (
      isNaN(numberValue) ||
      numberValue < minNumber ||
      numberValue > maxNumber
    ) {
      toast.error(
        `Please enter a valid number between ${minNumber
          .toString()
          .padStart(numberLength, "0")} and ${maxNumber
          .toString()
          .padStart(numberLength, "0")}`
      );
      return;
    }

    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedNumber = numberValue
        .toString()
        .padStart(numberLength, "0");
      const updatedNumbers = {
        ...numbers,
        [formattedNumber]: (numbers[formattedNumber] || 0) + amountValue,
      };

      onUpdate(updatedNumbers);
      setInputNumber("");
      setInputAmount("");

      toast.success(
        `Successfully added ${amountValue} to number ${formattedNumber}`,
        {
          description: `New total: ${updatedNumbers[formattedNumber]}`,
        }
      );
    } catch (error) {
      toast.error("Failed to update number. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = async () => {
    if (isExporting) return;

    setIsExporting(true);

    try {
      // ✅ Always generate full range
      const allNumbers = generateNumbers(minNumber, maxNumber, numberLength);

      // ✅ Overwrite with actual entered numbers
      for (const key in numbers) {
        allNumbers[key] = numbers[key];
      }

      const data = Object.entries(allNumbers)
        .map(([number, amount]) => ({
          Number: number,
          Amount: amount,
        }))
        .sort((a, b) => a.Number.localeCompare(b.Number));

      if (data.length === 0) {
        toast.error("No data available to export");
        return;
      }

      await exportToExcel(
        data,
        `${type}-collection-${new Date().toISOString().split("T")[0]}`,
        minNumber,
        maxNumber,
        numberLength
      );

      toast.success(
        `Collection exported successfully! (${data.length} numbers exported)`
      );
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export collection. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = async () => {
    if (isResetting) return;

    setIsResetting(true);

    try {
      // Clear the localStorage for this collection
      localStorage.removeItem(`jantrik-${type}`);

      // Reset to initial empty state
      const initialNumbers = generateNumbers(
        minNumber,
        maxNumber,
        numberLength
      );
      onUpdate(initialNumbers);

      // Clear search and input fields
      setSearchTerm("");
      setInputNumber("");
      setInputAmount("");

      toast.success(`${title} has been reset successfully!`, {
        description:
          "All data has been cleared and the collection is now empty.",
      });
    } catch (error) {
      console.error("Reset error:", error);
      toast.error("Failed to reset collection. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  const filteredNumbers = Object.entries(numbers)
    .filter(([number, amount]) => {
      if (!searchTerm) return amount > 0;
      return number.includes(searchTerm) && amount > 0;
    })
    .sort(([a], [b]) => a.localeCompare(b));

  const totalAmount = Object.values(numbers).reduce(
    (sum, amount) => sum + amount,
    0
  );
  const activeNumbers = Object.values(numbers).filter(
    (amount) => amount > 0
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/")}
              className="hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {title}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Reset Button with Confirmation */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="gap-2"
                  disabled={isResetting || activeNumbers === 0}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Collection
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Reset Collection Confirmation
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>
                      Are you sure you want to reset the{" "}
                      <strong>{title}</strong>?
                    </p>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm">
                      <p className="font-medium text-red-800 dark:text-red-200 mb-1">
                        This action will:
                      </p>
                      <ul className="text-red-700 dark:text-red-300 space-y-1">
                        <li>
                          • Clear all {activeNumbers} numbers with amounts
                        </li>
                        <li>
                          • Remove total amount of{" "}
                          {totalAmount.toLocaleString()}
                        </li>
                        <li>• Delete all stored data permanently</li>
                      </ul>
                    </div>
                    <p className="text-sm font-medium">
                      This action cannot be undone. Consider exporting your data
                      first.
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReset}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    disabled={isResetting}
                  >
                    {isResetting ? "Resetting..." : "Yes, Reset Collection"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              onClick={handleExport}
              className="gap-2"
              disabled={isExporting}
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Exporting..." : "Export Excel"}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {activeNumbers}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Active Numbers
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalAmount.toLocaleString()}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Total Amount
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {maxNumber - minNumber + 1}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Available Numbers
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Amount
                </CardTitle>
                <CardDescription>
                  Enter a number and amount to add to the collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="number">Number ({subtitle})</Label>
                    <Input
                      id="number"
                      type="number"
                      value={inputNumber}
                      onChange={(e) => setInputNumber(e.target.value)}
                      placeholder={`Enter ${minNumber
                        .toString()
                        .padStart(numberLength, "0")}-${maxNumber
                        .toString()
                        .padStart(numberLength, "0")}`}
                      min={minNumber}
                      max={maxNumber}
                      required
                      className="text-center font-mono text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="0.01"
                      required
                      className="text-center text-lg"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Adding..." : "Add Amount"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Numbers List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Collection Numbers</CardTitle>
                    <CardDescription>
                      Numbers with amounts ({filteredNumbers.length} shown)
                    </CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search numbers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] w-full">
                  {filteredNumbers.length > 0 ? (
                    <div className="space-y-2">
                      {filteredNumbers.map(([number, amount], index) => (
                        <div key={number}>
                          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-12 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-center">
                                <span className="font-mono text-lg font-semibold">
                                  {number}
                                </span>
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">
                                Number
                              </div>
                            </div>
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-base px-3 py-1",
                                amount >= 1000 &&
                                  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                                amount >= 500 &&
                                  amount < 1000 &&
                                  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                                amount < 500 &&
                                  "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                              )}
                            >
                              {amount.toLocaleString()}
                            </Badge>
                          </div>
                          {index < filteredNumbers.length - 1 && (
                            <Separator className="my-1" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-slate-400 text-lg mb-2">
                        No numbers found
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {searchTerm
                          ? "Try adjusting your search term"
                          : "Start by adding amounts to numbers"}
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
