import React from 'react';
import { useCart } from '../context/CartContext';

function Cart() {
  const { 
    cartItems, 
    isCartOpen, 
    toggleCart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    clearCart 
  } = useCart();
  
  if (!isCartOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
        onClick={toggleCart}
      />
      
      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl flex flex-col">
        {/* Cart header */}
        <div className="px-4 py-6 bg-gray-50 border-b border-gray-200 sm:px-6">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Your Cart
            </h2>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={toggleCart}
            >
              <span className="sr-only">Close panel</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Cart items */}
        <div className="flex-1 py-6 px-4 sm:px-6 overflow-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-10">
              <svg 
                className="mx-auto h-12 w-12 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start adding some products to your cart!
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={toggleCart}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.id} className="py-4 flex">
                  {/* Product image */}
                  <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-center object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                        No image
                      </div>
                    )}
                  </div>
                  
                  {/* Product details */}
                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.name}</h3>
                        <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        ${item.price.toFixed(2)} {item.unit}
                      </p>
                    </div>
                    
                    <div className="flex-1 flex items-end justify-between text-sm">
                      {/* Quantity selector */}
                      <div className="flex items-center">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-gray-500 focus:outline-none focus:text-gray-600 p-1"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="mx-2 text-gray-700">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-500 focus:outline-none focus:text-gray-600 p-1"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Remove button */}
                      <div className="flex">
                        <button
                          type="button"
                          className="font-medium text-primary-600 hover:text-primary-500"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Cart footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>${getCartTotal().toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-6">
              <a
                href="#"
                className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Checkout
              </a>
            </div>
            <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
              <p>
                or{' '}
                <button
                  type="button"
                  className="text-primary-600 font-medium hover:text-primary-500"
                  onClick={toggleCart}
                >
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </button>
              </p>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                className="text-sm text-primary-600 hover:text-primary-500"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart; 