import React from 'react';
import TailwindHero from '../components/TailwindHero';
import TailwindProductCard from '../components/TailwindProductCard';
import TailwindNavbar from '../components/TailwindNavbar';
import TailwindFooter from '../components/TailwindFooter';
import TailwindCart from '../components/TailwindCart';
import { CartProvider } from '../context/CartContext';
import products from '../data/products';

function TailwindShowcasePage() {
  // Showing first 4 products
  const featuredProducts = products.slice(0, 4);

  return (
    <CartProvider>
      <div className="bg-white">
        {/* Tailwind Navbar */}
        <TailwindNavbar />
        
        {/* Cart Component */}
        <TailwindCart />
        
        {/* Hero Section with Tailwind */}
        <TailwindHero />
        
        {/* Featured Products Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">
                Our most popular dairy products for business customers
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {featuredProducts.map(product => (
                <div key={product.id}>
                  <TailwindProductCard product={product} />
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <button className="btn-outline">
                View All Products
              </button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="section-title">Why Choose Us</h2>
              <p className="section-subtitle">
                We provide the best service for our B2B customers
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Feature 1 */}
              <div className="text-center">
                <div className="mx-auto inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
                  <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
                <p className="text-gray-600">All products sourced from our own farms and trusted partners. Rigorous quality control at every step.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="text-center">
                <div className="mx-auto inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
                  <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Next-day delivery for all orders placed before 2 PM. Temperature-controlled vehicles to ensure product freshness.</p>
              </div>
              
              {/* Feature 3 */}
              <div className="text-center">
                <div className="mx-auto inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
                  <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Dedicated Support</h3>
                <p className="text-gray-600">Personal account manager for all B2B clients. 24/7 customer service for urgent requirements.</p>
              </div>
              
              {/* Feature 4 */}
              <div className="text-center">
                <div className="mx-auto inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
                  <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Wholesale Pricing</h3>
                <p className="text-gray-600">Competitive bulk pricing and volume discounts. Flexible payment terms for regular clients.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="bg-primary-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="lg:w-0 lg:flex-1">
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Ready to Order?
                </h2>
                <p className="mt-3 max-w-3xl text-lg opacity-90">
                  Contact our sales team for personalized quotes and business accounts.
                </p>
              </div>
              <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                <div className="inline-flex rounded-md shadow">
                  <a href="/contact" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50">
                    Contact Sales
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Tailwind CSS Responsive Features Demo */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="section-title">Responsive Design with Tailwind CSS</h2>
              <p className="section-subtitle">
                This page demonstrates responsive design using Tailwind CSS utilities
              </p>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Key Responsive Features:</h3>
              
              <ul className="space-y-2 ml-5 list-disc">
                <li className="text-gray-700">
                  <span className="font-medium">Responsive Grid Layout:</span> Using <code className="bg-gray-200 px-1 rounded">grid-cols-1 sm:grid-cols-2 lg:grid-cols-4</code> for different column counts
                </li>
                <li className="text-gray-700">
                  <span className="font-medium">Conditional Display:</span> Using <code className="bg-gray-200 px-1 rounded">hidden sm:flex</code> to hide/show elements
                </li>
                <li className="text-gray-700">
                  <span className="font-medium">Responsive Text:</span> Using <code className="bg-gray-200 px-1 rounded">text-base sm:text-lg lg:text-xl</code> for font sizes
                </li>
                <li className="text-gray-700">
                  <span className="font-medium">Responsive Spacing:</span> Using <code className="bg-gray-200 px-1 rounded">p-4 sm:p-6 lg:p-8</code> for varying padding
                </li>
                <li className="text-gray-700">
                  <span className="font-medium">Mobile Menu Toggle:</span> Using state to control visibility of the mobile menu
                </li>
              </ul>
              
              <div className="mt-6 p-4 bg-white rounded shadow-sm">
                <p className="text-sm font-medium text-gray-500 mb-2">Try Resizing Your Browser:</p>
                <div className="flex flex-wrap gap-2">
                  <div className="hidden sm:block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                    This is visible on SM screens and larger
                  </div>
                  <div className="block sm:hidden bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                    This is visible only on XS screens
                  </div>
                  <div className="hidden md:block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                    This is visible on MD screens and larger
                  </div>
                  <div className="hidden lg:block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                    This is visible on LG screens and larger
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Tailwind Footer */}
        <TailwindFooter />
      </div>
    </CartProvider>
  );
}

export default TailwindShowcasePage; 