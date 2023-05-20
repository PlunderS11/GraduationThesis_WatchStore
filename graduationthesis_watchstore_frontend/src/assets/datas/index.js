const menuHeader = [
    { title: 'home', link: '/' },
    { title: 'man', link: '/product-category/man' },
    { title: 'woman', link: '/product-category/woman' },
    { title: 'accessory', link: '/product-category/accessory' },
    { title: 'gallery', link: '/gallery' },
    { title: 'blogs', link: '/blogs' },
    { title: 'aboutUs', link: '/about-us' },
];

const accountOptions = [
    { path: '/account/profile', name: 'userInfo' },
    { path: '/account/orders', name: 'orderInfo' },
    { path: '/account/notification', name: 'notification' },
    { path: '/account/address', name: 'addressInfo' },
    { path: '/account/voucher', name: 'voucher' },
    { path: '/account/changePassword', name: 'changePassword' },
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
        ],
    },
    {
        titlevi: 'Liên hệ',
        titleen: 'Contact',
        list: [
            {
                titlevi: 'Điện thoại: 0888 244 212',
                titleen: 'Hotline: 0888 244 212',
                link: '/',
            },
            {
                titlevi: 'Zalo: 0888 244 212',
                titleen: 'Zalo: 0888 244 212',
                link: '/',
            },
            {
                titlevi: 'Viber: 0888 244 212',
                titleen: 'Viber: 0888 244 212',
                link: '/',
            },
        ],
    },
];

const showrooms = [
    {
        namevi: 'SHOWROOM 1 VÀ BẢO HÀNH MYNH BAKE',
        nameen: 'SHOWROOM 1 AND MYNH BAKE WARRANTY',
        addressvi: 'Số 12 Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, Thành phố Hồ Chí Minh',
        addressen: '12 Nguyen Van Luong, Ward 17, District Go Vap, Ho Chi Minh City.',
        hotline: '0888 244 212',
    },
    {
        namevi: 'SHOWROOM 2',
        nameen: 'SHOWROOM 2',
        addressvi: 'Số 12 Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, Thành phố Hồ Chí Minh',
        addressen: '12 Nguyen Van Luong, Ward 17, District Go Vap, Ho Chi Minh City.',
        hotline: '0888 244 212',
    },
];

const orderStatus = {
    all: '',
    pending: 'PENDING',
    package: 'PACKAGE',
    delivering: 'DELIVERING',
    complete: 'COMPLETE',
    cancel: 'CANCEL',
};

export { menuFooter, accountOptions, showrooms, menuHeader, orderStatus };
