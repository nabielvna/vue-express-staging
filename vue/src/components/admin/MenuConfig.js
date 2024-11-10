export const iconPaths = {
    dashboard:
        'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    orders: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    products: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    collections:
        'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    categories:
        'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
    roles: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    bell: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    settings:
        'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
}

export const menuItems = [
    {
        name: 'Dashboard',
        path: '/admin/dashboard',
        svgPath: iconPaths.dashboard,
    },
    { name: 'Orders', path: '/admin/orders', svgPath: iconPaths.orders },
    { name: 'Users', path: '/admin/users', svgPath: iconPaths.users },
    { name: 'Products', path: '/admin/products', svgPath: iconPaths.products },
    {
        name: 'Collections',
        path: '/admin/collections',
        svgPath: iconPaths.collections,
    },
    {
        name: 'Categories',
        path: '/admin/categories',
        svgPath: iconPaths.categories,
    },
    { name: 'Roles', path: '/admin/roles', svgPath: iconPaths.roles },
]

export const statsData = [
    {
        title: 'Total Revenue',
        value: 'Rp666.666.666',
        trend: 12.5,
        bgColor: 'bg-blue-500',
        svgPath: iconPaths.dashboard,
    },
    {
        title: 'Total Orders',
        value: '6,666',
        trend: 8.2,
        bgColor: 'bg-green-500',
        svgPath: iconPaths.orders,
    },
    {
        title: 'Total Users',
        value: '9,271',
        trend: -2.4,
        bgColor: 'bg-purple-500',
        svgPath: iconPaths.users,
    },
    {
        title: 'Total Products',
        value: '892',
        trend: 4.1,
        bgColor: 'bg-orange-500',
        svgPath: iconPaths.products,
    },
]

export const recentActivities = [
    {
        id: 1,
        description: 'New order #1234 from John Doe',
        time: '5 minutes ago',
        svgPath: iconPaths.orders,
    },
    {
        id: 2,
        description: 'User Sarah Wilson registered',
        time: '10 minutes ago',
        svgPath: iconPaths.users,
    },
    {
        id: 3,
        description: 'Product "iPhone 13" updated',
        time: '1 hour ago',
        svgPath: iconPaths.products,
    },
    {
        id: 4,
        description: 'New collection "Summer 2024" created',
        time: '2 hours ago',
        svgPath: iconPaths.collections,
    },
]

export const ordersData = [
    {
        id: '1234',
        customer: 'John Doe',
        email: 'john@example.com',
        status: 'pending',
        date: '2024-11-04',
        total: 125.0,
    },
    {
        id: '1235',
        customer: 'Jane Smith',
        email: 'jane@example.com',
        status: 'processing',
        date: '2024-11-03',
        total: 249.999,
    },
    {
        id: '1236',
        customer: 'Robert Johnson',
        email: 'robert@example.com',
        status: 'completed',
        date: '2024-11-02',
        total: 599.999,
    },
    {
        id: '1237',
        customer: 'Sarah Williams',
        email: 'sarah@example.com',
        status: 'cancelled',
        date: '2024-11-01',
        total: 79.999,
    },
    {
        id: '1238',
        customer: 'Gayu Sitanggang',
        email: 'gayu@example.com',
        status: 'completed',
        date: '2024-10-27',
        total: 666.666,
    },
]

export const usersData = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-03-01 09:30',
        avatar: '/api/placeholder/40/40',
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        status: 'active',
        lastLogin: '2024-03-02 14:20',
        avatar: '/api/placeholder/40/40',
    },
    {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'editor',
        status: 'inactive',
        lastLogin: '2024-02-28 16:45',
        avatar: '/api/placeholder/40/40',
    },
    {
        id: 4,
        name: 'Gayu Sitanggang',
        email: 'gayu@example.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-02-28 16:45',
        avatar: '/api/placeholder/40/40',
    },
    {
        id: 5,
        name: 'Furstin Aprilavia Putri',
        email: 'via@example.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-02-28 16:45',
        avatar: '/api/placeholder/40/40',
    },
]

export const tableHeaders = [
    { key: 'user', label: 'User' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'lastLogin', label: 'Last Login' },
]

export const productsData = [
    {
        id: 1,
        name: 'Project DYSTOPIAN - Spectrum',
        price: 369000,
        category: 'Tops',
        status: 'in_stock',
        stock: 666,
        image: '../dystopian1.jpg',
        collection: 1,
        lastUpdated: '2024-03-01',
    },
    {
        id: 2,
        name: 'Project DYSTOPIAN - Purpureal',
        price: 196000,
        category: 'Tops',
        status: 'in_stock',
        stock: 23,
        image: '../dystopian2.jpg',
        collection: 1,
        lastUpdated: '2024-03-02',
    },
    {
        id: 3,
        name: 'Project DYSTOPIAN - Mutation',
        price: 196000,
        category: 'Accessories',
        status: 'low_stock',
        stock: 5,
        image: '../dystopian3.jpg',
        collection: 1,
        lastUpdated: '2024-03-01',
    },
    {
        id: 4,
        name: 'Project DYSTOPIAN - Umbra',
        price: 96000,
        category: 'Accessories',
        status: 'out_of_stock',
        stock: 0,
        image: '../dystopian4.jpg',
        collection: 1,
        lastUpdated: '2024-02-28',
    },
    {
        id: 4,
        name: 'Catharsis EMPIRE - Izanagiryū & Izanamiryū',
        price: 969000,
        category: 'Jackets',
        status: 'in_stock',
        stock: 666,
        image: '../catharsisempire1.jpg',
        collection: 2,
        lastUpdated: '2024-02-28',
    },
]

