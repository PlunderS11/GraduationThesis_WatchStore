const menuHeader = [
    { title: 'home', link: '/' },
    { title: 'man', link: '/product-category/man' },
    { title: 'woman', link: '/product-category/woman' },
    { title: 'box', link: '/product-category/box' },
    { title: 'accessory', link: '/product-category/accessory' },
    { title: 'gallery', link: '/gallery' },
    { title: 'blogs', link: '/blogs' },
    { title: 'aboutUs', link: '/about-us' },
];

const accountOptions = [
    { path: '/account/profile', name: 'userInfo' },
    { path: '/account/orders', name: 'orderInfo' },
    { path: '/account/address', name: 'addressInfo' },
    { path: '/', name: 'logout' },
];

const menuFooter = [
    {
        titlevi: 'Sản phẩm',
        titleen: 'Products',
        list: [
            {
                titlevi: 'Đồng hồ nam',
                titleen: "Men's Watches",
                link: '/product-category/man',
            },
            {
                titlevi: 'Đồng hồ nữ',
                titleen: "Women's Watches",
                link: '/product-category/woman',
            },
            {
                titlevi: 'Hộp',
                titleen: 'The box',
                link: '/product-category/box',
            },
            {
                titlevi: 'Phụ kiện',
                titleen: 'Accessory',
                link: '/product-category/accessory',
            },
        ],
    },
    {
        titlevi: 'Về MYNH BAKE',
        titleen: 'About MYNH BAKE',
        list: [
            {
                titlevi: 'Giới thiệu',
                titleen: 'Introduce',
                link: '/about-us',
            },
            {
                titlevi: 'Bài viết',
                titleen: 'Blogs',
                link: '/blogs',
            },
            {
                titlevi: 'Câu hỏi thường gặp',
                titleen: 'FAQ',
                link: '/',
            },
            {
                titlevi: 'Thanh toán & giao nhận',
                titleen: 'Payment & shipping',
                link: '/',
            },
            {
                titlevi: 'Chế độ bảo hành',
                titleen: 'Warranty policy',
                link: '/',
            },
            {
                titlevi: 'Liên hệ',
                titleen: 'Contact',
                link: '/',
            },
        ],
    },
    {
        titlevi: 'Cộng đồng',
        titleen: 'Social',
        list: [
            {
                titlevi: 'Instagram',
                titleen: 'Instagram',
                link: '/',
            },
            {
                titlevi: 'Facebook',
                titleen: 'Facebook',
                link: '/',
            },
            {
                titlevi: 'Youtube',
                titleen: 'Youtube',
                link: '/',
            },
            {
                titlevi: 'Pinterest',
                titleen: 'Pinterest',
                link: '/',
            },
        ],
    },
    {
        titlevi: 'Liên hệ',
        titleen: 'Contact',
        list: [
            {
                titlevi: 'Điện thoại: 0123 456 789',
                titleen: 'Hotline: 0123 456 789',
                link: '/',
            },
            {
                titlevi: 'Zalo: 0123 456 789',
                titleen: 'Zalo: 0123 456 789',
                link: '/',
            },
            {
                titlevi: 'Viber: 0123 456 789',
                titleen: 'Viber: 0123 456 789',
                link: '/',
            },
        ],
    },
];

const showrooms = [
    {
        namevi: 'SHOWROOM 1 VÀ BẢO HÀNH MYNH BAKE',
        nameen: 'SHOWROOM 1 AND MYNH BAKE WARRANTY',
        addressvi: '453/32 Nguyễn Đình Chiểu, Phường 5, Quận 3, Thành Phố Hồ Chí Minh.',
        addressen: '453/32 Nguyen Dinh Chieu, Ward 5, District 3, Ho Chi Minh City.',
        hotline: '0123 456 789',
    },
    {
        namevi: 'SHOWROOM 2',
        nameen: 'SHOWROOM 2',
        addressvi: '3/31 Thành Thái, Phường 14, Quận 10, Thành Phố Hồ Chí Minh.',
        addressen: '3/31 Thanh Thai, Ward 14, District 10, Ho Chi Minh City.',
        hotline: '0123 456 789',
    },
];

export { menuFooter, accountOptions, showrooms, menuHeader };
