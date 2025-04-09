const products = [
  {
    id: 1,
    name: "Premium Full Cream Milk",
    description: "High-quality full cream milk with 3.5% fat content, perfect for commercial cafes and restaurants. Available in bulk packaging.",
    price: 35.99,
    unit: "per 20L bag",
    minOrder: 5,
    imageUrl: "/images/full-cream-milk.jpg",
    category: "Milk",
    features: [
      "Pasteurized and homogenized",
      "High in calcium and protein",
      "Shelf life: 7 days refrigerated",
      "Available in 10L, 20L bags",
      "Sourced from grass-fed cows"
    ],
    stock: 500
  },
  {
    id: 2,
    name: "Skim Milk",
    description: "Low-fat milk option with less than 0.5% fat content. Ideal for health-conscious businesses and dietary applications.",
    price: 32.99,
    unit: "per 20L bag",
    minOrder: 5,
    imageUrl: "/images/skim-milk.jpg",
    category: "Milk",
    features: [
      "Ultra-pasteurized for longer shelf life",
      "Low in fat, high in protein",
      "Shelf life: 10 days refrigerated",
      "Available in 10L, 20L bags",
      "No additives or preservatives"
    ],
    stock: 350
  },
  {
    id: 3,
    name: "A2 Milk",
    description: "Premium A2 protein milk, easier to digest for many consumers. Great for specialized cafes and health food businesses.",
    price: 45.99,
    unit: "per 20L bag",
    minOrder: 3,
    imageUrl: "/images/a2-milk.jpg",
    category: "Milk",
    features: [
      "Contains only A2 protein",
      "Easier to digest",
      "Shelf life: 7 days refrigerated",
      "Available in 5L, 10L, 20L bags",
      "From specially bred A2 cows"
    ],
    stock: 200
  },
  {
    id: 4,
    name: "Bulk Mozzarella Cheese",
    description: "Fresh, stretchy mozzarella cheese perfect for pizzerias and Italian restaurants. Made from our premium milk.",
    price: 89.99,
    unit: "per 5kg block",
    minOrder: 2,
    imageUrl: "/images/mozzarella.jpg",
    category: "Cheese",
    features: [
      "High moisture content",
      "Excellent melting properties",
      "Shelf life: 21 days refrigerated",
      "Available in 1kg, 2.5kg, 5kg blocks",
      "Made from pasteurized milk"
    ],
    stock: 150
  },
  {
    id: 5,
    name: "Greek Yogurt",
    description: "Thick, creamy Greek yogurt with high protein content. Perfect for hotels, breakfast services, and health food businesses.",
    price: 59.99,
    unit: "per 10kg tub",
    minOrder: 2,
    imageUrl: "/images/greek-yogurt.jpg",
    category: "Yogurt",
    features: [
      "Strained for extra thickness",
      "High protein content",
      "Shelf life: 14 days refrigerated",
      "Available in 5kg, 10kg tubs",
      "No artificial sweeteners"
    ],
    stock: 120
  },
  {
    id: 6,
    name: "Whipping Cream",
    description: "Heavy whipping cream with 35% fat content, ideal for bakeries, patisseries, and restaurants.",
    price: 49.99,
    unit: "per 10L container",
    minOrder: 2,
    imageUrl: "/images/whipping-cream.jpg",
    category: "Cream",
    features: [
      "Whips easily to stiff peaks",
      "No stabilizers added",
      "Shelf life: 10 days refrigerated",
      "Available in 5L, 10L containers",
      "Heat stable for cooking"
    ],
    stock: 180
  },
  {
    id: 7,
    name: "Butter Blocks",
    description: "High-fat butter blocks made from cultured cream. Perfect for bakeries and food manufacturing.",
    price: 75.99,
    unit: "per 10kg block",
    minOrder: 1,
    imageUrl: "/images/butter.jpg",
    category: "Butter",
    features: [
      "82% fat content",
      "Rich flavor profile",
      "Shelf life: 30 days refrigerated",
      "Available in 1kg, 5kg, 10kg blocks",
      "Salted and unsalted options"
    ],
    stock: 90
  },
  {
    id: 8,
    name: "Fresh Paneer",
    description: "Soft, non-melting Indian cheese perfect for restaurants and food services offering Indian cuisine.",
    price: 69.99,
    unit: "per 5kg block",
    minOrder: 2,
    imageUrl: "/images/paneer.jpg",
    category: "Cheese",
    features: [
      "Firm texture, holds shape when cooked",
      "High protein content",
      "Shelf life: 7 days refrigerated",
      "Available in 1kg, 2.5kg, 5kg blocks",
      "Made with vegetarian rennet"
    ],
    stock: 100
  },
  {
    id: 9,
    name: "Buttermilk",
    description: "Tangy cultured buttermilk, ideal for bakeries for making biscuits, pancakes, and more.",
    price: 29.99,
    unit: "per 10L container",
    minOrder: 3,
    imageUrl: "/images/buttermilk.jpg",
    category: "Milk",
    features: [
      "Cultured for tangy flavor",
      "Perfect for baking applications",
      "Shelf life: 14 days refrigerated",
      "Available in 5L, 10L containers",
      "Contains active cultures"
    ],
    stock: 220
  },
  {
    id: 10,
    name: "Condensed Milk",
    description: "Sweetened condensed milk in bulk for bakeries, dessert shops, and coffee shops.",
    price: 79.99,
    unit: "per 10kg container",
    minOrder: 2,
    imageUrl: "/images/condensed-milk.jpg",
    category: "Milk",
    features: [
      "High sugar content for preservation",
      "Rich and creamy texture",
      "Shelf life: 6 months unopened",
      "Available in 5kg, 10kg containers",
      "Perfect for desserts and beverages"
    ],
    stock: 160
  }
];

export default products; 