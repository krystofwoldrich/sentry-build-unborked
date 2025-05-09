import { Product } from '../types/product';

export const products: Product[] = [
  {
    id: '1',
    name: 'Null Pointer Shield',
    description: 'Say goodbye to those pesky null pointer exceptions. This shield wraps your code in a protective layer that safely handles null values.',
    price: 29.99,
    category: 'runtime',
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.7,
    reviews: 128,
    compatibleWith: ['Java', 'C#', 'C++']
  },
  {
    id: '2',
    name: 'Syntax Error Autocorrect',
    description: 'Advanced AI that fixes your syntax errors in real-time, catching missing semicolons, unmatched brackets, and more.',
    price: 49.99,
    category: 'syntax',
    image: 'https://images.pexels.com/photos/207580/pexels-photo-207580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.9,
    reviews: 256,
    compatibleWith: ['JavaScript', 'Python', 'PHP']
  },
  {
    id: '3',
    name: 'Infinite Loop Breaker',
    description: 'Detects and breaks infinite loops before they crash your program. Smart algorithm identifies potential endless iterations.',
    price: 39.99,
    category: 'logic',
    image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.5,
    reviews: 87,
    compatibleWith: ['All Languages']
  },
  {
    id: '4',
    name: 'Memory Leak Detector',
    description: 'Advanced tool that identifies and patches memory leaks in your application, improving performance and stability.',
    price: 59.99,
    category: 'performance',
    image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.8,
    reviews: 112,
    compatibleWith: ['C', 'C++', 'Rust']
  },
  {
    id: '5',
    name: 'SQL Injection Firewall',
    description: 'Protects your database from malicious SQL injection attacks with intelligent input sanitization.',
    price: 79.99,
    category: 'security',
    image: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.9,
    reviews: 203,
    compatibleWith: ['SQL', 'PHP', 'Node.js']
  },
  {
    id: '6',
    name: 'Race Condition Resolver',
    description: 'Identifies and fixes race conditions in your multithreaded code, ensuring data consistency and preventing crashes.',
    price: 69.99,
    category: 'logic',
    image: 'https://images.pexels.com/photos/2653362/pexels-photo-2653362.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.6,
    reviews: 95,
    compatibleWith: ['Java', 'C#', 'Go']
  },
  {
    id: '7',
    name: 'Dependency Hell Escape Pod',
    description: 'Resolves complex dependency conflicts and version mismatches in your project with one click.',
    price: 49.99,
    category: 'runtime',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.7,
    reviews: 134,
    compatibleWith: ['JavaScript', 'Python', 'Ruby']
  },
  {
    id: '8',
    name: 'Off-by-One Error Corrector',
    description: 'Detects and fixes off-by-one errors in your loops and array accesses, preventing index out of bounds exceptions.',
    price: 29.99,
    category: 'logic',
    image: 'https://images.pexels.com/photos/4709285/pexels-photo-4709285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.5,
    reviews: 76,
    compatibleWith: ['All Languages']
  }
];

export const categories = [
  { id: 'all', name: 'All Fixes' },
  { id: 'runtime', name: 'Runtime Errors' },
  { id: 'syntax', name: 'Syntax Errors' },
  { id: 'logic', name: 'Logic Errors' },
  { id: 'performance', name: 'Performance Issues' },
  { id: 'security', name: 'Security Vulnerabilities' }
];

export const paymentMethods: Record<string, any>[] = [
  {
    id: '1',
    type: 'card',
    last4: '4242',
    expiryDate: '04/25',
    cardType: 'Visa',
    isDefault: true
  },
  {
    id: '2',
    type: 'paypal',
    isDefault: false
  },
  {
    id: '3',
    type: 'applepay',
    isDefault: false
  }
];

export const addresses = [
  {
    id: '1',
    name: 'Home',
    line1: '123 Code Street',
    line2: 'Apt 404',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94107',
    country: 'USA',
    isDefault: true
  },
  {
    id: '2',
    name: 'Work',
    line1: '555 Tech Avenue',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94103',
    country: 'USA',
    isDefault: false
  }
];