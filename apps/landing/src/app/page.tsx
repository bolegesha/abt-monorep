'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold">
                ABT Calc
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link
                href="http://localhost:3002/profile"
                className={cn(
                  "inline-flex items-center justify-center",
                  "rounded-md px-4 py-2",
                  "bg-black text-white",
                  "text-sm font-medium",
                  "transition-colors",
                  "hover:bg-gray-800",
                  "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                )}
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Calculate Shipping Costs <br /> with Ease
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Get instant shipping rates for your packages. Compare prices, save time, and make informed decisions for your logistics needs.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="http://localhost:3002/profile"
                className={cn(
                  "rounded-md px-6 py-3",
                  "bg-black text-white",
                  "text-sm font-semibold",
                  "shadow-sm",
                  "hover:bg-gray-800",
                  "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                )}
              >
                Profile
              </Link>
              <Link
                href="#features"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Features content will go here */}
        </div>
      </section>
    </div>
  );
} 