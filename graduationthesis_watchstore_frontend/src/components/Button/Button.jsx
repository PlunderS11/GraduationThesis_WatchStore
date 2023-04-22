import { memo } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { LoadingOutlined } from '@ant-design/icons';

import style from './Button.module.scss';

const cx = classNames.bind(style);

const Button = ({ children, href, to, customClass, loading, onclick, ...passProps }) => {
    let Tag = 'button';
    const props = { ...passProps };
    if (href) {
        Tag = 'a';
        props.href = href;
    } else if (to) {
        Tag = Link;
        props.to = to;
    }
    return (
        <Tag disabled={loading} className={cx('button', customClass?.['button'])} {...props} onClick={onclick}>
            {loading && (
                <div className={cx('loading-icon')}>
                    <LoadingOutlined style={{ fontSize: '200%' }} />
                </div>
            )}
            <div className={cx('text')}>{children}</div>
        </Tag>
    );
};

export default memo(Button);
