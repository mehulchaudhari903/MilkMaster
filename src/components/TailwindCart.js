import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function TailwindCart() {
  const { 
    cartItems, 
    cartOpen, 
    toggleCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal 
  } = useCart();
  const navigate = useNavigate();

  if (!cartOpen) return null;

  // Handle checkout
  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If not logged in, redirect to login page
      navigate('/login', { 
        state: { 
          from: '/checkout',
          message: 'Please login to proceed with checkout'
        }
      });
      return;
    }
    // If logged in, proceed to checkout
    navigate('/checkout');
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    toggleCart();
    navigate('/products');
  };

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
        onClick={toggleCart}
      ></div>
      
      {/* Cart Panel */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl flex flex-col">
        {/* Cart Header */}
        <div className="px-4 py-6 bg-primary-50 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-primary-900">Shopping Cart</h2>
            <button
              type="button"
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={toggleCart}
            >
              <span className="sr-only">Close panel</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            {cartItems.length === 0 
              ? 'Your cart is empty' 
              : `${cartItems.reduce((total, item) => total + item.quantity, 0)} items in your cart`
            }
          </p>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 py-6 px-4 sm:px-6 overflow-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start adding some products to your cart
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={toggleCart}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.id} className="py-6 flex">
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.name}</h3>
                        <p className="ml-4">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                      ₹{Number(item.price).toFixed(2)} per {item.unit || 'item'}
                      </p>
                    </div>
                    
                    <div className="flex-1 flex items-end justify-between text-sm">
                      {/* Quantity Selector */}
                      <div className="flex items-center border rounded-md">
                        <button 
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                          </svg>
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-gray-900">
                          {item.quantity}
                        </span>
                        <button 
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                        </button>
                      </div>
                      
                      {/* Remove Button */}
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
        
        {/* Cart Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
              <p>Subtotal</p>
              <p>${Number(getCartTotal()).toFixed(2)}</p>
            </div>
            <div className="mt-6">
              <button
                type="button"
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
            <div className="mt-3 flex justify-center text-sm text-center text-gray-500">
              <button
                type="button"
                className="font-medium text-primary-600 hover:text-primary-500"
                onClick={clearCart}
              >
                Clear Cart
              </button>
              <span className="mx-2">•</span>
              <button
                type="button"
                className="font-medium text-primary-600 hover:text-primary-500"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TailwindCart; 