import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaUsers, FaRegCreditCard, FaChartLine, FaHeadset, FaShoppingBag, FaTruck, FaCubes, FaStar } from 'react-icons/fa';
import { MdPayment, MdBusinessCenter, MdLocalShipping, MdSupportAgent } from 'react-icons/md';
import { BiDollarCircle } from 'react-icons/bi';
import { Link } from 'react-router-dom';
const faqImagePath = '/assets/image/faq.jpg';

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

const FAQsPage = () => {
  const [activeCategory, setActiveCategory] = useState('General');

  const categories = [
    'General',
    'Orders & Delivery',
    'Products & Quality',
    'Business Accounts',
    'Pricing & Payments',
    'Returns & Support'
  ];

  const benefits = [
    { 
      icon: <FaUsers className="w-6 h-6" />, 
      text: 'Growing customer base',
      iconColor: 'text-blue-500'
    },
    { 
      icon: <MdPayment className="w-6 h-6" />, 
      text: 'Secure & timely payments',
      iconColor: 'text-blue-500'
    },
    { 
      icon: <BiDollarCircle className="w-6 h-6" />, 
      text: 'Cost-effective supply chain',
      iconColor: 'text-blue-500'
    },
    { 
      icon: <MdSupportAgent className="w-6 h-6" />, 
      text: 'Dedicated customer support',
      iconColor: 'text-blue-500'
    },
    { 
      icon: <FaShoppingBag className="w-6 h-6" />, 
      text: 'Special promotions & events',
      iconColor: 'text-blue-500'
    }
  ];

  const faqs = {
    'General': [
      {
        question: 'What is MilkMaster B2B?',
        answer: 'MilkMaster B2B is a dedicated platform for businesses to purchase premium dairy products directly from trusted suppliers. We serve restaurants, cafes, bakeries, hotels, catering services, and other food service businesses with high-quality dairy supplies delivered on schedule.'
      },
      {
        question: 'How do I start ordering from MilkMaster B2B?',
        answer: 'To start ordering, you need to create a business account on our platform. Simply click "Register" and select "Business Account." You\'ll need to provide your business details including your business name, address, and tax ID. Once approved, you can start placing orders immediately.'
      },
      {
        question: 'What areas do you service?',
        answer: 'We currently deliver to commercial addresses within a 100-mile radius of our distribution centers located in major metropolitan areas. For specific delivery area inquiries, please enter your postal code in our delivery checker or contact our customer service team.'
      },
      {
        question: 'What makes MilkMaster different from other dairy suppliers?',
        answer: 'MilkMaster partners directly with local farms to ensure the freshest products with complete traceability. We offer flexible delivery schedules, temperature-controlled logistics, and a dedicated account manager for each business. Our digital platform also makes ordering, tracking, and reordering incredibly simple.'
      },
      {
        question: 'Do you offer special pricing for regular orders?',
        answer: 'Yes, businesses with recurring orders can benefit from our loyalty pricing programs. We offer tiered pricing based on order volume and frequency. Contact our sales team to discuss custom pricing plans for your specific business needs.'
      },
      {
        question: 'Can I schedule recurring deliveries?',
        answer: 'Absolutely. Our recurring delivery system allows you to set up regular deliveries on a daily, weekly, or monthly basis. You can adjust quantities, add or remove products, or reschedule deliveries up to 24 hours before your scheduled delivery time.'
      },
      {
        question: 'How do I contact customer support?',
        answer: 'You can reach our dedicated B2B support team Monday through Friday from 7:00 AM to 7:00 PM by phone at (91) 123-4567, by email at support@milkmaster.com, or through the live chat feature on our website and mobile app.'
      }
    ],
    'Orders & Delivery': [
      {
        question: 'What is your delivery schedule?',
        answer: 'We deliver Monday through Friday, from 5:00 AM to 11:00 AM. For B2B customers, we offer flexible delivery windows that can be tailored to your business hours.'
      },
      {
        question: 'Is there a minimum order requirement?',
        answer: 'Yes, there is a minimum order value of $50 for delivery. Orders below this amount may incur an additional delivery fee or can be picked up from our distribution center.'
      },
      // Add more FAQs as needed
    ],
    'Products & Quality': [
      {
        question: 'How fresh are your dairy products?',
        answer: 'Our dairy products are sourced directly from local farms and processed within 24 hours of collection. Most products arrive at your business within 2-3 days of processing, ensuring maximum freshness.'
      },
      {
        question: 'Do you offer organic options?',
        answer: 'Yes, we have a full line of certified organic dairy products sourced from farms that follow organic farming practices and are certified by relevant authorities.'
      },
      // Add more FAQs as needed
    ],
    'Business Accounts': [
      {
        question: 'How do I set up a business account?',
        answer: 'You can register for a business account on our website by clicking "Register" and selecting "Business Account." You\'ll need to provide your business details including your business name, address, tax ID, and contact information. Our team will review and approve your account within 1-2 business days.'
      },
      {
        question: 'What are the benefits of a business account?',
        answer: 'Business accounts receive preferential pricing, access to bulk ordering, detailed invoicing for accounting purposes, the ability to set up multiple users for your organization, saved ordering templates, and a dedicated account manager to assist with your specific needs.'
      },
      {
        question: 'Can I have multiple users on my business account?',
        answer: 'Yes, you can add multiple users to your business account with different permission levels. Primary account holders can designate administrators, order placers, and view-only users to help manage your dairy supply chain effectively across your organization.'
      },
      {
        question: 'Is there a membership fee for business accounts?',
        answer: 'No, creating and maintaining a business account is completely free. We offer premium tiers with additional benefits for businesses with higher volume needs, but our standard business account has no recurring fees.'
      },
      {
        question: 'Can I track my order history and spending?',
        answer: 'Yes, your business account dashboard provides comprehensive reporting including order history, spending patterns, product usage analytics, and downloadable reports for accounting purposes. You can filter reports by date range, products, or users.'
      },
      {
        question: 'How do I update my business information?',
        answer: 'You can update your business information at any time by logging into your account, navigating to "Account Settings," and selecting "Business Information." Changes to critical information like business address or tax ID may require verification.'
      }
    ],
    'Pricing & Payments': [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept major credit cards (Visa, MasterCard, American Express), ACH bank transfers, and business checks. For qualified businesses, we also offer net-30 payment terms after a credit approval process.'
      },
      {
        question: 'How does your volume pricing work?',
        answer: 'Our volume pricing is tiered based on order quantity and frequency. Discounts automatically apply in your cart when you reach certain thresholds. Regular customers can qualify for custom pricing plans with even better rates based on committed purchase volumes.'
      },
      {
        question: 'Can I get a custom quote for my business?',
        answer: 'Yes, businesses with specialized needs or high-volume requirements can request a custom quote. Contact our business sales team at sales@milkmaster.com or (555) 456-7890 to discuss your specific requirements and receive a tailored pricing plan.'
      },
      {
        question: 'Do you offer credit terms for businesses?',
        answer: 'Yes, established businesses may apply for credit terms (typically net-30) after three months of regular orders. Credit applications require business references and are subject to approval by our finance department. Contact your account manager to begin the process.'
      },
      {
        question: 'How and when am I billed for orders?',
        answer: 'For credit card payments, you\'re billed at the time of order confirmation. For businesses with approved credit terms, invoices are generated upon delivery completion and payment is due according to your established terms (typically net-30).'
      },
      {
        question: 'Are there any additional fees I should be aware of?',
        answer: 'We maintain transparent pricing with no hidden fees. Potential additional charges include: delivery fees for orders below minimum threshold ($50), rush delivery fees for expedited service, special handling fees for custom requests, and returned check fees if applicable.'
      }
    ],
    'Returns & Support': [
      {
        question: 'What is your return policy?',
        answer: 'Due to the perishable nature of dairy products, we have a strict quality assurance policy rather than traditional returns. If you receive any products that don\'t meet our quality standards, we offer immediate replacements or credits if reported within 24 hours of delivery.'
      },
      {
        question: 'How do I report a quality issue with my order?',
        answer: 'To report a quality issue, contact our support team within 24 hours of delivery by phone, email, or through your account portal under "Order Issues." Please provide your order number, the specific products affected, and photos if possible. Our team will address your concern immediately.'
      },
      {
        question: 'What if my delivery is late or missing items?',
        answer: 'For late deliveries or missing items, contact our logistics team as soon as possible. We will track your order in real-time and provide updates. For missing items, we\'ll arrange immediate redelivery or issue credit to your account based on your preference.'
      },
      {
        question: 'Do you provide technical support for the ordering platform?',
        answer: 'Yes, our technical support team is available Monday through Friday from 8:00 AM to 8:00 PM to assist with any platform-related issues. Contact them at techsupport@milkmaster.com or call (555) 789-0123 for immediate assistance.'
      },
      {
        question: 'How can I provide feedback or suggestions?',
        answer: 'We value your feedback! You can provide suggestions through the feedback form in your account dashboard, by emailing feedback@milkmaster.com, or during your regular check-ins with your account manager. We regularly implement customer suggestions to improve our service.'
      },
      {
        question: 'What if I need to cancel an order?',
        answer: 'Orders can be modified or canceled up to 12 hours before the scheduled delivery time through your account dashboard. For urgent cancellations within the 12-hour window, please contact our customer service team directly by phone for assistance.'
      },
      {
        question: 'Is there a dedicated account manager I can speak with?',
        answer: 'Yes, all business accounts are assigned a dedicated account manager who serves as your primary point of contact. They can assist with product recommendations, order management, account optimization, and resolving any concerns. You can find your account manager\'s contact information in your account dashboard.'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <style dangerouslySetInnerHTML={{ __html: scrollbarHideStyle }} />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <nav className="text-gray-500 text-sm">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">&gt;</span>
          <span>FAQs</span>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
            <p className="mt-2 text-lg text-gray-600">Find answers to common questions about MilkMaster B2B</p>
          </div>
          <div className="w-full md:w-1/3 lg:w-1/4">
            <img
              src={faqImagePath}
              alt="FAQ Support"
              className="rounded-lg w-full h-auto "
            />
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
            <div className="space-y-2">
              {faqs[activeCategory]?.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;