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
        getItem('Thứ hạng khách hàng', ['2', '/ranks']),
        getItem('Nhân viên', ['3', '/staffs']),
    ]),
    {
        type: 'divider',
    },
    getItem('Quản lý sản phẩm', 'sub3', <Storefront />, [
        getItem('Sản phẩm', ['4', '/products']),
        getItem('Danh mục', ['5', '/collections']),
    ]),
    {
        type: 'divider',
    },
    getItem('Quản lý hóa đơn', 'sub4', <AttachMoney />, [
        getItem('Hóa đơn', ['6', '/orders']),
        getItem('Khuyến mãi', ['7', '/promotions']),
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
