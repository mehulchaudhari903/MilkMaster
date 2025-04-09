import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaUsers } from 'react-icons/fa';

// CSS for hiding scrollbar while allowing scrolling
const scrollbarHideStyle = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex justify-between items-center py-4 text-left hover:text-blue-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-700 hover:text-blue-600">{question}</span>
        {isOpen ? <FaChevronUp className="h-5 w-5 text-blue-600" /> : <FaChevronDown className="h-5 w-5 text-blue-600" />}
      </button>
      {isOpen && (
        <div className="pb-4 pr-4">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
};

const ReturnPolicyPage = () => {
  const [activeCategory, setActiveCategory] = useState('Introduction');
  const [returnPolicy, setReturnPolicy] = useState({
    Introduction: [
      {
        introduction: 'At MilkMaster B2B, we take great pride in providing premium quality dairy products to our business customers. We understand that occasionally, issues may arise that require returns or replacements. This policy outlines our procedures for handling such situations.',
        lastUpdated: 'June 1, 2025'
      }
    ],
    'Product Quality & Inspection': [
      {
        introduction: 'We recommend that all B2B customers inspect deliveries immediately upon receipt. Check for: Proper temperature of refrigerated items Packaging integrity Product appearance and quality Correct quantities and items as per your order Expiration dates',
        lastUpdated: 'June 1, 2025'
      }
    ],
    'Return Eligibility': [
      {
        introduction: 'Products are eligible for return or replacement under the following conditions: Products received damaged or with compromised packaging Products that don\'t meet our quality standards Products that are inconsistent with what was ordered Products delivered with less than 70% of shelf life remaining Products that don\'t meet agreed-upon specifications for custom orders',
        lastUpdated: 'June 1, 2025'
      }
    ],
    'Return Process': [
      {
        introduction: 'To return a product, please contact our B2B customer service line at (555) 123-4567 or email returns@milkmasterb2b.com. We will provide you with a return authorization number and instructions on how to return the product.',
        lastUpdated: 'June 1, 2025'
      }
    ],
    'Non-Returnable Items': [
      {
        introduction: 'The following situations are generally not eligible for returns: Products reported after the 24-hour window Products that have been opened, partially used, or altered in any way Products improperly stored after delivery (e.g., left unrefrigerated) Products that have passed their expiration date due to customer handling Custom formulation products approved by the customer prior to production',  
        lastUpdated: 'June 1, 2025'
      }
    ],
    'Large Volume & Standing Orders': [
      {
        introduction: 'For customers with regular large volume orders, we offer: Custom return policies as part of your business contract Assigned account representatives for expedited claim processing Quality assurance programs with regular sampling and testing Flexible replacement options to minimize disruption to your business operations',
        lastUpdated: 'June 1, 2025'
      }
    ],
    'Contact Information': [
      {
        introduction: 'For all return-related inquiries, please contact: B2B Customer Service Phone: (91) 123-4567 Email: returns@milkmasterb2b.com Hours: Monday - Friday, 8:00 AM - 6:00 PM',  
        lastUpdated: 'June 1, 2025'
      }
    ]
  });

  const categories = Object.keys(returnPolicy);

  const benefits = [
    {
      icon: <FaUsers className="h-6 w-6 text-blue-500" />,
      text: 'Customer-Centric Approach',
      iconColor: 'text-blue-500'
    }
  ];
  
  return (
    <div className="min-h-screen bg-white">
      <style dangerouslySetInnerHTML={{ __html: scrollbarHideStyle }} />
      
 
      {/* FAQ Section */}
      <div id="return-policy-details" >
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <nav className="text-gray-500 text-sm">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">&gt;</span>
            <span>Return Policy</span>
          </nav>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Return Policy</h1>
              <p className="mt-2 text-lg text-gray-600">Detailed information about each section of our return policy</p>
              <div className="w-20 h-1 bg-blue-500 mt-4"></div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-8">
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 p-4 sm:p-6">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-3 group hover:bg-white rounded-lg p-3 transition-all duration-300"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                        <span className={`${benefit.iconColor}`}>{benefit.icon}</span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-700 font-medium leading-tight">
                        {benefit.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="mt-8 flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-1/4">
              <div className="space-y-2 flex md:block overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`whitespace-nowrap md:whitespace-normal text-left px-4 py-2 rounded-lg transition-colors mr-2 md:mr-0 md:w-full ${
                      activeCategory === category
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ List */}
            <div className="w-full md:w-3/4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{activeCategory}</h2>
              <div className="space-y-6">
                {returnPolicy[activeCategory]?.map((policy, index) => (
                  <div key={index} className="mb-8">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-5 rounded-md shadow-sm">
                      <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                        {policy.introduction.split('. ').map((sentence, i, arr) => (
                          <span key={i}>
                            {sentence}{i < arr.length - 1 ? '. ' : ''}
                            {sentence.includes(':') && i < arr.length - 1 && <br/>}
                          </span>
                        ))}
                      </p>
                      <p className="text-gray-600 italic">
                        <span className="font-semibold">Last Updated:</span> {policy.lastUpdated}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
            {/* Help Section */}
            <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Need Assistance?</h2>
            <p className="mt-4 text-lg text-gray-600">
              Our dedicated B2B support team is ready to help with any questions about our return policy.
            </p>
            <div className="mt-6">
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage; 