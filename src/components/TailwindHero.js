import React from 'react';
import { useNavigate } from 'react-router-dom';

function TailwindHero() {
  const navigate = useNavigate();
  
  return (
    <div className="relative bg-gray-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="hidden lg:block lg:absolute lg:inset-0">
        <svg className="absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/4" width="404" height="784" fill="none" viewBox="0 0 404 784">
          <defs>
            <pattern id="pattern-squares" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="4" className="text-primary-200" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="404" height="784" fill="url(#pattern-squares)" />
        </svg>
        <svg className="absolute left-0 bottom-0 transform -translate-x-1/2 translate-y-1/4" width="404" height="784" fill="none" viewBox="0 0 404 784">
          <defs>
            <pattern id="pattern-squares-2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="4" className="text-secondary-200" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="404" height="784" fill="url(#pattern-squares-2)" />
        </svg>
      </div>

      <div className="relative pt-6 pb-16 sm:pb-24 lg:pb-32">
        {/* Hero content */}
        <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 lg:mt-32">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
              <div>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-secondary-100 text-secondary-800 mb-4">
                  Premium Dairy Products
                </span>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Quality Dairy Products</span>
                  <span className="block text-primary-500">for Your Business</span>
                </h1>
                <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  We supply cafes, restaurants, bakeries, and food manufacturers with the highest quality milk and dairy products at wholesale prices.
                </p>
                <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
                  <div className="grid gap-3 sm:grid-flow-col sm:auto-cols-fr sm:grid-cols-2">
                    <button
                      onClick={() => navigate('/products')}
                      className="btn-primary inline-flex items-center justify-center px-6 py-3"
                    >
                      Explore Products
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => navigate('/contact')}
                      className="btn-outline inline-flex items-center justify-center px-6 py-3"
                    >
                      Contact Sales
                    </button>
                  </div>
                </div>
                
                <div className="mt-10 grid grid-cols-3 gap-8">
                  <div>
                    <p className="text-3xl font-bold text-primary-500">100+</p>
                    <p className="text-sm text-gray-600">Products</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary-500">500+</p>
                    <p className="text-sm text-gray-600">B2B Clients</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary-500">24/7</p>
                    <p className="text-sm text-gray-600">Support</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <img 
                    className="w-full"
                    src="https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1000&auto=format&fit=crop" 
                    alt="Dairy products"
                  />
                  <div className="absolute inset-0 bg-primary-500 mix-blend-multiply opacity-10"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TailwindHero; 