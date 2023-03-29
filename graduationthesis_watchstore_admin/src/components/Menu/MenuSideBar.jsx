// import { MailOutlined, SettingOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { LineStyle, PermIdentity, Storefront, AttachMoney } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import './MenuSideBar.css';
function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
const items = [
    getItem('Trang chủ', ['sub1', '/'], <LineStyle />),
    {
        type: 'divider',
    },
    getItem('Quản lý người dùng', 'sub2', <PermIdentity />, [
        getItem('Khách hàng', ['1', '/users']),
        getItem('Nhân viên', ['2', '/']),
    ]),
    {
        type: 'divider',
    },
    getItem('Quản lý sản phẩm', 'sub3', <Storefront />, [
        getItem('Sản phẩm', ['3', '/products']),
        getItem('Danh mục', ['4', '/collections']),
    ]),
    {
        type: 'divider',
    },
    getItem('Quản lý hóa đơn', 'sub4', <AttachMoney />, [
        getItem('Hóa đơn', ['5', '/orders']),
        getItem('Khuyến mãi', ['6', '/promotions']),
    ]),
];
const MenuSideBar = () => {
    const navigate = useNavigate();
    const onClick = (e) => {
        // console.log('click ', e.key.split(',')[1]);
        navigate(e.key.split(',')[1]);
    };
    return (
        <Menu
            onClick={onClick}
            style={{
                width: 256,
            }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
        />
    );
};
export default MenuSideBar;
