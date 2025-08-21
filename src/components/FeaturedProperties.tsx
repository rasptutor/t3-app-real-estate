"use client";

import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';

export default function FeaturedProperties() {
  return (
    <div><section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-featured-title">
              Featured Properties
            </h2>
            <p className="text-lg text-gray-600">Discover our hand-picked selection of premium properties</p>
          </div>       
          
        </div>
      </section></div>
  )
}
