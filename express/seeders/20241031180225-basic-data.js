// seeders/20241101000001-basic-data.js
'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const getRandomStock = () => {
  const stocks = [10, 15, 20, 25];
  return stocks[Math.floor(Math.random() * stocks.length)];
};

const getRandomSizes = () => {
  const allSizes = [1, 2, 3, 4]; // S, M, L, XL
  const numberOfSizes = Math.floor(Math.random() * 3) + 2; // 2-4 sizes
  // Shuffle array and take first n elements
  return allSizes
    .sort(() => Math.random() - 0.5)
    .slice(0, numberOfSizes)
    .sort((a, b) => a - b); // Sort back in ascending order
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert roles
    await queryInterface.bulkInsert('roles', [
      {
        id: 1,
        name: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'superadmin',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Create test users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = [
      {
        id: uuidv4(),
        email: 'user@example.com',
        name: 'Test User',
        nickname: 'Regular User',
        password: hashedPassword,
        role_id: 1, // user
        accept_policy: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        email: 'admin@example.com',
        name: 'Test Admin',
        nickname: 'Store Admin',
        password: hashedPassword,
        role_id: 2, // admin
        accept_policy: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        email: 'superadmin@example.com',
        name: 'Test Superadmin',
        nickname: 'Super Admin',
        password: hashedPassword,
        role_id: 3, // superadmin
        accept_policy: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('users', users);

    // Insert collections
    await queryInterface.bulkInsert('collections', [
      {
        id: 1,
        name: 'Summer Collection',
        path: 'summer-collection',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Winter Collection',
        path: 'winter-collection',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Insert categories
    await queryInterface.bulkInsert('categories', [
      {
        id: 1,
        name: 'T-Shirts',
        path: 't-shirts',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Jackets',
        path: 'jackets',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'Pants',
        path: 'pants',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Insert sizes
    await queryInterface.bulkInsert('sizes', [
      {
        id: 1,
        size: 'S',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        size: 'M',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        size: 'L',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        size: 'XL',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Insert order statuses
    await queryInterface.bulkInsert('order_statuses', [
      {
        id: 1,
        name: 'Pending',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Processing',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'Shipped',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        name: 'Delivered',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        name: 'Cancelled',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Insert products
    const products = [
      // Summer Collection - T-Shirts
      {
        id: uuidv4(),
        name: 'Classic White T-Shirt',
        description: 'Comfortable cotton classic white t-shirt, perfect for everyday wear',
        price: 150000.00,
        total_stock: 60,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Vintage Black Tee',
        description: 'Soft cotton blend black t-shirt with a vintage wash effect',
        price: 175000.00,
        total_stock: 45,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Striped Navy T-Shirt',
        description: 'Classic navy and white striped t-shirt in breathable fabric',
        price: 165000.00,
        total_stock: 50,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Summer Graphic Tee',
        description: 'Fun graphic print t-shirt perfect for beach days',
        price: 185000.00,
        total_stock: 40,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Essential Gray T-Shirt',
        description: 'Versatile gray t-shirt made from premium cotton',
        price: 145000.00,
        total_stock: 55,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Pastel Pink T-Shirt',
        description: 'Soft pastel pink t-shirt perfect for summer style',
        price: 155000.00,
        total_stock: 40,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Mint Green Summer Tee',
        description: 'Cool mint green t-shirt with breathable fabric',
        price: 160000.00,
        total_stock: 45,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Palm Tree Print T-Shirt',
        description: 'Tropical palm tree print t-shirt for beach vibes',
        price: 180000.00,
        total_stock: 35,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Yellow Sunshine Tee',
        description: 'Bright yellow t-shirt perfect for sunny days',
        price: 155000.00,
        total_stock: 40,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Coral Reef T-Shirt',
        description: 'Vibrant coral colored t-shirt with soft touch finish',
        price: 165000.00,
        total_stock: 45,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Ocean Blue Tee',
        description: 'Calming ocean blue t-shirt with wave pattern',
        price: 170000.00,
        total_stock: 50,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Sunset Orange T-Shirt',
        description: 'Warm sunset orange t-shirt for summer evenings',
        price: 160000.00,
        total_stock: 40,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Pineapple Print Tee',
        description: 'Fun pineapple print t-shirt for tropical style',
        price: 175000.00,
        total_stock: 35,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Lavender Dream T-Shirt',
        description: 'Soft lavender t-shirt with relaxed fit',
        price: 165000.00,
        total_stock: 45,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Beach Life Graphic Tee',
        description: 'Beach themed graphic t-shirt with vintage print',
        price: 180000.00,
        total_stock: 40,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Azure Sky T-Shirt',
        description: 'Light blue t-shirt inspired by summer skies',
        price: 155000.00,
        total_stock: 50,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
    
      // Summer Jackets (16 items)
      {
        id: uuidv4(),
        name: 'Light Denim Jacket',
        description: 'Perfect lightweight denim jacket for summer evenings',
        price: 450000.00,
        total_stock: 40,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'White Linen Blazer',
        description: 'Elegant white linen blazer for summer formal occasions',
        price: 550000.00,
        total_stock: 35,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Cropped Jean Jacket',
        description: 'Trendy cropped denim jacket for summer style',
        price: 425000.00,
        total_stock: 45,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Cotton Canvas Jacket',
        description: 'Light cotton canvas jacket in khaki',
        price: 385000.00,
        total_stock: 50,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Pastel Bomber Jacket',
        description: 'Lightweight bomber jacket in summer pastels',
        price: 475000.00,
        total_stock: 40,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Linen Blend Jacket',
        description: 'Breathable linen blend jacket for summer comfort',
        price: 495000.00,
        total_stock: 35,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Striped Resort Blazer',
        description: 'Striped blazer perfect for resort wear',
        price: 525000.00,
        total_stock: 30,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Beach Cover-Up Jacket',
        description: 'Light and airy beach cover-up jacket',
        price: 350000.00,
        total_stock: 45,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Seersucker Blazer',
        description: 'Classic seersucker blazer for summer events',
        price: 575000.00,
        total_stock: 35,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Chambray Shirt Jacket',
        description: 'Versatile chambray shirt jacket for layering',
        price: 425000.00,
        total_stock: 40,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Tropical Print Bomber',
        description: 'Lightweight bomber with tropical print',
        price: 485000.00,
        total_stock: 35,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Safari Style Jacket',
        description: 'Classic safari style jacket in light cotton',
        price: 495000.00,
        total_stock: 40,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Cropped Linen Blazer',
        description: 'Modern cropped blazer in pure linen',
        price: 525000.00,
        total_stock: 35,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Summer Windbreaker',
        description: 'Ultra-light windbreaker for summer breezes',
        price: 395000.00,
        total_stock: 45,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Cotton Utility Jacket',
        description: 'Practical utility jacket in lightweight cotton',
        price: 445000.00,
        total_stock: 40,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Pastel Denim Jacket',
        description: 'Soft pastel colored denim jacket',
        price: 465000.00,
        total_stock: 35,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
    
      // Summer Pants (16 items)
      {
        id: uuidv4(),
        name: 'Linen Beach Pants',
        description: 'Comfortable linen pants perfect for beach days',
        price: 295000.00,
        total_stock: 50,
        collection_id: 1,
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Light Chino Pants',
        description: 'Classic light chino pants in khaki',
        price: 325000.00,
        total_stock: 45,
        collection_id: 1,
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Summer Cotton Pants',
        description: 'Breathable cotton pants in light beige',
        price: 315000.00,
        total_stock: 40,
        collection_id: 1,
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Cropped Linen Pants',
        description: 'Cropped linen pants perfect for summer',
        price: 285000.00,
        total_stock: 45,
        collection_id: 1,
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Relaxed Fit Pants',
        description: 'Comfortable relaxed fit pants in light gray',
        price: 335000.00,
        total_stock: 40,
        collection_id: 1,
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Striped Summer Pants',
        description: 'Light striped pants in cotton blend',
        price: 345000.00,
        total_stock: 35,
        collection_id: 1,
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'White Linen Pants',
        description: 'Classic white linen pants for summer',
        price: 375000.00,
        total_stock: 40,
        collection_id: 1,
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },    
      {
        id: uuidv4(),
        name: 'Rainbow Stripe T-Shirt',
        description: 'Colorful rainbow striped t-shirt for vibrant summer looks',
        price: 185000.00,
        total_stock: 45,
        collection_id: 1,
        category_id: 1, // T-Shirts
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Safari Linen Pants',
        description: 'Adventure-ready linen pants with multiple pockets',
        price: 365000.00,
        total_stock: 35,
        collection_id: 1,
        category_id: 3, // Pants
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Floral Print Blazer',
        description: 'Light summer blazer with delicate floral print',
        price: 495000.00,
        total_stock: 30,
        collection_id: 1,
        category_id: 2, // Jackets
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Tie-Dye Summer Tee',
        description: 'Hand-dyed tie-dye t-shirt in summer colors',
        price: 195000.00,
        total_stock: 40,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Drawstring Beach Pants',
        description: 'Easy-wear beach pants with comfortable drawstring',
        price: 275000.00,
        total_stock: 50,
        collection_id: 1,
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Mesh Panel T-Shirt',
        description: 'Athletic t-shirt with breathable mesh panels',
        price: 215000.00,
        total_stock: 45,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Lightweight Kimono Jacket',
        description: 'Elegant kimono-style summer jacket in floral print',
        price: 445000.00,
        total_stock: 35,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Cargo Shorts Pants',
        description: 'Convertible cargo pants with zip-off legs',
        price: 385000.00,
        total_stock: 40,
        collection_id: 1,
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Retro Surf T-Shirt',
        description: 'Vintage-inspired surf graphic t-shirt',
        price: 175000.00,
        total_stock: 55,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Linen Blend Cardigan',
        description: 'Light summer cardigan in linen cotton blend',
        price: 425000.00,
        total_stock: 40,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Bamboo Fiber T-Shirt',
        description: 'Eco-friendly bamboo fiber t-shirt with natural cooling',
        price: 225000.00,
        total_stock: 45,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Cropped Wide Leg Pants',
        description: 'Trendy cropped wide leg pants for summer comfort',
        price: 355000.00,
        total_stock: 40,
        collection_id: 1,
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Embroidered Denim Jacket',
        description: 'Light denim jacket with floral embroidery',
        price: 525000.00,
        total_stock: 30,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'UV Protection T-Shirt',
        description: 'Sun-protective t-shirt with UPF 50+ rating',
        price: 235000.00,
        total_stock: 50,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Paperbag Waist Pants',
        description: 'Stylish paperbag waist pants in lightweight fabric',
        price: 345000.00,
        total_stock: 45,
        collection_id: 1,
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Summer Duster Jacket',
        description: 'Long lightweight duster jacket for beach coverup',
        price: 465000.00,
        total_stock: 35,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Moisture Wicking T-Shirt',
        description: 'High-performance moisture wicking t-shirt',
        price: 195000.00,
        total_stock: 55,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Palazzo Style Pants',
        description: 'Flowing palazzo pants in light summer fabric',
        price: 375000.00,
        total_stock: 40,
        collection_id: 1,
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Festival Fringe Jacket',
        description: 'Boho-style jacket with playful fringe details',
        price: 485000.00,
        total_stock: 30,
        collection_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Beach Volleyball T-Shirt',
        description: 'Athletic t-shirt designed for beach sports',
        price: 185000.00,
        total_stock: 50,
        collection_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },

      // Winter Collection - Jackets
      {
        id: uuidv4(),
        name: 'Black Leather Jacket',
        description: 'Stylish black leather jacket with quilted lining for winter',
        price: 750000.00,
        total_stock: 40,
        collection_id: 2,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Wool Peacoat',
        description: 'Classic wool peacoat in navy blue for elegant winter style',
        price: 850000.00,
        total_stock: 35,
        collection_id: 2,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Quilted Puffer Jacket',
        description: 'Warm and lightweight puffer jacket with modern quilting',
        price: 650000.00,
        total_stock: 45,
        collection_id: 2,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Denim Jacket',
        description: 'Classic denim jacket with sherpa lining for extra warmth',
        price: 550000.00,
        total_stock: 40,
        collection_id: 2,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Bomber Jacket',
        description: 'Modern bomber jacket with ribbed cuffs and collar',
        price: 495000.00,
        total_stock: 50,
        collection_id: 2,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },

      // Winter Collection - Pants
      {
        id: uuidv4(),
        name: 'Wool Dress Pants',
        description: 'Elegant wool blend dress pants for winter formal occasions',
        price: 450000.00,
        total_stock: 40,
        collection_id: 2,
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Thermal Cargo Pants',
        description: 'Insulated cargo pants with multiple pockets for winter utility',
        price: 425000.00,
        total_stock: 45,
        collection_id: 2,
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Fleece-Lined Jeans',
        description: 'Classic denim jeans with warm fleece lining for winter',
        price: 475000.00,
        total_stock: 35,
        collection_id: 2,
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },

      // Winter Collection - T-Shirts (Long Sleeve)
      {
        id: uuidv4(),
        name: 'Thermal Long Sleeve Tee',
        description: 'Warm thermal long sleeve t-shirt in classic black',
        price: 225000.00,
        total_stock: 55,
        collection_id: 2,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Turtleneck T-Shirt',
        description: 'Cozy cotton turtleneck t-shirt for layering',
        price: 245000.00,
        total_stock: 45,
        collection_id: 2,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Merino Wool Base Layer',
        description: 'Premium merino wool base layer t-shirt for ultimate warmth',
        price: 295000.00,
        total_stock: 40,
        collection_id: 2,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Henley Long Sleeve',
        description: 'Classic henley style long sleeve t-shirt in waffle knit',
        price: 235000.00,
        total_stock: 50,
        collection_id: 2,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('products', products);

    // Insert product sizes
    const productSizes = [];
    for (const product of products) {
      // Get random sizes for this product
      const sizes = getRandomSizes();
      
      // Add selected sizes with random stock
      for (const sizeId of sizes) {
        productSizes.push({
          id: uuidv4(),
          product_id: product.id,
          size_id: sizeId,
          stock: getRandomStock(),
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }

    await queryInterface.bulkInsert('product_sizes', productSizes);

    // Create empty cart for each user
    for (const user of users) {
      await queryInterface.bulkInsert('carts', [{
        id: uuidv4(),
        user_id: user.id,
        total_price: 0,
        total_item: 0,
        created_at: new Date(),
        updated_at: new Date()
      }]);

      // Create empty wishlist for each user
      await queryInterface.bulkInsert('wishlists', [{
        id: uuidv4(),
        user_id: user.id,
        created_at: new Date(),
        updated_at: new Date()
      }]);
    }

    return true;
  },

  down: async (queryInterface, Sequelize) => {
    // Delete in reverse order of dependencies
    await queryInterface.bulkDelete('wishlists', null, {});
    await queryInterface.bulkDelete('carts', null, {});
    await queryInterface.bulkDelete('product_sizes', null, {});
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('order_statuses', null, {});
    await queryInterface.bulkDelete('sizes', null, {});
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkDelete('collections', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('roles', null, {});
    return true;
  }
};