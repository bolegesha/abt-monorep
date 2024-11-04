'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header/Navigation */}
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <div className="flex items-center space-x-4 lg:space-x-6">
          <Button variant="ghost" onClick={() => router.push('/')}>
            Home
          </Button>
          <Button variant="ghost" onClick={() => router.push('/about')}>
            About
          </Button>
          <Button variant="ghost" onClick={() => router.push('/services')}>
            Services
          </Button>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button onClick={() => router.push('/auth')}>
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Logistics Made Simple
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Calculate shipping costs instantly and manage your deliveries with ease.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button onClick={() => router.push('/auth')} size="lg">
                    Get Started
                  </Button>
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  alt="Hero"
                  className="aspect-video overflow-hidden rounded-xl object-cover"
                  height="400"
                  src="/hero-image.jpg"
                  width="600"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 mt-8">
              {/* Feature cards here */}
              {[
                {
                  title: "Instant Calculations",
                  description: "Get shipping costs calculated instantly with our advanced algorithm."
                },
                {
                  title: "Multiple Services",
                  description: "Choose from various shipping services and compare prices."
                },
                {
                  title: "Real-time Tracking",
                  description: "Track your shipments in real-time with detailed updates."
                }
              ].map((feature, index) => (
                <div key={index} className="group relative flex flex-col space-y-2">
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Logistics Calculator. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Button variant="link" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Button>
          <Button variant="link" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Button>
        </nav>
      </footer>
    </div>
  );
} 