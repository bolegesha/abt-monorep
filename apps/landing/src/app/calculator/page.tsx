"use client";

import React from "react";
import dynamic from 'next/dynamic';
import { ErrorBoundary } from "@/components/ErrorBoundary";

const UnifiedTransportCalculator = dynamic(
  () => import("@/components/Calculator").catch(err => {
    console.error('Failed to load calculator:', err);
    return () => (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-xl text-red-600">
            Failed to load calculator. Please try again later.
          </h2>
        </div>
      </div>
    );
  }),
  // { 
  //   ssr: false,
  //   loading: () => (
  //     <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
  //       <div className="bg-white p-8 rounded-xl shadow-lg">
  //         <h2 className="text-xl text-gray-600">
  //           Loading calculator...
  //         </h2>
  //       </div>
  //     </div>
  //   )
  // }
);

export default function StandardCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="container mx-auto px-4 py-8">
        <ErrorBoundary>
          <UnifiedTransportCalculator calculatorType="standard" />
        </ErrorBoundary>
      </div>
    </div>
  );
}