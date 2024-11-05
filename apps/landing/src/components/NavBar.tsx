'use client'

import Link from 'next/link'
import Image from 'next/image'
import logo from '../../public/ABT_original.png'

export default function NavBar() {
  return (
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 grid grid-cols-3 items-center">
            {/* Left section - Logo */}
            <div className="flex items-center justify-start">
              <Link href="/" className="flex-shrink-0">
                <Image
                    src={logo}
                    alt="ABT Logo"
                    width={85}
                    height={85}
                    priority
                    className="object-contain"
                />
              </Link>
            </div>

            {/* Middle section - Navigation Links */}
            <div className="flex items-center justify-center space-x-8 whitespace-nowrap">
              <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                Главная
              </Link>
              <Link
                  href="/calculator"
                  className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                Калькулятор стоимости
              </Link>
              <Link
                  href="/about"
                  className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                О нас
              </Link>
            </div>

            <div className="flex items-center justify-end">
              <button className="bg-[#00358E] hover:bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors">
                <Link
                    href="http://localhost:3002/auth"
                    className="hover:text-sm font-medium transition-colors duration-200"
                >
                  Профиль
                </Link>
              </button>
            </div>
          </div>
        </div>
      </nav>
  )
}