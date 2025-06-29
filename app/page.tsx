"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BadgeDollarSign,
  Calculator,
  NotebookText,
  TrendingDown,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="logo-font font-bold text-2xl flex items-center gap-2 select-none tracking-wide">
              <NotebookText className="text-blue-400 w-8 h-8" />
              {`Imraan's Collection`}
            </h1>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex flex-col items-center gap-4 pt-6 pb-8">
          <h2 className="text-6xl font-medium">Jantrik Collection</h2>
          <p className="max-w-xl text-center text-lg opacity-70">
            An easy-to-use platform for organizing your number bids. Add
            numbers, track amounts, and export your collection data for
            hassle-free record-keeping.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <Calculator className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-semibold">
                3up Collection
              </CardTitle>
              <CardDescription className="text-base">
                Manage numbers from 000 to 999 with comprehensive tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  1,000
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Numbers Available
                </div>
              </div>
              <Button
                onClick={() => router.push("/3up")}
                size="lg"
                className="w-full font-medium"
              >
                Access 3up Collection
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <TrendingDown className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-semibold">
                Down Collection
              </CardTitle>
              <CardDescription className="text-base">
                Manage numbers from 00 to 99 with streamlined interface
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  100
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Numbers Available
                </div>
              </div>
              <Button
                onClick={() => router.push("/down")}
                size="lg"
                className="w-full font-medium"
                variant="outline"
              >
                Access Down Collection
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm text-slate-600 dark:text-slate-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            System ready for Jantrik collection
          </div>
        </div>
      </div>
    </div>
  );
}