export const productTableHeaders = [
    { key: 'product', label: 'Product' },
    { key: 'price', label: 'Price' },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Status' },
    { key: 'stock', label: 'Stock' },
    { key: 'collection', label: 'Collection' }, // Mengganti SKU dengan Collection
    { key: 'lastUpdated', label: 'Last Updated' },
]

export const productCategories = [
    'Tops',
    'Jumpers',
    'Jackets',
    'Bottoms',
    'Accessories',
]

export const collectionsData = [
    {
        id: 1,
        name: 'PROJECT DYSTOPIAN',
        description: 'Latest summer fashion and accessories',
        status: 'active',
        productsCount: 45,
        image: '/api/placeholder/200/100',
        featuredImage: '/projectdystopian.png',
        startDate: '2024-06-01',
        endDate: '2024-08-31',
    },
    {
        id: 2,
        name: 'CATHARSIS EMPIRE',
        description: 'Essential supplies for students',
        status: 'scheduled',
        productsCount: 78,
        image: '/api/placeholder/200/100',
        featuredImage: '/catharsisempire.png',
        startDate: '2024-08-01',
        endDate: '2024-09-15',
    },
    {
        id: 3,
        name: 'CATHARSIS REBORN',
        description: 'Special discounts on spring items',
        status: 'ended',
        productsCount: 32,
        image: '/api/placeholder/200/100',
        featuredImage: '/catharsisreborn.png',
        startDate: '2024-03-01',
        endDate: '2024-04-30',
    },
]

export const collectionStatuses = [
    { value: 'active', label: 'Active' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'ended', label: 'Ended' },
    { value: 'draft', label: 'Draft' },
]

export const categoriesData = [
    {
        id: 1,
        name: 'Tops',
        slug: 'electronics',
        description: 'Electronic devices and accessories',
        productsCount: 156,
        subcategories: ['-'],
        image: '/api/placeholder/80/80',
        status: 'active',
    },
    {
        id: 2,
        name: 'Jumpers',
        slug: 'clothing',
        description: 'Fashion and apparel',
        productsCount: 243,
        subcategories: ['-'],
        image: '/api/placeholder/80/80',
        status: 'active',
    },
    {
        id: 3,
        name: 'Jackets',
        slug: 'home-living',
        description: 'Home decor and furniture',
        productsCount: 98,
        subcategories: ['-'],
        image: '/api/placeholder/80/80',
        status: 'active',
    },
    {
        id: 4,
        name: 'Bottoms',
        slug: 'books',
        description: 'Books and publications',
        productsCount: 312,
        subcategories: ['-'],
        image: '/api/placeholder/80/80',
        status: 'inactive',
    },
    {
        id: 5,
        name: 'Accesories',
        slug: 'books',
        description: 'Books and publications',
        productsCount: 312,
        subcategories: ['-'],
        image: '/api/placeholder/80/80',
        status: 'inactive',
    },
]

export const rolesData = [
    {
        id: 1,
        name: 'Super Admin',
        description: 'Full system access',
        usersCount: 2,
        permissions: [
            'manage_users',
            'manage_roles',
            'manage_products',
            'manage_orders',
            'manage_settings',
            'view_analytics',
        ],
        createdAt: '2024-01-01',
    },
    {
        id: 2,
        name: 'Store Manager',
        description: 'Manage store operations',
        usersCount: 5,
        permissions: ['manage_products', 'manage_orders', 'view_analytics'],
        createdAt: '2024-01-15',
    },
    {
        id: 3,
        name: 'Content Editor',
        description: 'Manage content and products',
        usersCount: 8,
        permissions: [
            'manage_products',
            'manage_collections',
            'manage_categories',
        ],
        createdAt: '2024-02-01',
    },
    {
        id: 4,
        name: 'Customer Support',
        description: 'Handle customer inquiries',
        usersCount: 12,
        permissions: ['view_orders', 'manage_returns', 'view_customers'],
        createdAt: '2024-02-15',
    },
]

export const availablePermissions = [
    { id: 'manage_users', name: 'Manage Users' },
    { id: 'manage_roles', name: 'Manage Roles' },
    { id: 'manage_products', name: 'Manage Products' },
    { id: 'manage_orders', name: 'Manage Orders' },
    { id: 'manage_collections', name: 'Manage Collections' },
    { id: 'manage_categories', name: 'Manage Categories' },
    { id: 'manage_settings', name: 'Manage Settings' },
    { id: 'view_analytics', name: 'View Analytics' },
    { id: 'view_orders', name: 'View Orders' },
    { id: 'manage_returns', name: 'Manage Returns' },
    { id: 'view_customers', name: 'View Customers' },
]
