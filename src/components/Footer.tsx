"use client";

import { Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

export default function Footer() {
  return (
    <div><footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">PropertyHub</h3>
              <p className="text-gray-400 mb-4">
                Your trusted partner in finding the perfect property. We connect buyers, sellers, and renters with the best opportunities in the market.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white" data-testid="link-facebook">
                  <span className="sr-only">Facebook</span>
                  📘
                </a>
                <a href="#" className="text-gray-400 hover:text-white" data-testid="link-twitter">
                  <span className="sr-only">Twitter</span>
                  🐦
                </a>
                <a href="#" className="text-gray-400 hover:text-white" data-testid="link-instagram">
                  <span className="sr-only">Instagram</span>
                  📷
                </a>
                <a href="#" className="text-gray-400 hover:text-white" data-testid="link-linkedin">
                  <span className="sr-only">LinkedIn</span>
                  💼
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Properties</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/properties?listingType=sale" className="hover:text-white">Houses for Sale</Link></li>
                <li><Link href="/properties?listingType=rent" className="hover:text-white">Apartments for Rent</Link></li>
                <li><Link href="/properties?category=commercial" className="hover:text-white">Commercial Properties</Link></li>
                <li><Link href="/properties?category=specialty" className="hover:text-white">Luxury Homes</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/calculator" className="hover:text-white">Bond Calculator</Link></li>
                <li><a href="#" className="hover:text-white">Market Trends</a></li>
                <li><a href="#" className="hover:text-white">Neighborhood Guide</a></li>
                <li><a href="#" className="hover:text-white">Legal Forms</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  (555) 123-4567
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  info@propertyhub.com
                </li>
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  123 Real Estate Ave, City
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PropertyHub. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer></div>
  )
}
