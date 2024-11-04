export const generateMenuConfig = (collections, categories) => {
    return [
        {
            id: 'collections',
            label: 'COLLECTIONS',
            path: '/collections',
            items: collections.map(collection => ({
                id: collection.path,
                label: collection.name,
                path: `/collections/${collection.path}`,
            })),
        },
        {
            id: 'categories',
            label: 'CATEGORIES',
            path: '/categories',
            items: categories.map(category => ({
                id: category.path,
                label: category.name,
                path: `/categories/${category.path}`,
            })),
        },
        // {
        //     id: 'more',
        //     label: 'MORE',
        //     path: '/more',
        //     items: [
        //         {
        //             id: 'new-arrivals',
        //             label: 'New Arrivals',
        //             path: '/explore/new-arrivals',
        //         },
        //         {
        //             id: 'bestsellers',
        //             label: 'Bestsellers',
        //             path: '/explore/bestsellers',
        //         },
        //         {
        //             id: 'trending',
        //             label: 'Trending Now',
        //             path: '/explore/trending',
        //         },
        //         {
        //             id: 'sale',
        //             label: 'Sale',
        //             path: '/explore/sale',
        //         },
        //     ],
        // },
    ]
}
