import type { Product } from "../types/product";

export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Urban Laptop Pack",
    category: "Bags",
    price: 49.9,
    rating: 4.7,
    stock: 18,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    description:
      "A compact travel backpack with padded laptop storage, weather-resistant fabric, and fast-access side pockets.",
  },
  {
    id: 2,
    name: "Noise-Control Headphones",
    category: "Electronics",
    price: 89,
    rating: 4.8,
    stock: 11,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description:
      "Wireless over-ear headphones with soft cushions, strong battery life, and a focused work mode.",
  },
  {
    id: 3,
    name: "Minimal Desk Lamp",
    category: "Home",
    price: 34.5,
    rating: 4.5,
    stock: 24,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    description:
      "Adjustable LED desk lamp with warm and cool settings for late study sessions and home offices.",
  },
  {
    id: 4,
    name: "Everyday Sneaker",
    category: "Shoes",
    price: 74.99,
    rating: 4.4,
    stock: 9,
    image:
      "https://images.unsplash.com/photo-1650320079970-b4ee8f0dae33?auto=format&fit=crop&w=900&q=80",
    description:
      "Casual low-top sneakers with a bold red finish, cushioned insole, and durable sole for everyday wear.",
  },
  {
    id: 5,
    name: "Insulated Travel Flask",
    category: "Accessories",
    price: 21,
    rating: 4.6,
    stock: 30,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
    description:
      "Reusable insulated flask that keeps drinks hot or cold during long commutes.",
  },
  {
    id: 6,
    name: "Classic Field Watch",
    category: "Accessories",
    price: 112,
    rating: 4.9,
    stock: 6,
    image:
      "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=900&q=80",
    description:
      "A clean analog watch with a stainless case, readable dial, and comfortable leather strap.",
  },
];
