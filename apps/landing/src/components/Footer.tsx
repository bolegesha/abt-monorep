'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AppleStyleFooter() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the comment to your backend
    console.log('Comment submitted:', { name, phone, comment });
    setName('');
    setPhone('');
    setComment('');
  };

  return (
    <footer className="bg-[#f5f5f7] text-[#1d1d1f] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <p className="text-sm">Панфилова 14</p>
            <p className="text-sm">г. Алматы</p>
            <p className="text-sm">Республика Казахстан</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm hover:underline">Главная</Link></li>
              <li><Link href="/calculator" className="text-sm hover:underline">Калькулятор доставки</Link></li>
              <li><Link href="/about" className="text-sm hover:underline">О нас</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Leave a Comment</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                required
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your Phone Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                required
              />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Your comment"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0071e3] resize-none"
                rows={3}
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-[#00358E] text-white rounded-md hover:bg-[#0077ed] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-opacity-50"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} TOO "ABT & E-trans". All rights reserved.
        </div>
      </div>
    </footer>
  );
}