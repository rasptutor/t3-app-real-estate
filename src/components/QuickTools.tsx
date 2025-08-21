"use client";

import React from 'react'
import { Card, CardContent } from './ui/card';
import { Calculator, FileText, MapPin, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export default function QuickTools() {
  return (
    <div><section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-tools-title">
              Quick Tools & Resources
            </h2>
            <p className="text-lg text-gray-600">Everything you need for your property journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="tools-grid">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calculator className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bond Calculator</h3>
                <p className="text-gray-600 text-sm mb-4">Calculate monthly payments and affordability</p>
                <Link href="/calculator">
                  <Button className="btn-primary" data-testid="button-calculator">
                    Calculate Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-secondary h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Neighborhood Guide</h3>
                <p className="text-gray-600 text-sm mb-4">Explore areas, schools, and amenities</p>
                <Button className="btn-secondary" data-testid="button-neighborhood">
                  Explore Areas
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-accent h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal Documents</h3>
                <p className="text-gray-600 text-sm mb-4">Download contracts and legal forms</p>
                <Button className="btn-accent" data-testid="button-documents">
                  Download Forms
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-600/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-purple-600 h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Trends</h3>
                <p className="text-gray-600 text-sm mb-4">View current market data and trends</p>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white" data-testid="button-trends">
                  View Trends
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section></div>
  )
}
